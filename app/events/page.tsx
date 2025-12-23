import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import EventsHero from "@/components/EventsHero";
import EventSchedule from "@/components/EventSchedule";
import { domAnimation, LazyMotion } from "framer-motion";
export default function EventsPage() {
  return (
    <div className="isolate bg-black text-white">
      <LazyMotion features={domAnimation}>
        <Navbar />
        <main>
          <EventsHero />
          <EventSchedule />
        </main>
        <FooterSection />
      </LazyMotion>
    </div>
  );
}
