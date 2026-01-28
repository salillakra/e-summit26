import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TeamRow = {
  id: string;
  slug: string;
  name: string;
  team_leader_id: string;
  created_at: string;
};

type EventRow = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  max_score: number;
  date: string | null;
  location: string | null;
  image_url: string | null;
  is_active: boolean | null;
};

type EventResultRow = {
  event_id: string;
  team_id: string;
  rank: number;
  marks: number;
  declared_at: string | null;
};

function parseBool(v: string | null) {
  if (!v) return false;
  return ["1", "true", "yes", "y", "on"].includes(v.toLowerCase());
}

function json(
  data: unknown,
  init?: ResponseInit & { cacheSeconds?: number }
) {
  const cacheSeconds = init?.cacheSeconds ?? 15;
  const headers = new Headers(init?.headers);
  headers.set(
    "Cache-Control",
    `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 6}`
  );
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new NextResponse(JSON.stringify(data), { ...init, headers });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const eventId = params.eventId;

  if (!UUID_RE.test(eventId)) {
    return json(
      { ok: false, error: "Invalid eventId (expected UUID)." },
      { status: 400, cacheSeconds: 0 }
    );
  }

  const url = new URL(req.url);
  const includeMembers = parseBool(url.searchParams.get("includeMembers"));

  const sb = supabaseAdmin();

  // 1) Event meta
  const { data: event, error: eventErr } = await sb
    .from("events")
    .select(
      "id,name,category,description,max_score,date,location,image_url,is_active"
    )
    .eq("id", eventId)
    .single<EventRow>();

  if (eventErr || !event) {
    return json(
      { ok: false, error: "Event not found.", details: eventErr?.message },
      { status: 404, cacheSeconds: 0 }
    );
  }

  // 2) Results (no embedded join to avoid Team[] typing)
  const { data: results, error: resErr } = await sb
    .from("event_results")
    .select("event_id,team_id,rank,marks,declared_at")
    .eq("event_id", eventId)
    .order("rank", { ascending: true })
    .returns<EventResultRow[]>();

  if (resErr) {
    return json(
      { ok: false, error: "Failed to load event results.", details: resErr.message },
      { status: 500, cacheSeconds: 0 }
    );
  }

  const safeResults = results ?? [];
  const teamIds = Array.from(new Set(safeResults.map((r) => r.team_id)));

  // 3) Teams for those results
  const { data: teams, error: teamErr } = await sb
    .from("teams")
    .select("id,slug,name,team_leader_id,created_at")
    .in("id", teamIds)
    .returns<TeamRow[]>();

  if (teamErr) {
    return json(
      { ok: false, error: "Failed to load teams.", details: teamErr.message },
      { status: 500, cacheSeconds: 0 }
    );
  }

  const teamMap = new Map<string, TeamRow>();
  (teams ?? []).forEach((t) => teamMap.set(t.id, t));

  // 4) Optional accepted member counts
  let acceptedMemberCounts: Record<string, number> = {};
  if (includeMembers && teamIds.length > 0) {
    const { data: members, error: memErr } = await sb
      .from("team_members")
      .select("team_id")
      .in("team_id", teamIds)
      .eq("status", "accepted");

    if (!memErr && members) {
      acceptedMemberCounts = members.reduce<Record<string, number>>((acc, m) => {
        const tid = String(m.team_id);
        acc[tid] = (acc[tid] ?? 0) + 1;
        return acc;
      }, {});
    }
  }

  return json(
    {
      ok: true,
      mode: "event",
      updatedAt: new Date().toISOString(),
      event,
      results: safeResults.map((r) => ({
        ...r,
        team: teamMap.get(r.team_id) ?? null,
        members_accepted: includeMembers ? acceptedMemberCounts[r.team_id] ?? 0 : undefined,
      })),
      meta: {
        hasResults: safeResults.length > 0,
        ranksPresent: safeResults.map((r) => r.rank),
      },
    },
    { status: 200, cacheSeconds: 10 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}