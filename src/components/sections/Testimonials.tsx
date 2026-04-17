import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  quote: string;
}

export const Testimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id,author_name,author_title,quote")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setItems(data as Testimonial[]));
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[idx];

  return (
    <section id="testimonials" className="relative py-32 md:py-44 bg-noir-soft border-y border-border/30 overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 bg-gradient-radial-gold opacity-30 pointer-events-none" />

      <div className="container-elegant relative">
        <div className="text-center mb-12">
          <p className="eyebrow ornament">Press · Praise</p>
        </div>

        <div className="max-w-4xl mx-auto text-center min-h-[280px] flex flex-col items-center justify-center">
          <span className="font-display text-[10rem] leading-none text-primary/20 select-none -mb-12">"</span>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-2xl md:text-4xl lg:text-5xl text-cream italic font-light leading-[1.3] text-balance px-4"
            >
              {current.quote}
            </motion.blockquote>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.figcaption
              key={current.id + "_a"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10"
            >
              <p className="font-display text-xl text-primary">— {current.author_name}</p>
              {current.author_title && (
                <p className="eyebrow text-cream/50 mt-2 text-[10px]">{current.author_title}</p>
              )}
            </motion.figcaption>
          </AnimatePresence>
        </div>

        {/* Dots */}
        {items.length > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`h-px transition-all duration-500 ${
                  i === idx ? "w-12 bg-primary" : "w-6 bg-cream/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
