// app/components/VenueReveal.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedBlurText from "./AnimatedBlurText";
import Image from "next/image";

type Thumb = { src: string; alt: string };

const ease = [0.22, 1, 0.36, 1] as const;

function StaggerWrap({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

function Reveal({
  children,
  y = 14,
  delay = 0,
}: {
  children: React.ReactNode;
  y?: number;
  delay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default function VenueReveal() {
  const thumbs = useMemo<Thumb[]>(() => [], []);

  return (
    <section id="venue" className="w-full bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-20">
        {/* Header */}
        <StaggerWrap>
          <Reveal y={10}>
            <div className="flex items-center gap-3 text-white/85">
              <span className="h-px w-10 bg-white/80" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                Event Venue
              </span>
            </div>
          </Reveal>

          <h2
            className="
                        mt-6
                        font-sans
                        text-4xl sm:text-5xl md:text-6xl
                        leading-[1.05]
                        tracking-tight
                        font-medium
                      "
          >
            <AnimatedBlurText
              lines={["Explore the E-summit", " "]}
              liteText="Venues and Locations"
            />
          </h2>
        </StaggerWrap>

        {/* Hero image */}
        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease }}
            className="relative w-full overflow-hidden bg-black"
          >
            {/* Main photo */}
            <div className="relative h-[360px] sm:h-[460px] md:h-[520px] lg:h-[560px] w-full">
              <Image
                width={1920}
                height={1080}
                src="/bit_mesra.png"
                alt="BIT Mesra Campus"
                draggable={false}
                className="h-full w-full object-cover"
              />

              {/* Image bottom fade (like ref) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black" />

              {/* Top-right label */}
              <motion.div
                initial={{ opacity: 0, x: 18, y: 6, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, ease, delay: 0.05 }}
                className="
                  absolute
                  right-6 top-8
                  sm:right-10 sm:top-10
                  max-w-[520px]
                  text-right
                  font-sans
                  text-2xl sm:text-3xl md:text-4xl
                  font-semibold
                  leading-[1.12]
                  tracking-tight
                  text-white
                "
                style={{
                  textShadow:
                    "0 10px 60px rgba(0,0,0,0.65), 0 0 24px rgba(0,0,0,0.35)",
                }}
              >
                <div>Birla Institute of Technology,</div>
                <div>Mesra, Ranchi</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Body text */}
        <div className="mt-10">
          <StaggerWrap delay={0.05}>
            <Reveal y={12}>
              <p className="max-w-4xl text-sm sm:text-base leading-relaxed text-white/85">
                E-Summit 2026 is being held at the prestigious Birla Institute
                of Technology (BIT), Mesra, Ranchi. Nestled in the serene
                landscape of Jharkhand, BIT Mesra is renowned for its rich
                legacy in technical education and innovation. The campus
                provides state-of-the-art facilities and an inspiring
                environment perfect for bringing together entrepreneurs,
                industry leaders, and innovators from across the nation.
              </p>
            </Reveal>

            <Reveal y={12}>
              <p className="mt-6 max-w-4xl text-sm sm:text-base leading-relaxed text-white/85">
                Join us at this iconic institution to engage in insightful
                discussions, network with fellow visionaries, and be part of
                conversations shaping the future of entrepreneurship and
                technology. Experience the perfect blend of academic excellence
                and entrepreneurial spirit at BIT Mesra.
              </p>
            </Reveal>
          </StaggerWrap>
        </div>

        {/* Google Map */}
        <div className="mt-16">
          <StaggerWrap delay={0.1}>
            <Reveal y={10}>
              <h3 className="text-2xl sm:text-3xl font-semibold mb-8 tracking-tight">
                Find Us Here
              </h3>
            </Reveal>
          </StaggerWrap>

          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease }}
            className="
              relative
              overflow-hidden
              rounded-[32px]
              bg-gradient-to-br from-purple-900/20 via-black to-purple-900/10
              p-[2px]
              shadow-[0_0_80px_rgba(143,0,175,0.15),0_35px_140px_rgba(0,0,0,0.8)]
            "
          >
            <div className="relative overflow-hidden rounded-[30px] bg-black/40 backdrop-blur-sm">
              <div className="relative aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.333697172757!2d85.43732607556854!3d23.412309901671374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4fb53f0c27be7%3A0x66180c1cf3c5e704!2sBirla%20Institute%20of%20Technology%20-%20Mesra!5e0!3m2!1sen!2sin!4v1770521671651!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 brightness-95 saturate-110"
                />
              </div>
              {/* Subtle glow overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Location Info Cards */}
        <div className="mt-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Location Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.8, ease },
                },
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                bg-white/[0.03]
                ring-1 ring-white/10
                shadow-[0_28px_120px_rgba(0,0,0,0.75)]
                transition-all duration-500
                hover:shadow-[0_35px_140px_rgba(0,0,0,0.85)]
                hover:ring-white/15
                h-full
              "
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-xl p-8 h-full">
                {/* Subtle gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent" />

                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <svg
                      className="h-8 w-8 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">
                    Venue Location
                  </h3>

                  <div className="space-y-3 text-white/70">
                    <p className="text-base leading-relaxed">
                      <span className="font-semibold text-white/90">
                        Birla Institute of Technology
                      </span>
                      <br />
                      Mesra, Ranchi - 835215
                      <br />
                      Jharkhand, India
                    </p>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-white/60">
                        Distance from Ranchi City Center:{" "}
                        <span className="font-semibold text-white/90">
                          ~16 km
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Transportation Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.8, ease },
                },
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                bg-white/[0.03]
                ring-1 ring-white/10
                shadow-[0_28px_120px_rgba(0,0,0,0.75)]
                transition-all duration-500
                hover:shadow-[0_35px_140px_rgba(0,0,0,0.85)]
                hover:ring-white/15
                h-full
              "
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-xl p-8 h-full">
                {/* Subtle gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent" />

                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <svg
                      className="h-8 w-8 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>

                  <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">
                    How to Reach
                  </h3>

                  <div className="space-y-4 text-white/70">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-white/90">
                          Birsa Munda Airport
                        </p>
                        <p className="text-sm text-white/60">
                          ~20 km (30-40 mins)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-white/90">
                          Ranchi Railway Station
                        </p>
                        <p className="text-sm text-white/60">
                          ~18 km (35-45 mins)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-white/90">
                          Hatia Railway Station
                        </p>
                        <p className="text-sm text-white/60">
                          ~12 km (25-30 mins)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Thumbnails */}
        {thumbs.length > 0 && (
          <div className="mt-12">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
              }}
              className="grid gap-10 md:grid-cols-3"
            >
              {thumbs.map((t) => (
                <motion.div
                  key={t.src}
                  variants={{
                    hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.8, ease },
                    },
                  }}
                  className="
                    overflow-hidden
                    rounded-[26px]
                    bg-white/[0.03]
                    ring-1 ring-white/10
                    shadow-[0_28px_120px_rgba(0,0,0,0.75)]
                  "
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={t.src}
                      alt={t.alt}
                      draggable={false}
                      className="h-full w-full object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
