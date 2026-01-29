"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Sparkles, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";

export default function SpeakerRevealPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();
  const { width, height } = useWindowSize();

  const TARGET_CLICKS = 500;
  const EVENT_DATE = new Date("2026-02-13T00:00:00");

  useEffect(() => {
    fetchData();
    const interval = setInterval(updateCountdown, 1000);

    // Subscribe to real-time updates
    const channel = supabase
      .channel("speaker_reveal_clicks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "speaker_reveal_clicks",
        },
        () => {
          fetchClickCount();
        },
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = EVENT_DATE.getTime() - now;

    if (distance < 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft({
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    });
  };

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      await fetchClickCount();

      if (user) {
        const { data, error } = await supabase
          .from("speaker_reveal_clicks")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!error && data) {
          setHasClicked(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClickCount = async () => {
    const { count, error } = await supabase
      .from("speaker_reveal_clicks")
      .select("*", { count: "exact", head: true });

    if (!error && count !== null) {
      setClickCount(count);
      if (count >= TARGET_CLICKS) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 10000);
      }
    }
  };

  const handleGoogleLogin = () => {
    router.push("/auth/login?redirect=/reveal/speaker");
  };

  const handleClick = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (hasClicked) {
      toast({
        title: "Already Clicked!",
        description: "You've already contributed to the reveal.",
      });
      return;
    }

    setClicking(true);
    try {
      const { error } = await supabase
        .from("speaker_reveal_clicks")
        .insert({ user_id: user.id });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Clicked!",
            description: "You've already contributed to the reveal.",
          });
          setHasClicked(true);
        } else {
          throw error;
        }
      } else {
        setHasClicked(true);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);

        await fetchClickCount();

        toast({
          title: "Click Registered! ✨",
          description: `${TARGET_CLICKS - clickCount - 1} clicks remaining to reveal the speakers!`,
        });
      }
    } catch (error) {
      console.error("Error clicking:", error);
      toast({
        title: "Error",
        description: "Failed to register click. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClicking(false);
    }
  };

  const progress = (clickCount / TARGET_CLICKS) * 100;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-[#733080]" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-black via-[#0a0015] to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#733080]/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B05EC2]/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 text-white/85 mb-6">
                <span className="h-px w-10 bg-white/80" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                  Speaker Reveal
                </span>
                <span className="h-px w-10 bg-white/80" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 px-4">
                Help Us Reveal Our
                <span className="block mt-2 bg-linear-to-r from-[#733080] via-[#B05EC2] to-[#733080] bg-clip-text text-transparent">
                  Mystery Speakers
                </span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Join the community in unlocking our special guest for E-Summit
                2026!
              </p>
            </div>

            {/* Countdown */}
            <div className="mb-12">
              <h2 className="text-center text-xl sm:text-2xl font-semibold text-white mb-6 px-4">
                Time Until E-Summit 2026
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Click Progress */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#733080]" />
                  <span className="text-white font-semibold text-sm sm:text-base">
                    Community Progress
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {clickCount} / {TARGET_CLICKS}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-6">
                <div
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-[#733080] to-[#B05EC2] transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>

              <p className="text-center text-gray-400 mb-6 text-sm sm:text-base">
                {clickCount >= TARGET_CLICKS
                  ? "🎉 Target Reached! Speakers will be revealed soon!"
                  : `${TARGET_CLICKS - clickCount} more ${TARGET_CLICKS - clickCount === 1 ? "click" : "clicks"} needed to unlock the reveal!`}
              </p>

              {/* Click Button */}
              <Button
                onClick={handleClick}
                disabled={clicking || hasClicked || clickCount >= TARGET_CLICKS}
                className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-linear-to-r from-[#733080] to-[#B05EC2] hover:from-[#733080]/90 hover:to-[#B05EC2]/90 text-white shadow-[0_0_30px_rgba(115,48,128,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {clicking ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : hasClicked ? (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    You&apos;ve Contributed!
                  </>
                ) : clickCount >= TARGET_CLICKS ? (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Target Reached!
                  </>
                ) : !user ? (
                  "Login to Participate"
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Click to Reveal
                  </>
                )}
              </Button>
            </div>

            {/* Celebration Effect */}
            {showCelebration && (
              <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.3}
              />
            )}

            {/* Speaker Reveal Preview */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-[#733080] via-[#B05EC2] to-[#733080] rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-black/60 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Image Section */}
                  <div className="relative h-64 md:h-auto min-h-[300px]">
                    <img
                      src="/photo-1507525428034-b723cf961d3e.avif"
                      alt="Speakers"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/80 via-black/50 to-transparent" />

                    {/* Floating badge */}
                    <div className="absolute top-6 left-6">
                      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#B05EC2] animate-pulse" />
                        <span className="text-white text-sm font-medium">
                          Revealing Soon
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Info Section */}
                  <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                          Featured Speakers
                        </h3>
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                          Industry leaders ready to share their insights at
                          E-Summit 2026
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                            {clickCount}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                            Total Clicks
                          </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                          <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#733080] to-[#B05EC2] bg-clip-text text-transparent mb-1">
                            {TARGET_CLICKS - clickCount}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                            Remaining
                          </div>
                        </div>
                      </div>

                      {/* Status Message */}
                      <div className="flex items-center gap-3 p-4 bg-linear-to-r from-[#733080]/20 to-[#B05EC2]/20 border border-[#733080]/30 rounded-xl">
                        <Sparkles className="h-5 w-5 text-[#B05EC2] flex-shrink-0" />
                        <p className="text-white text-sm sm:text-base">
                          {clickCount >= TARGET_CLICKS
                            ? "Target reached! Speakers will be revealed soon."
                            : `Be part of the reveal — ${TARGET_CLICKS - clickCount} ${TARGET_CLICKS - clickCount === 1 ? "click" : "clicks"} to go!`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Please login to participate in revealing our mystery speakers!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-white hover:bg-gray-100 text-black font-semibold flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FooterSection />

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .celebration-burst {
          animation: celebrationPop 0.6s ease-out forwards;
        }
        @keyframes celebrationPop {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
