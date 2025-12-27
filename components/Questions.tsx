"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import AnimatedBlurText from "./AnimatedBlurText";
import { cn } from "@/lib/utils";

type FAQ = { q: string; a: string };

export default function Questions() {
  const faqs: FAQ[] = [
    {
      q: "How can I register for the E-Summit'26?",
      a: "The website contains the link for each event which will redirect you to bharatversity from where you can register for all the events.",
    },
    {
      q: "How many members can form a team?",
      a: "One to four members can participate depending upon the event.",
    },
    {
      q: "What is the dress code for the event?",
      a: "The dress code for the Summit is business casual. Feel free to wear something comfortable, but professional, as you'll be networking and engaging with industry leaders and experts.",
    },
    {
      q: "Can I submit my project or research for the summit?",
      a: "While we are not accepting formal submissions for this year's summit, there will be ample networking time where you can share your project or research with fellow attendees and speakers to get feedback and insights.",
    },
    {
      q: "How can I become a sponsor or exhibitor at the event?",
      a: 'To explore sponsorship or exhibitor opportunities, please visit the "Sponsorship" section on our website. Fill out the inquiry form, and our team will get back to you with detailed information about packages and benefits.',
    },
    {
      q: "Will there be opportunities for networking at the summit?",
      a: "Absolutely! The summit includes dedicated networking breaks, lunch sessions, and after-event mixers. You'll have plenty of opportunities to connect with speakers, fellow attendees, and industry leaders in both formal and informal settings.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="questions" className="w-full bg-black text-white">
      {/* wider container so RIGHT cards get more x-space */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="grid gap-10 sm:gap-12 lg:gap-16 lg:grid-cols-[1fr_1fr] lg:items-start">
          {/* LEFT */}
          <div>
            <div className="flex items-center gap-3 text-white/85">
              <span className="h-px w-12 bg-white/80" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                Questions
              </span>
            </div>

            {/* heading slightly smaller + more consistent */}
            <h2
              className="
                mt-6 sm:mt-8
                font-sans
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                leading-[1.06]
                tracking-tight
                font-bold
              "
            >
              <AnimatedBlurText
                lines={["All the Important", "Details Before Attending", ""]}
                liteText="E-Summit'26"
              />
            </h2>
          </div>

          {/* RIGHT */}
          {/* a bit wider on large screens, so cards breathe on x-axis */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:pl-4">
            {faqs.map((item, idx) => {
              const open = idx === openIdx;

              return (
                <div
                  key={item.q}
                  className={cn(
                    "rounded-2xl",
                    "border border-white/10",
                    "bg-linear-to-br from-white/4 to-white/2",
                    "shadow-[0_28px_100px_rgba(0,0,0,0.8)]",
                    "backdrop-blur-xl",
                    "transition-all duration-300",
                    "hover:border-white/15"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? -1 : idx)}
                    className={cn(
                      "w-full cursor-pointer",
                      "px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-7",
                      "flex items-center justify-between gap-3 sm:gap-4 md:gap-8",
                      "text-left",
                      "transition-all duration-300"
                    )}
                    aria-expanded={open}
                  >
                    <div
                      className={cn(
                        "font-sans",
                        "text-sm sm:text-base md:text-lg lg:text-xl",
                        "font-bold tracking-tight",
                        "leading-tight",
                        open ? "text-white" : "text-white/90"
                      )}
                    >
                      {item.q}
                    </div>

                    <span
                      className={cn(
                        "shrink-0",
                        "grid place-items-center",
                        "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full",
                        "bg-white/8 border border-white/15",
                        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        open ? "bg-white/15 border-white/25" : "",
                        "hover:bg-white/12"
                      )}
                    >
                      <span className="relative h-5 w-5 sm:h-6 sm:w-6">
                        <Plus
                          size={20}
                          strokeWidth={2.5}
                          className={cn(
                            "absolute inset-0 m-auto",
                            "text-white",
                            "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            open
                              ? "opacity-0 scale-90 rotate-90"
                              : "opacity-100 scale-100 rotate-0"
                          )}
                        />
                        <Minus
                          size={20}
                          strokeWidth={2.5}
                          className={cn(
                            "absolute inset-0 m-auto",
                            "text-white",
                            "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            open
                              ? "opacity-100 scale-100 rotate-0"
                              : "opacity-0 scale-90 -rotate-90"
                          )}
                        />
                      </span>
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 sm:px-6 md:px-8 pb-5 sm:pb-6 md:pb-8 -mt-2">
                        <p
                          className="
                            font-sans
                            text-sm sm:text-base
                            leading-relaxed
                            text-white/70
                            font-medium
                          "
                        >
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
