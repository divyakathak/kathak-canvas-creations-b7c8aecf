import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Lightbox } from "./Lightbox";
import { Play, Image as ImageIcon, Film } from "lucide-react";
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
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const [active, setActive] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("id,title,description,category,media_type,media_url,thumbnail_url")
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setItems(data as GalleryItem[]));
  }, []);

  // Items in the active tab
  const tabItems = useMemo(
    () => items.filter((i) => (tab === "photos" ? i.media_type === "image" : i.media_type === "video")),
    [items, tab],
  );

  const categories = useMemo(() => {
    const set = new Set(tabItems.map((i) => i.category));
    return ["all", ...Array.from(set)];
  }, [tabItems]);

  // Reset category when switching tabs
  useEffect(() => {
    setActive("all");
  }, [tab]);

  const filtered = useMemo(
    () => (active === "all" ? tabItems : tabItems.filter((i) => i.category === active)),
    [tabItems, active],
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

          {/* Photos / Videos tab switch */}
          <div className="inline-flex border border-border bg-noir/60 backdrop-blur-md p-1">
            {([
              { key: "photos", label: "Photos", Icon: ImageIcon },
              { key: "videos", label: "Videos", Icon: Film },
            ] as const).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "eyebrow px-5 py-2.5 transition-all duration-500 flex items-center gap-2",
                  tab === key
                    ? "bg-primary text-noir"
                    : "text-cream/60 hover:text-primary",
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category sub-filter (only when there are real categories) */}
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "eyebrow text-[10px] px-4 py-2 transition-all duration-500 border",
                  active === cat
                    ? "border-primary text-noir bg-primary"
                    : "border-border text-cream/60 hover:text-primary hover:border-primary/50",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* True CSS masonry via columns — equal spacing, responsive */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 [column-fill:_balance]"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              return (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: (i % 8) * 0.04 }}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative overflow-hidden bg-noir cursor-pointer w-full block mb-5 break-inside-avoid"
                >
                  {item.media_type === "image" ? (
                    <img
                      src={item.media_url}
                      alt={item.title}
                      loading="lazy"
                      className="block w-full h-auto transition-transform duration-[1.4s] ease-out group-hover:scale-110"
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
                        className="block w-full h-auto transition-transform duration-[1.4s] ease-out group-hover:scale-110"
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
            {tab === "videos" ? "No videos uploaded yet — add some from the admin panel." : "No photos in this category yet."}
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
