import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Performance {
  id: string;
  title: string;
  description: string | null;
  venue: string | null;
  city: string | null;
  event_date: string | null;
  event_type: string;
  ticket_url: string | null;
  is_upcoming: boolean;
}

export const Performances = () => {
  const [items, setItems] = useState<Performance[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    supabase
      .from("performances")
      .select("id,title,description,venue,city,event_date,event_type,ticket_url,is_upcoming")
      .order("event_date", { ascending: false })
      .then(({ data }) => data && setItems(data as Performance[]));
  }, []);

  const filtered = items.filter((p) => (tab === "upcoming" ? p.is_upcoming : !p.is_upcoming));

  return (
    <section id="performances" className="py-32 md:py-44">
      <div className="container-elegant">
        <div className="text-center mb-20">
          <p className="eyebrow mb-6 ornament">Calendar</p>
          <h2 className="font-display text-5xl md:text-7xl font-light text-cream text-balance">
            <span className="italic">Performances</span> & Workshops
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-12 mb-16 border-b border-border/40">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-4 eyebrow transition-colors ${
                tab === t ? "text-primary" : "text-cream/50 hover:text-cream"
              }`}
            >
              {t}
              {tab === t && (
                <motion.span
                  layoutId="perf-tab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="max-w-4xl mx-auto">
          {filtered.length === 0 && (
            <p className="text-center font-display italic text-cream/40 py-20 text-xl">
              No {tab} engagements at this time.
            </p>
          )}
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-12 gap-6 py-10 border-b border-border/30 hover:border-primary/40 transition-colors"
            >
              {/* Date */}
              <div className="col-span-12 md:col-span-3">
                <div className="flex md:flex-col items-baseline md:items-start gap-3 md:gap-1">
                  <p className="font-display text-5xl md:text-6xl text-primary leading-none">
                    {p.event_date ? new Date(p.event_date).getDate().toString().padStart(2, "0") : "—"}
                  </p>
                  <div>
                    <p className="eyebrow text-cream/60">
                      {p.event_date ? new Date(p.event_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                    </p>
                    <p className="eyebrow text-primary/70 mt-1 text-[10px]">{p.event_type}</p>
                  </div>
                </div>
              </div>

              {/* Title + venue */}
              <div className="col-span-12 md:col-span-7">
                <h3 className="font-display text-3xl md:text-4xl text-cream font-light italic mb-2 group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="text-cream/65 mb-4 max-w-xl text-pretty">{p.description}</p>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-cream/60">
                  {p.venue && (
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary" />
                      {p.venue}
                      {p.city ? `, ${p.city}` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="col-span-12 md:col-span-2 flex md:justify-end items-start">
                {p.ticket_url ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={p.ticket_url} target="_blank" rel="noreferrer">
                      Tickets <ArrowUpRight size={14} />
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <a href="#contact">
                      Inquire <ArrowUpRight size={14} />
                    </a>
                  </Button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
