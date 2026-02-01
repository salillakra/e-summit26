"use client";

import { m } from "framer-motion";

export default function ScrollBelow() {
  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <m.button
      onClick={handleScroll}
      className="group flex flex-col items-center gap-3 cursor-pointer focus:outline-none"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      aria-label="Scroll down"
    >

      <div className="relative w-6 h-9 sm:w-7 sm:h-10 rounded-full border-2 border-white/60 group-hover:border-white/90 transition-colors">
        <m.div
          className="absolute left-1/2 top-2 w-1 h-2 bg-white/60 rounded-full group-hover:bg-white/90 transition-colors"
          style={{ x: "-50%" }}
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </m.button>
  );
}
