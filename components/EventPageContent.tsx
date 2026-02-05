"use client";

import { Calendar, MapPin, Users, Trophy, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import EventTeamManager from "@/components/EventTeamManager";
import MDXRenderer from "@/components/MDXRenderer";

interface Event {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  doc: string | null;
  max_participants: number | null;
  max_score: number;
  is_active: boolean;
  min_team_size: number | null;
  max_team_size: number | null;
}

interface EventPageContentProps {
  event: Event;
}

export default function EventPageContent({ event }: EventPageContentProps) {
  const minSize = event.min_team_size ?? 2;
  const maxSize = event.max_team_size ?? 4;

  const getTeamSizeText = () => {
    if (minSize === maxSize) {
      if (minSize === 1) {
        return "Compete solo";
      }
      return `Form a team of exactly ${minSize} members`;
    }
    return `Create or join a team of ${minSize}-${maxSize} members`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-8 md:py-16 lg:py-24 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Event Image */}
            {event.image_url && (
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-black/40">
                <Image
                  src={event.image_url}
                  alt={event.name}
                  fill
                  className="object-contain"
                  priority
                />
                {event.is_active && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#8F00AF] text-white border-none px-3 py-1">
                      Registration Open
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Event Details */}
            <div
              className={
                event.image_url ? "" : "lg:col-span-2 max-w-4xl mx-auto"
              }
            >
              <Badge className="mb-4 capitalize bg-[#8F00AF]/10 text-[#8F00AF] border-[#8F00AF]/30 px-3 py-1">
                {event.category}
              </Badge>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4 text-white">
                {event.name}
              </h1>

              {event.description && (
                <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 max-w-2xl">
                  {event.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                {event.date && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-[#8F00AF]" />
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase">
                          Date & Time
                        </p>
                        <p className="text-xs md:text-sm text-white">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(event.date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-[#8F00AF]" />
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase">
                          Location
                        </p>
                        <p className="text-xs md:text-sm text-white">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-[#8F00AF]" />
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase">
                          Max Participants
                        </p>
                        <p className="text-xs md:text-sm text-white">
                          {event.max_participants} Teams
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Trophy className="h-4 w-4 md:h-5 md:w-5 text-[#8F00AF]" />
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-500 uppercase">
                        Prize Pool
                      </p>
                      <p className="text-xs md:text-sm text-white">
                        {event.max_score} Points
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3">
                {event.is_active ? (
                  <Button
                    size="default"
                    className="w-full sm:w-auto bg-[#8F00AF] hover:bg-[#8F00AF]/90 text-white"
                    asChild
                  >
                    <Link href="#team-section">Form Team & Register</Link>
                  </Button>
                ) : (
                  <Button size="default" className="w-full sm:w-auto" disabled>
                    Registration Closed
                  </Button>
                )}
                {event.doc && (
                  <Button
                    size="default"
                    variant="outline"
                    className="w-full sm:w-auto border-[#8F00AF]/30 text-[#8F00AF] hover:bg-[#8F00AF]/10"
                    asChild
                  >
                    <a href="#event-info">
                      <FileText className="mr-2 h-4 w-4" />
                      View Event Info
                    </a>
                  </Button>
                )}
                <Button
                  size="default"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5"
                  asChild
                >
                  <Link href="/events">View All Events</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Formation Section */}
      {event.is_active && (
        <section
          id="team-section"
          className="py-8 md:py-16 lg:py-24 bg-black border-t border-white/5"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-6 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-white">
                  Form Your Team
                </h2>
                <p className="text-sm md:text-base text-gray-400">
                  {getTeamSizeText()} to compete in {event.name}
                </p>
              </div>

              <EventTeamManager
                eventId={event.id}
                eventName={event.name}
                eventSlug={event.slug}
              />
            </div>
          </div>
        </section>
      )}

      {/* Event Documentation Section */}
      {event.doc && (
        <section
          id="event-info"
          className="py-8 md:py-16 lg:py-24 bg-black border-t border-white/5"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-white flex items-center gap-2 md:gap-3">
                  <FileText className="h-6 w-6 md:h-8 md:w-8 text-[#8F00AF]" />
                  Event Information
                </h2>
                <p className="text-sm md:text-base text-gray-400">
                  Everything you need to know about {event.name}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 lg:p-8">
                <MDXRenderer content={event.doc} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
