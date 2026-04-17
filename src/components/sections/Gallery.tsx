import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Lightbox } from "./Lightbox";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string | null;
}

export const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [active, setActive] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("id,title,description,category,media_type,media_url,thumbnail_url")
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setItems(data as GalleryItem[]));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((i) => i.category === active)),
    [items, active],
  );

  return (
    <section id="gallery" className="relative py-32 md:py-44 bg-noir-soft border-y border-border/30">
      <div className="container-elegant">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="eyebrow mb-6">
              <span className="gold-line mr-4" />
              Visual Archive
            </p>
            <h2 className="font-display text-5xl md:text-7xl font-light leading-[1.05] text-cream text-balance">
              <span className="italic">Moments</span> in Motion
            </h2>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "eyebrow px-4 py-2 transition-all duration-500 border",
                  active === cat
                    ? "border-primary text-noir bg-primary"
                    : "border-border text-cream/60 hover:text-primary hover:border-primary/50",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-ish grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              // Vary aspect ratios for editorial feel
              const aspect = i % 5 === 0 ? "aspect-[3/4]" : i % 4 === 0 ? "aspect-square" : "aspect-[4/5]";
              const span = i % 7 === 0 ? "md:row-span-2 md:aspect-[3/5]" : "";

              return (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: (i % 8) * 0.05 }}
                  onClick={() => setLightboxIndex(i)}
                  className={cn(
                    "group relative overflow-hidden bg-noir cursor-pointer",
                    aspect,
                    span,
                  )}
                >
                  {item.media_type === "image" ? (
                    <img
                      src={item.media_url}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                    />
                  ) : (
                    <>
                      <video
                        src={item.media_url}
                        poster={item.thumbnail_url ?? undefined}
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                        onMouseLeave={(e) => {
                          const v = e.currentTarget as HTMLVideoElement;
                          v.pause();
                          v.currentTime = 0;
                        }}
                        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-noir/30 group-hover:bg-noir/0 transition-colors duration-500">
                        <Play className="text-cream w-12 h-12 fill-cream/80 group-hover:scale-110 transition-transform" />
                      </div>
                    </>
                  )}

                  {/* Caption overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <div>
                      <p className="eyebrow text-primary mb-2">{item.category}</p>
                      <p className="font-display text-xl text-cream italic">{item.title}</p>
                    </div>
                  </div>

                  {/* Border accent */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-primary/0 group-hover:ring-primary/40 transition-all duration-500" />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center font-display italic text-cream/40 py-20">
            No items in this category yet.
          </p>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
};
