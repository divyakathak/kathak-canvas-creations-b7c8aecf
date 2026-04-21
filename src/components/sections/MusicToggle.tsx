import { useEffect, useMemo, useRef, useState } from "react";
import { Music2, VolumeX, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

// Royalty-free Indian classical ambiences.
// Section-aware: hero = soft ambient flute, gallery = rhythmic sitar, contact = calm spiritual.
const TRACKS = {
  hero: "https://cdn.pixabay.com/download/audio/2022/10/18/audio_3650d51e29.mp3?filename=indian-flute-music-22978.mp3",
  gallery: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8e54f63e7e.mp3?filename=indian-sitar-music-110624.mp3",
  contact: "https://cdn.pixabay.com/download/audio/2023/06/08/audio_ec40a7b8a4.mp3?filename=meditation-relax-amp-stress-relief-152714.mp3",
} as const;

type Section = keyof typeof TRACKS;

const SECTION_ORDER: Section[] = ["hero", "gallery", "contact"];
const SECTION_IDS: Record<Section, string[]> = {
  hero: ["home", "about"],
  gallery: ["gallery", "performances", "testimonials"],
  contact: ["contact"],
};

/**
 * Premium music experience — top-right glassmorphic toggle.
 * - Auto-plays softly after first user interaction (browser autoplay policy)
 * - Smooth fade-in / fade-out
 * - Volume slider
 * - Swaps track based on the section currently in view
 */
export const MusicToggle = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // ~20%
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("hero");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  // Create audio element once
  useEffect(() => {
    const a = new Audio(TRACKS.hero);
    a.loop = true;
    a.volume = 0;
    a.preload = "auto";
    audioRef.current = a;
    return () => {
      a.pause();
      if (fadeRef.current) window.clearInterval(fadeRef.current);
      audioRef.current = null;
    };
  }, []);

  // Smooth fade helper
  const fadeTo = (target: number, duration = 1200) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeRef.current) window.clearInterval(fadeRef.current);
    const start = a.volume;
    const steps = 30;
    const stepTime = duration / steps;
    let i = 0;
    fadeRef.current = window.setInterval(() => {
      i++;
      const t = i / steps;
      a.volume = Math.max(0, Math.min(1, start + (target - start) * t));
      if (i >= steps) {
        if (fadeRef.current) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
        if (target === 0) a.pause();
      }
    }, stepTime);
  };

  // Try autoplay on first user interaction (browser policy)
  useEffect(() => {
    const start = async () => {
      const a = audioRef.current;
      if (!a || playing) return;
      try {
        a.volume = 0;
        await a.play();
        setPlaying(true);
        fadeTo(volume, 1800);
      } catch {
        /* still blocked — user can press the toggle */
      }
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Observe sections to swap track
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    const flatIds = SECTION_ORDER.flatMap((s) => SECTION_IDS[s].map((id) => ({ id, section: s })));

    flatIds.forEach(({ id, section: sec }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible.set(id, entry.intersectionRatio);
          });
          // Pick the section whose ids have the highest combined visibility
          let best: Section = "hero";
          let bestRatio = -1;
          SECTION_ORDER.forEach((s) => {
            const r = SECTION_IDS[s].reduce((acc, sid) => acc + (visible.get(sid) ?? 0), 0);
            if (r > bestRatio) {
              bestRatio = r;
              best = s;
            }
          });
          setSection(best);
          // suppress unused warning
          void sec;
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Swap track when section changes (with fade)
  const currentTrackRef = useRef<Section>("hero");
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (currentTrackRef.current === section) return;
    const wasPlaying = !a.paused;
    const targetVol = volume;
    // fade out, swap, fade in
    fadeTo(0, 700);
    const t = window.setTimeout(async () => {
      currentTrackRef.current = section;
      a.src = TRACKS[section];
      a.load();
      if (wasPlaying) {
        try {
          await a.play();
          fadeTo(targetVol, 1200);
        } catch {
          /* ignore */
        }
      }
    }, 750);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  // Live volume changes (when already playing)
  useEffect(() => {
    const a = audioRef.current;
    if (!a || a.paused) return;
    a.volume = volume;
  }, [volume]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      fadeTo(0, 600);
      setPlaying(false);
    } else {
      try {
        a.volume = 0;
        await a.play();
        setPlaying(true);
        fadeTo(volume, 1200);
      } catch {
        /* blocked */
      }
    }
  };

  const sectionLabel = useMemo(
    () => ({ hero: "Ambient Flute", gallery: "Sitar Rhythm", contact: "Spiritual Calm" }[section]),
    [section],
  );

  return (
    <div className="fixed top-5 right-5 z-[70] flex items-start gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-noir/80 backdrop-blur-xl border border-primary/30 rounded-full pl-5 pr-4 h-12 flex items-center gap-3 shadow-gold"
          >
            <Volume2 size={14} className="text-primary/80" />
            <Slider
              value={[Math.round(volume * 100)]}
              max={100}
              step={1}
              onValueChange={(v) => setVolume((v[0] ?? 0) / 100)}
              className="w-28"
              aria-label="Music volume"
            />
            <span className="eyebrow text-[9px] text-cream/60 hidden sm:block whitespace-nowrap">
              {sectionLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggle}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={playing ? "Mute background music" : "Play background music"}
        className="h-12 w-12 rounded-full bg-noir/70 backdrop-blur-xl border border-primary/30 text-primary hover:border-primary hover:shadow-gold transition-all flex items-center justify-center relative group"
      >
        {playing ? (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <Music2 size={18} />
          </motion.div>
        ) : (
          <VolumeX size={18} className="opacity-70 group-hover:opacity-100" />
        )}
        <span className="absolute inset-0 rounded-full ring-1 ring-primary/0 group-hover:ring-primary/40 transition-all" />
        {playing && (
          <span className="absolute -inset-1 rounded-full border border-primary/20 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};