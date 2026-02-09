// app/api/team/delete/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "UNAUTH" }, { status: 401 });
    }

    const { team_id } = await request.json();

    if (!team_id) {
      return NextResponse.json(
        { error: "TEAM_ID_REQUIRED" },
        { status: 400 },
      );
    }

    // Verify that the user is the team leader
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, team_leader_id, name")
      .eq("id", team_id)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: "TEAM_NOT_FOUND" }, { status: 404 });
    }

    if (team.team_leader_id !== user.id) {
      return NextResponse.json(
        { error: "ONLY_LEADER_CAN_DELETE" },
        { status: 403 },
      );
    }

    // Delete event registrations first (due to foreign key constraints)
    await supabase.from("event_registrations").delete().eq("team_id", team_id);

    // Delete team members
    await supabase.from("team_members").delete().eq("team_id", team_id);

    // Delete the team
    const { error: deleteError } = await supabase
      .from("teams")
      .delete()
      .eq("id", team_id);

    if (deleteError) {
      console.error("Error deleting team:", deleteError);
      return NextResponse.json(
        { error: "DELETE_FAILED", details: deleteError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete team API:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
