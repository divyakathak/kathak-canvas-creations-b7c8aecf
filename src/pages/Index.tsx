import { useEffect } from "react";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Gallery } from "@/components/sections/Gallery";
import { Performances } from "@/components/sections/Performances";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  // Basic SEO
  useEffect(() => {
    document.title = "Anaya Rao · Kathak Artist & Choreographer";
    const desc =
      "Award-winning Kathak dancer and choreographer Anaya Rao. Performances, workshops, gallery, and bookings.";
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
      <Nav />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Performances />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;
