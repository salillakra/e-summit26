"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OnboardingBanner() {
  const [user, setUser] = useState<User | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Don't show banner on auth pages or onboarding page
      if (
        pathname?.includes("/auth") ||
        pathname?.includes("/onboarding") ||
        pathname === "/"
      ) {
        setShowBanner(false);
        return;
      }

      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          setShowBanner(false);
          return;
        }

        setUser(currentUser);

        // Check if user has completed onboarding
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", currentUser.id)
          .single();

        // Show banner if no profile exists or onboarding not completed
        if (error || !profile || !profile.onboarding_completed) {
          setShowBanner(true);
        } else {
          setShowBanner(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setShowBanner(false);
      }
    };

    checkOnboardingStatus();
  }, [pathname, supabase]);

  // Add/remove body padding when banner shows/hides
  useEffect(() => {
    if (showBanner) {
      document.body.style.paddingTop = "40px"; // Height of the banner
    } else {
      document.body.style.paddingTop = "0px";
    }

    return () => {
      document.body.style.paddingTop = "0px";
    };
  }, [showBanner]);

  const handleCompleteOnboarding = () => {
    router.push("/auth/onboarding");
  };

  if (!showBanner || !user) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full bg-gradient-to-r from-[#8F00AF] to-[#733080] border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-3 text-center">
          <AlertCircle className="h-4 w-4 text-white shrink-0" />
          <p className="text-sm text-white font-medium">
            Complete your onboarding to access all features
          </p>
          <Button
            onClick={handleCompleteOnboarding}
            size="sm"
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold h-7 px-3 text-xs"
          >
            Complete Now
          </Button>
        </div>
      </div>
    </div>
  );
}
