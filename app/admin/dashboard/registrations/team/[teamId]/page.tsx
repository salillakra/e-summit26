import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Profile {
  id: string;
  roll_no?: string;
  branch?: string;
  phone?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
}

interface TeamMember {
  id: string;
  roll_no?: string;
  branch?: string;
  phone?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  status: string;
  joined_at: string;
  isLeader: boolean;
}

interface EventRegistration {
  id: string;
  presentation_url?: string | null;
  product_photos_url?: string | null;
  achievements?: string | null;
  video_link?: string | null;
  fault_lines_pdf?: string | null;
  events: {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
  };
}

interface Team {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  team_leader_id: string;
}

export default async function TeamDetailsPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  await connection();

  const { teamId } = await params;

  if (!teamId) return notFound();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  // 3. Fetch Team Details
  const { data: team, error: teamError } = (await supabaseAdmin
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single()) as { data: Team | null; error: unknown };

  if (teamError || !team) {
    return notFound();
  }

  const { data: teamMembers } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .eq("team_id", teamId);

  // Fetch profiles for these users
  const userIds = teamMembers?.map((member) => member.user_id) || [];

  let profiles: Profile[] = [];
  if (userIds.length > 0) {
    const { data: profilesData } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .in("id", userIds);
    profiles = profilesData || [];
  }

  //  Combine data
  const formattedMembers: TeamMember[] =
    teamMembers?.map((member) => {
      const profile = profiles.find((p) => p.id === member.user_id);
      return {
        id: member.user_id,
        ...profile,
        role: member.role,
        status: member.status,
        joined_at: member.joined_at,
        isLeader: member.user_id === team.team_leader_id,
      };
    }) || [];

  const { data: registrations } = (await supabaseAdmin
    .from("event_registrations")
    .select(
      "id, presentation_url, product_photos_url, achievements, video_link, fault_lines_pdf, events(id, name, slug, category, description)",
    )
    .eq("team_id", teamId)) as { data: EventRegistration[] | null };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/dashboard/registrations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Team Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">
                  Team Name:
                </span>
                <span className="font-semibold text-lg">{team.name}</span>
              </div>
              <Badge variant="outline" className="text-sm">
                {team.slug}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Team Code
              </h3>
              <p className="font-mono text-sm py-1 inline-block ">
                {team.slug || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Created At
              </h3>
              <p className="text-sm">
                {new Date(team.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Leader ID
              </h3>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                {team.team_leader_id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members ({formattedMembers.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formattedMembers.length > 0 ? (
              formattedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50"
                >
                  <Avatar>
                    {/* Fallback to roll number or name if avatar is missing */}
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>
                      {member.first_name?.[0]?.toUpperCase() ||
                        member.roll_no?.substring(0, 2).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {member.first_name || member.last_name
                          ? `${member.first_name || ""} ${member.last_name || ""}`.trim()
                          : member.roll_no || "Unknown User"}
                      </span>
                      {member.isLeader && (
                        <Badge variant="secondary" className="text-xs">
                          Leader
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {member.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.roll_no && <span>{member.roll_no}</span>}
                      {member.roll_no && member.branch && " • "}
                      {member.branch && <span>{member.branch}</span>}
                      {member.phone && (
                        <>
                          {(member.roll_no || member.branch) && " • "}
                          <span>{member.phone}</span>
                        </>
                      )}
                      {!member.roll_no && !member.branch && !member.phone && (
                        <span>User ID: {member.id.substring(0, 8)}...</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No team members found
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Registered Events */}
      {registrations && registrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Registered Events ({registrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registrations.map((reg) => {
                const eventSlug = reg.events.slug;
                const isBPlan = eventSlug === "b-plan";
                const isInvestorSummit = eventSlug === "investors-summit";
                const isFaultLines = eventSlug === "fault-lines";

                return (
                  <div key={reg.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{reg.events.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {reg.events.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {reg.events.category}
                        </Badge>
                        <Link href={`/admin/dashboard/events/${reg.events.id}`}>
                          <Button variant="secondary" size="sm">
                            View Event
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Submission Files */}
                    <div className="bg-muted/30 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-2">
                        Submission Files:
                      </h4>
                      <div className="space-y-2">
                        {/* B Plan - PDF upload */}
                        {isBPlan && (
                          <>
                            {reg.presentation_url ? (
                              <div>
                                <a
                                  href={reg.presentation_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline flex items-center gap-2"
                                >
                                  📄 Presentation PDF
                                </a>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                No presentation submitted
                              </p>
                            )}
                          </>
                        )}

                        {/* Investor Summit - PDF, Photos, Achievements, Video */}
                        {isInvestorSummit && (
                          <>
                            {reg.presentation_url && (
                              <div>
                                <a
                                  href={reg.presentation_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline flex items-center gap-2"
                                >
                                  📄 Presentation PDF
                                </a>
                              </div>
                            )}
                            {reg.product_photos_url && (
                              <div>
                                <a
                                  href={reg.product_photos_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline flex items-center gap-2"
                                >
                                  📷 Product Photos
                                </a>
                              </div>
                            )}
                            {reg.video_link && (
                              <div>
                                <a
                                  href={reg.video_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline flex items-center gap-2"
                                >
                                  🎥 Video Link
                                </a>
                              </div>
                            )}
                            {reg.achievements && (
                              <div className="text-sm">
                                <span className="font-medium">
                                  Achievements:
                                </span>
                                <p className="mt-1 text-muted-foreground">
                                  {reg.achievements}
                                </p>
                              </div>
                            )}
                            {!reg.presentation_url &&
                              !reg.product_photos_url &&
                              !reg.video_link &&
                              !reg.achievements && (
                                <p className="text-sm text-muted-foreground italic">
                                  No submissions yet
                                </p>
                              )}
                          </>
                        )}

                        {/* Fault Lines - PDF upload */}
                        {isFaultLines && (
                          <>
                            {reg.fault_lines_pdf ? (
                              <div>
                                <a
                                  href={reg.fault_lines_pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline flex items-center gap-2"
                                >
                                  📄 Fault Lines PDF
                                </a>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                No PDF submitted
                              </p>
                            )}
                          </>
                        )}

                        {/* Other events */}
                        {!isBPlan && !isInvestorSummit && !isFaultLines && (
                          <p className="text-sm text-muted-foreground italic">
                            No specific submissions required
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
