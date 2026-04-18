import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-kathak.jpg";

interface HeroData {
  title: string;
  subtitle: string;
  body: string;
  data: { cta_label?: string; cta_link?: string };
}

export const Hero = () => {
  const [content, setContent] = useState<HeroData | null>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("title,subtitle,body,data")
      .eq("id", "hero")
      .maybeSingle()
      .then(({ data }) => data && setContent(data as HeroData));
  }, []);

  const title = content?.title ?? "Divya Bhardwaj";
  const subtitle = content?.subtitle ?? "Kathak Artist";
  const body = content?.body ?? "";
  const ctaLabel = content?.data?.cta_label ?? "Experience the Art";
  const ctaLink = content?.data?.cta_link ?? "#performances";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-noir" id="home">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={heroImage}
          alt="Divya Bhardwaj performing Kathak on stage"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-overlay-strong" />
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-50" />
      </motion.div>

      {/* Top bar — name */}
      <div className="absolute top-0 left-0 right-0 z-20">
        {/* nav lives in <Nav /> separately */}
      </div>

      {/* Content */}
      <motion.div
        className="container-elegant relative z-10 flex h-full flex-col justify-end pb-24 md:pb-32"
        style={{ opacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-6"
        >
          <span className="gold-line mr-4" />
          {subtitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] tracking-tight text-cream font-light text-balance max-w-5xl"
        >
          {title.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-4 italic">
              {word}
            </span>
          ))}
        </motion.h1>

        {body && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl font-display text-xl md:text-2xl text-cream/80 italic font-light text-pretty"
          >
            {body}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <Button asChild variant="hero" size="lg">
            <a href={ctaLink}>{ctaLabel}</a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="text-cream/70 hover:text-primary uppercase tracking-[0.18em] text-xs">
            <a href="#about">About the Artist</a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3 animate-pulse-gold">
          <span className="eyebrow text-[10px] text-cream/50">Scroll</span>
          <div className="h-12 w-px bg-gradient-to-b from-primary to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};
