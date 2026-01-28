import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function json(
  data: unknown,
  init?: ResponseInit & { cacheSeconds?: number }
) {
  const cacheSeconds = init?.cacheSeconds ?? 20;
  const headers = new Headers(init?.headers);
  headers.set(
    "Cache-Control",
    `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 6}`
  );
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new NextResponse(JSON.stringify(data), { ...init, headers });
}

function clampInt(v: string | null, def: number, min: number, max: number) {
  const n = v ? Number(v) : NaN;
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

type TeamRow = {
  id: string;
  slug: string;
  name: string;
  team_leader_id: string;
};

type EventRow = {
  id: string;
  name: string;
  category: string;
  date: string | null;
  location: string | null;
  is_active: boolean | null;
  max_score: number;
};

type EventResultRow = {
  event_id: string;
  team_id: string;
  rank: number;
  marks: number;
  declared_at: string | null;
};

type TeamAgg = {
  team_id: string;
  team: TeamRow | null;
  total_marks: number;
  events_count: number;
  gold: number;
  silver: number;
  bronze: number;
  points: number;
  last_declared_at: string | null;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = (url.searchParams.get("mode") || "overall").toLowerCase();
  const limit = clampInt(url.searchParams.get("limit"), 50, 1, 200);
  const category = url.searchParams.get("category");

  const sb = supabaseAdmin();

  // --------------------------
  // MODE: EVENTS (events that have results + podium)
  // --------------------------
  if (mode === "events") {
    const q = sb
      .from("events")
      .select("id,name,category,date,location,is_active,max_score")
      .order("date", { ascending: false });

    if (category) q.eq("category", category);

    const { data: events, error: eventsErr } = await q
      .limit(limit)
      .returns<EventRow[]>();

    if (eventsErr) {
      return json(
        { ok: false, error: "Failed to load events.", details: eventsErr.message },
        { status: 500, cacheSeconds: 0 }
      );
    }

    const eventIds = (events ?? []).map((e) => e.id);
    if (eventIds.length === 0) {
      return json({ ok: true, mode: "events", updatedAt: new Date().toISOString(), events: [] });
    }

    const { data: results, error: resErr } = await sb
      .from("event_results")
      .select("event_id,team_id,rank,marks,declared_at")
      .in("event_id", eventIds)
      .order("rank", { ascending: true })
      .returns<EventResultRow[]>();

    if (resErr) {
      return json(
        { ok: false, error: "Failed to load event results.", details: resErr.message },
        { status: 500, cacheSeconds: 0 }
      );
    }

    const teamIds = Array.from(new Set((results ?? []).map((r) => r.team_id)));
    const { data: teams, error: teamErr } = await sb
      .from("teams")
      .select("id,slug,name,team_leader_id")
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

    const byEvent = new Map<string, Array<EventResultRow & { team: TeamRow | null }>>();
    (results ?? []).forEach((r) => {
      const arr = byEvent.get(r.event_id) ?? [];
      arr.push({ ...r, team: teamMap.get(r.team_id) ?? null });
      byEvent.set(r.event_id, arr);
    });

    const enriched = (events ?? [])
      .map((e) => ({
        ...e,
        results: (byEvent.get(e.id) ?? []).sort((a, b) => a.rank - b.rank),
      }))
      .filter((e) => e.results.length > 0);

    return json(
      { ok: true, mode: "events", updatedAt: new Date().toISOString(), events: enriched },
      { status: 200, cacheSeconds: 20 }
    );
  }

  // --------------------------
  // MODE: OVERALL (aggregate)
  // --------------------------
  const { data: rows, error } = await sb
    .from("event_results")
    .select("event_id,team_id,rank,marks,declared_at")
    .order("declared_at", { ascending: false })
    .returns<EventResultRow[]>();

  if (error) {
    return json(
      { ok: false, error: "Failed to load overall leaderboard.", details: error.message },
      { status: 500, cacheSeconds: 0 }
    );
  }

  const allRows = rows ?? [];
  const teamIds = Array.from(new Set(allRows.map((r) => r.team_id)));

  const { data: teams, error: teamErr } = await sb
    .from("teams")
    .select("id,slug,name,team_leader_id")
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

  const agg = new Map<string, TeamAgg>();
  const eventsSeen = new Map<string, Set<string>>();

  for (const r of allRows) {
    const pointsForRank = r.rank === 1 ? 3 : r.rank === 2 ? 2 : r.rank === 3 ? 1 : 0;

    const current =
      agg.get(r.team_id) ??
      ({
        team_id: r.team_id,
        team: teamMap.get(r.team_id) ?? null,
        total_marks: 0,
        events_count: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        points: 0,
        last_declared_at: null,
      } satisfies TeamAgg);

    current.total_marks += Number(r.marks ?? 0);
    current.points += pointsForRank;

    if (r.rank === 1) current.gold += 1;
    if (r.rank === 2) current.silver += 1;
    if (r.rank === 3) current.bronze += 1;

    const set = eventsSeen.get(r.team_id) ?? new Set<string>();
    set.add(r.event_id);
    eventsSeen.set(r.team_id, set);
    current.events_count = set.size;

    const dt = r.declared_at ? String(r.declared_at) : null;
    if (!current.last_declared_at || (dt && dt > current.last_declared_at)) {
      current.last_declared_at = dt;
    }

    agg.set(r.team_id, current);
  }

  const leaderboard = Array.from(agg.values())
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.total_marks !== a.total_marks) return b.total_marks - a.total_marks;
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      return (a.team?.name ?? "").localeCompare(b.team?.name ?? "");
    })
    .slice(0, limit)
    .map((t, idx) => ({ position: idx + 1, ...t }));

  return json(
    {
      ok: true,
      mode: "overall",
      updatedAt: new Date().toISOString(),
      scoring: {
        note: "Overall leaderboard uses rank-based points + total marks as tie-breaker.",
        points: { rank1: 3, rank2: 2, rank3: 1 },
        tieBreakers: ["total_marks", "gold", "silver", "bronze", "team.name"],
      },
      leaderboard,
    },
    { status: 200, cacheSeconds: 20 }
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