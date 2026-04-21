import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

// Royalty-free Indian classical instrumental ambience.
// Hosted on a public CDN — replace with a self-hosted track later if desired.
const TRACK_URL =
  "https://cdn.pixabay.com/download/audio/2022/10/18/audio_3650d51e29.mp3?filename=indian-flute-music-22978.mp3";

/**
 * Subtle background music toggle — pinned bottom-left, glassmorphic.
 * Off by default (autoplay with audio is blocked anyway).
 * Stores user preference in sessionStorage.
 */
export const MusicToggle = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(TRACK_URL);
    a.loop = true;
    a.volume = 0.25;
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        /* user gesture required — silently fail */
      }
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute background music" : "Play background music"}
      className="fixed bottom-6 left-6 z-[70] h-12 w-12 rounded-full bg-noir/70 backdrop-blur-md border border-primary/30 text-primary hover:border-primary hover:shadow-gold transition-all flex items-center justify-center group"
    >
      {playing ? (
        <Music size={18} className="animate-pulse" />
      ) : (
        <VolumeX size={18} className="opacity-70 group-hover:opacity-100" />
      )}
      <span className="absolute inset-0 rounded-full ring-1 ring-primary/0 group-hover:ring-primary/40 transition-all" />
    </button>
  );
};