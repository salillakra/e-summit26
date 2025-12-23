import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import VenueHero from "@/components/VenueHero";
import VenueReveal from "@/components/VenueReveal";
import { domAnimation, LazyMotion } from "framer-motion";
export default function VenuePage() {
  return (
    <div className="isolate bg-black text-white">
      <LazyMotion features={domAnimation}>
        <Navbar />
        <main>
          <VenueHero />
          <VenueReveal />
        </main>
        <FooterSection />
      </LazyMotion>
    </div>
  );
}
