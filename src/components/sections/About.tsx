import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import aboutImage from "@/assets/about-portrait.jpg";

interface AboutData {
  title: string;
  subtitle: string;
  body: string;
  data: { achievements?: string[]; image_caption?: string };
}

export const About = () => {
  const [c, setC] = useState<AboutData | null>(null);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("title,subtitle,body,data")
      .eq("id", "about")
      .maybeSingle()
      .then(({ data }) => data && setC(data as AboutData));
  }, []);

  return (
    <section id="about" className="relative py-32 md:py-44 overflow-hidden">
      {/* Decorative gold motif */}
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-gradient-radial-gold opacity-40 pointer-events-none" />

      <div className="container-elegant grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Image column */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 lg:sticky lg:top-32"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={aboutImage}
              alt="Portrait of Anaya Rao"
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-primary/30" />
            {/* Gold corner ornaments */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-primary -translate-x-2 -translate-y-2" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-primary translate-x-2 translate-y-2" />
          </div>
          {c?.data?.image_caption && (
            <p className="mt-4 eyebrow text-cream/50 text-[10px]">
              — {c.data.image_caption}
            </p>
          )}
        </motion.div>

        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <p className="eyebrow mb-8">
            <span className="gold-line mr-4" />
            About the Artist
          </p>

          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-cream mb-6 text-balance">
            <span className="italic">{c?.title ?? "The Dance of Story"}</span>
          </h2>

          <p className="font-display italic text-xl md:text-2xl text-primary/90 mb-10 text-balance">
            {c?.subtitle ?? ""}
          </p>

          <div className="prose-elegant max-w-none">
            <p className="font-sans text-lg leading-[1.9] text-cream/80 text-pretty mb-12">
              {c?.body ?? ""}
            </p>
          </div>

          {c?.data?.achievements && c.data.achievements.length > 0 && (
            <div className="border-t border-primary/20 pt-10">
              <p className="eyebrow mb-6 text-cream/60">Recognitions</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {c.data.achievements.map((a, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="flex items-start gap-3 font-display text-lg text-cream/85"
                  >
                    <span className="text-primary mt-2 text-xs">◆</span>
                    <span>{a}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
