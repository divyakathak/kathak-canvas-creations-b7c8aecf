import { useEffect } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Gallery } from "@/components/sections/Gallery";
import { Performances } from "@/components/sections/Performances";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Loader } from "@/components/sections/Loader";
import { ScrollProgress } from "@/components/sections/ScrollProgress";
import { CursorGlow } from "@/components/sections/CursorGlow";
import { FloatingActions } from "@/components/sections/FloatingActions";
import { MusicToggle } from "@/components/sections/MusicToggle";

const Index = () => {
  // Basic SEO
  useEffect(() => {
    document.title = "Divya Bhardwaj | Kathak Artist & Choreographer";
    const desc =
      "Divya Bhardwaj — Kathak Artist & Choreographer. Founder of Divyakala Performing Arts. Performances, workshops, gallery & bookings.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/";
  }, []);

  return (
    <>
      <Loader />
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Hero />
        <About />
        <Gallery />
        <Performances />
        <Testimonials />
        <Contact />
      </motion.main>
      <Footer />
      <FloatingActions />
      <MusicToggle />
    </>
  );
};

export default Index;
