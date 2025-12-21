"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Home,
  Users,
  Calendar,
  MapPin,
  Mail,
  ChevronRight,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

const LINKS = [
  { label: "Speakers", href: "#speakers", icon: Users },
  { label: "Events", href: "#events", icon: Calendar },
  { label: "Venue", href: "#venue", icon: MapPin },
  { label: "Contact", href: "#contact", icon: Mail },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram, color: "bg-pink-500" },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter, color: "bg-black" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin, color: "bg-blue-600" },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook, color: "bg-blue-500" },
];

const PILL_VARIANTS: Variants = {
  initial: { y: 0 },
  hover: { y: "-110%" },
};

const PILL_BG_VARIANTS: Variants = {
  initial: { y: "110%" },
  hover: { y: 0 },
};

const TRANSITION_CONFIG = {
  duration: 0.22,
  ease: "linear" as const,
};

const SIDEBAR_VARIANTS: Variants = {
  closed: {
    x: "100%",
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};

const BACKDROP_VARIANTS: Variants = {
  closed: {
    opacity: 0,
    pointerEvents: "none",
  },
  open: {
    opacity: 1,
    pointerEvents: "auto",
  },
};

function NavPill({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <a href={href} onClick={onClick} className="flex items-center text-white">
      <motion.div
        initial="initial"
        whileHover="hover"
        className="rounded-full relative bg-white/10 px-4 py-2 overflow-hidden transition-colors duration-500"
      >
        <motion.span
          variants={PILL_VARIANTS}
          transition={TRANSITION_CONFIG}
          className="block text-gray-200/80 will-change-transform"
        >
          {children}
        </motion.span>
        <motion.span
          variants={PILL_BG_VARIANTS}
          transition={TRANSITION_CONFIG}
          className="absolute inset-0 bg-[#733080] rounded-full flex items-center justify-center will-change-transform"
        >
          {children}
        </motion.span>
      </motion.div>
    </a>
  );
}

export default function Navbar() {
  const [compact, setCompact] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothJump = useMemo(
    () => (e: React.MouseEvent) => {
      const href = e.currentTarget.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      e.preventDefault();

      if (href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const el = document.querySelector(href);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    []
  );

  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    
    setTimeout(() => {
      if (href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 300);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  return (
    <>
      <header
        className={[
          "fixed left-0 right-0 top-0 z-50",
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          compact
            ? [
                "bg-black/18",
                "backdrop-blur-md",
                "border-b border-white/8",
                "shadow-[0_10px_40px_rgba(0,0,0,0.25)]",
              ].join(" ")
            : "bg-transparent backdrop-blur-0 border-b border-transparent shadow-none",
        ].join(" ")}
        style={{
          willChange: compact
            ? "background, backdrop-filter, border-color, box-shadow"
            : "auto",
        }}
      >
        <div className="mx-auto max-w-6xl px-1 py-4">
          <div className="relative flex items-center">
            <a
              href="#top"
              onClick={(e) => handleNavClick(e, "#top")}
              className={[
                "flex items-center gap-3 -translate-x-4",
                "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "opacity-100 translate-y-0",
              ].join(" ")}
              aria-label="Home"
            >
              <Image
                width={200}
                height={200}
                priority={true}
                loading="eager"
                src="/esummit_logo.png"
                alt="E-Summit 26"
                draggable={false}
                className="h-12 w-auto select-none"
              />
            </a>

            <div className="ml-auto flex items-center gap-4 pr-5">
              <nav
                className={[
                  "hidden md:flex items-center space-x-3",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  compact
                    ? "opacity-0 translate-x-10 pointer-events-none"
                    : "opacity-100 translate-x-0",
                ].join(" ")}
                aria-label="Primary"
                style={{ willChange: compact ? "auto" : "opacity, transform" }}
              >
                {LINKS.map((l) => (
                  <NavPill key={l.href} href={l.href} onClick={smoothJump}>
                    {l.label}
                  </NavPill>
                ))}
              </nav>

              <motion.button
                type="button"
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                className={[
                  "inline-flex h-11 w-11 items-center justify-center",
                  compact
                    ? "rounded-full border border-white/12 bg-white/6 backdrop-blur-md"
                    : "rounded-full border border-white/15 bg-white/10 backdrop-blur-xl",
                  "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  compact
                    ? "opacity-100 translate-x-0"
                    : "opacity-100 translate-x-0 md:opacity-0 md:translate-x-4 md:pointer-events-none",
                ].join(" ")}
                onClick={toggleSidebar}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isSidebarOpen ? "open" : "closed"}
                  variants={{
                    closed: { rotate: 0 },
                    open: { rotate: 180 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isSidebarOpen ? (
                    <X size={20} className="text-white/90" />
                  ) : (
                    <div className="flex flex-col gap-1.25">
                      <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                      <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                      <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                    </div>
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={BACKDROP_VARIANTS}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              onClick={toggleSidebar}
              transition={{ duration: 0.3 }}
            />
            
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={SIDEBAR_VARIANTS}
              className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
            >
              <div className="flex h-full flex-col">
                {/* Header - Ultra compact */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      width={80}
                      height={80}
                      src="/esummit_logo.png"
                      alt="E-Summit 26"
                      className="h-6 w-auto"
                    />
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={14} className="text-white/80" />
                  </button>
                </div>

                {/* Navigation Links - Ultra compact */}
                <nav className="flex-1 px-4 py-3">
                  <div className="space-y-1 h-full flex flex-col justify-center">
                    <a
                      href="#top"
                      onClick={(e) => handleNavClick(e, "#top")}
                      className="group flex items-center gap-2 rounded-lg px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <div className="grid h-8 w-8 place-items-center rounded-md bg-white/5 group-hover:bg-[#733080]/30">
                        <Home size={14} className="text-white/70 group-hover:text-white" />
                      </div>
                      <span className="font-medium text-sm">Home</span>
                      <ChevronRight size={12} className="ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>

                    {LINKS.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <div className="grid h-8 w-8 place-items-center rounded-md bg-white/5 group-hover:bg-[#733080]/30">
                            <Icon size={14} className="text-white/70 group-hover:text-white" />
                          </div>
                          <span className="font-medium text-sm">{link.label}</span>
                          <ChevronRight size={12} className="ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </a>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer - Ultra compact */}
                <div className="border-t border-white/10 p-3">
                  <div className="mb-3">
                    <h3 className="mb-2 text-xs font-medium text-white/80">
                      Follow Us
                    </h3>
                    <div className="flex gap-1">
                      {SOCIAL_LINKS.map((social) => {
                        const Icon = social.icon;
                        return (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`grid h-7 w-7 place-items-center rounded-full ${social.color} text-white transition-transform hover:scale-110`}
                            aria-label={social.label}
                          >
                            <Icon size={12} />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-white/60">
                    <p className="leading-relaxed text-xs">
                      Join us for the biggest entrepreneurial event of the year.
                      Connect, learn, and grow with industry leaders.
                    </p>
                    <p className="pt-1 text-[10px]">
                      © 2025 EDC, BIT Mesra. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .rb-pill {
          position: relative;
          display: inline-flex;
          height: 3rem;
          align-items: center;
          border-radius: 9999px;
          padding-left: 1.7rem;
          padding-right: 1.7rem;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial;
          font-size: 1.05rem;
          font-weight: 640;
          letter-spacing: -0.04em;
          color: rgba(255, 255, 255, 0.92);
          text-decoration: none;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .rb-inner,
        .rb-inner-hover,
        .rb-inner-static {
          pointer-events: none;
          display: block;
        }

        .rb-inner {
          position: relative;
          z-index: 2;
        }

        .rb-inner-hover {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transform: translateY(70%);
        }

        .rb-bg {
          overflow: hidden;
          border-radius: 9999px;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scale(1);
          transition: transform 1.6s cubic-bezier(0.19, 1, 0.22, 1);
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(10px);
        }

        .rb-bg-layers {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -60%;
          aspect-ratio: 1 / 1;
          width: max(210%, 10rem);
        }

        .rb-bg-layer {
          border-radius: 9999px;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scale(0);
          opacity: 1;
        }

        .rb-bg-layer.-blue {
          background: rgba(92, 130, 255, 0.92);
        }

        .rb-bg-layer.-purple {
          background: rgba(142, 76, 190, 0.92);
        }

        .rb-pill:hover .rb-inner-static {
          opacity: 0;
          transform: translateY(-70%);
          transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1),
            opacity 0.25s linear;
        }

        .rb-pill:hover .rb-inner-hover {
          opacity: 1;
          transform: translateY(0);
          transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1),
            opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .rb-pill:hover .rb-bg-layer {
          transition: transform 1.1s cubic-bezier(0.19, 1, 0.22, 1),
            opacity 0.25s linear;
        }

        .rb-pill:hover .rb-bg-layer-1 {
          transform: scale(1);
        }

        .rb-pill:hover .rb-bg-layer-2 {
          transition-delay: 0.08s;
          transform: scale(1);
        }

        /* Hide scrollbar but keep functionality */
        aside {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        aside::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}