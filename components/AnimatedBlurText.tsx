"use client";

import { motion } from "framer-motion";

interface AnimatedBlurTextProps {
  lines: string[];
  liteText?: string;
  className?: string;
  charDelay?: number;
  duration?: number;
  inView?: boolean;
}

export default function AnimatedBlurText({
  lines,
  liteText,
  className = "",
  charDelay = 0.03,
  duration = 0.8,
}: AnimatedBlurTextProps) {
  // Calculate total length of all lines except the last one for delay calculation
  const getTotalPreviousLength = (lineIdx: number): number => {
    return lines.slice(0, lineIdx).reduce((acc, line) => acc + line.length, 0);
  };

  return (
    <motion.div className={className}>
      {lines.map((line, lineIdx) => {
        const previousCharsCount = getTotalPreviousLength(lineIdx);
        const isLastLine = lineIdx === lines.length - 1;

        return (
          <div aria-hidden key={lineIdx}>
            {line.split("").map((char, charIdx) => (
              <motion.span
                aria-hidden
                key={`char-${lineIdx}-${charIdx}`}
                initial={{ opacity: 0, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{
                  duration,
                  ease: [0.22, 1, 0.36, 1],
                  delay: (previousCharsCount + charIdx) * charDelay,
                }}
              >
                {char}
              </motion.span>
            ))}
            {isLastLine && liteText && (
              <motion.span
                aria-hidden
                key={`lite-text-${lineIdx}`}
                initial={{ opacity: 0, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: (previousCharsCount + line.length + 1) * charDelay,
                }}
                className="text-white/30"
              >
                {liteText}
              </motion.span>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
