import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ContactHero from "@/components/ContactHero";
import ContactUs from "@/components/ContactUs";
import { domAnimation, LazyMotion } from "framer-motion";
export default function ContactPage() {
  return (
    <div className="isolate bg-black text-white">
      <LazyMotion features={domAnimation}>
        <Navbar />
        <main>
          <ContactHero />
          <ContactUs />
        </main>
        <FooterSection />
      </LazyMotion>
    </div>
  );
}
