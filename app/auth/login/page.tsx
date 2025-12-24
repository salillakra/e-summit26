"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Silk from "@/components/Silk";
import { LoginForm } from "@/components/login-form";

export default function SignInPage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Silk background */}
      <div className="absolute inset-0">
        <Silk
          speed={5}
          scale={1}
          color="#B05EC2"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* Decorative cubes */}
      <Image
        width={200}
        height={200}
        src="/Cube.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute z-0 -left-20 top-[10%] w-40 md:w-60 opacity-80 mix-blend-screen animate-[spin_24s_linear_infinite]"
        style={{ transform: "rotate(12deg)" }}
      />

      <Image
        width={200}
        height={200}
        src="/Triangle.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute z-0 -right-10 bottom-[15%] w-48 md:w-72 opacity-80 mix-blend-screen animate-[spin_24s_linear_infinite]"
        style={{ animationDirection: "reverse" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <Image
            width={400}
            height={80}
            src="/esummit_logo.png"
            alt="E-Summit 2026"
            draggable={false}
            className="w-[min(90vw,400px)] h-auto select-none drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          />
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          <LoginForm />
        </motion.div>

        {/* Back to Home & Sign up */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex flex-col items-center gap-4 text-center"
        >
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
