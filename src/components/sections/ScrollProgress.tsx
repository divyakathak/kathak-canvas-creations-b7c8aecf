import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin gold scroll progress bar pinned to the very top of the page.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-primary-deep via-primary to-primary-glow pointer-events-none"
    />
  );
};