import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/**
 * Cinematic intro loader.
 * - Ghungroo-inspired gold ring
 * - Floating golden dust particles
 * - Glowing "Divya Bhardwaj" wordmark with elegant entrance
 * - "Kathak Artist & Choreographer" tagline
 * - Smooth fade into homepage (~3.2s, once per session)
 */
export const Loader = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("kc_intro_done");
  });

  // Pre-compute particle positions once
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 60 + Math.random() * 40,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 1.2,
        duration: 3 + Math.random() * 2.5,
        drift: -20 + Math.random() * 40,
      })),
    [],
  );

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("kc_intro_done", "1");
    }, 3200);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-noir flex items-center justify-center overflow-hidden"
        >
          {/* Radial gold halo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(var(--gold) / 0.12) 0%, transparent 70%)",
            }}
          />

          {/* Golden dust particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute rounded-full bg-primary"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  boxShadow: "0 0 8px hsl(var(--gold) / 0.8)",
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  y: [-20, -180 - Math.random() * 120],
                  x: [0, p.drift],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: Math.random() * 0.6,
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center px-6">
            {/* Ghungroo ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -120 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-24 h-24 rounded-full border border-primary/40"
              style={{ boxShadow: "0 0 40px hsl(var(--gold) / 0.35)" }}
            >
              {[...Array(10)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                  style={{
                    transform: `translate(-50%,-50%) rotate(${i * 36}deg) translateY(-52px)`,
                    boxShadow: "0 0 6px hsl(var(--gold) / 0.9)",
                  }}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.08 }}
                />
              ))}
              <motion.div
                className="absolute inset-3 rounded-full border border-primary/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-6 rounded-full bg-gradient-gold opacity-70"
                animate={{ scale: [0.9, 1.05, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 20, letterSpacing: "0.02em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
              transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display italic text-cream mt-10 text-3xl sm:text-4xl text-center"
              style={{ textShadow: "0 0 30px hsl(var(--gold) / 0.5)" }}
            >
              Divya <span className="text-gradient-gold not-italic font-normal">Bhardwaj</span>
            </motion.h1>

            {/* Gold line */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="block h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mt-5 origin-center"
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.8 }}
              className="eyebrow text-cream/60 mt-4 text-[10px] sm:text-xs text-center"
            >
              Kathak Artist <span className="text-primary mx-1">·</span> Choreographer
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};