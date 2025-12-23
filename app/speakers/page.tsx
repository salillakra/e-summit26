import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import SpeakersHero from "@/components/SpeakersHero"; // you said this already exists in /components
import SpeakersGrid from "@/components/SpeakersGrid";
import PastSpeakersGrid from "@/components/PastSpeakersGrid";
import { domAnimation, LazyMotion } from "framer-motion";

export default function SpeakersPage() {
  return (
    <div className="isolate bg-black text-white">
      <LazyMotion features={domAnimation}>
        <Navbar />
        <main>
          <SpeakersHero />
          <SpeakersGrid />
          <PastSpeakersGrid />
        </main>
        <FooterSection />
      </LazyMotion>
    </div>
  );
}
