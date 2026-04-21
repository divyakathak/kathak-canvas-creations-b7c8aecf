import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Intro loader — gold ghungroo-inspired ring with the artist's name fading in.
 * Shown once per session for ~1.6s; respects prefers-reduced-motion.
 */
export const Loader = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("kc_intro_done");
  });

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("kc_intro_done", "1");
    }, 1700);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-noir flex items-center justify-center"
        >
          <div className="relative flex flex-col items-center">
            {/* Ghungroo ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-20 h-20 rounded-full border border-primary/40"
            >
              {[...Array(8)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                  style={{
                    transform: `translate(-50%,-50%) rotate(${i * 45}deg) translateY(-44px)`,
                  }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
              <motion.div
                className="absolute inset-2 rounded-full border border-primary/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-display italic text-cream/80 mt-8 text-2xl tracking-wider"
            >
              Divya <span className="text-primary">·</span> Bhardwaj
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="eyebrow text-cream/40 mt-2 text-[10px]"
            >
              Kathak Artist & Choreographer
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};