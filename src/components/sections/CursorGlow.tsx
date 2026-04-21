import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Soft golden cursor glow that follows the mouse on devices with a fine pointer.
 * Hidden on touch devices and when prefers-reduced-motion is set.
 */
export const CursorGlow = () => {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[55] h-[420px] w-[420px] rounded-full mix-blend-screen"
      style={{
        left: pos.x - 210,
        top: pos.y - 210,
        background:
          "radial-gradient(circle, hsl(var(--gold) / 0.18) 0%, hsl(var(--gold) / 0.06) 35%, transparent 70%)",
      }}
      animate={{ left: pos.x - 210, top: pos.y - 210 }}
      transition={{ type: "spring", stiffness: 150, damping: 22, mass: 0.4 }}
    />
  );
};