"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Silk from "@/components/Silk";

export default function SignInPage() {
  const handleGoogleSignIn = () => {
    // Add your Google OAuth logic here
    console.log("Google Sign In");
  };

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

        {/* Sign in card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10">
            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-white/60 text-base">
                Sign in to continue to E-Summit 2026
              </p>
            </div>

            {/* Google Sign In Button */}
            <motion.button
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full h-14 flex items-center justify-center gap-3 bg-white hover:bg-white/95 text-gray-900 font-semibold text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden"
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              <svg
                className="w-6 h-6 relative z-10"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="relative z-10">Continue with Google</span>
            </motion.button>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-white/50">
                By signing in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-white/80 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-white/80 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </div>
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

          <p className="text-sm text-white/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-white font-medium hover:underline underline-offset-2 transition-all"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
