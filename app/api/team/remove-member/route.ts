// app/api/team/remove-member/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "UNAUTH" }, { status: 401 });
    }

    const { team_id, user_id } = await request.json();

    if (!team_id || !user_id) {
      return NextResponse.json(
        { error: "TEAM_ID_AND_USER_ID_REQUIRED" },
        { status: 400 },
      );
    }

    // Verify that the current user is the team leader
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, team_leader_id")
      .eq("id", team_id)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: "TEAM_NOT_FOUND" }, { status: 404 });
    }

    if (team.team_leader_id !== user.id) {
      return NextResponse.json(
        { error: "ONLY_LEADER_CAN_REMOVE" },
        { status: 403 },
      );
    }

    // Prevent leader from removing themselves
    if (user_id === user.id) {
      return NextResponse.json(
        { error: "CANNOT_REMOVE_YOURSELF" },
        { status: 400 },
      );
    }

    // Check if the user is actually a member of this team
    const { data: member, error: memberError } = await supabase
      .from("team_members")
      .select("user_id, status")
      .eq("team_id", team_id)
      .eq("user_id", user_id)
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { error: "MEMBER_NOT_FOUND" },
        { status: 404 },
      );
    }

    // Remove the member from the team (now allowed by RLS policy)
    const { error: deleteError } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", team_id)
      .eq("user_id", user_id);

    if (deleteError) {
      console.error("Error removing member:", deleteError);
      return NextResponse.json(
        { error: "REMOVE_FAILED", details: deleteError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in remove member API:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
