import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

type Variant = "tilt" | "rise" | "flip" | "depth";

interface Scene3DProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const smooth = (mv: MotionValue<number>) =>
  useSpring(mv, { stiffness: 80, damping: 22, mass: 0.4 });

/**
 * Wraps a section and applies a cinematic 3D scroll-linked transform.
 * The element enters with depth/rotation and settles flat as it crosses
 * the viewport — gives the page a "stage reveal" feel instead of a flat scroll.
 */
export const Scene3D = ({ children, variant = "tilt", className }: Scene3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Shared ranges
  const opacityRaw = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const opacity = smooth(opacityRaw);

  // Variant-specific transforms
  const rotateXRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    variant === "tilt" ? [18, 0, -10] :
    variant === "flip" ? [35, 0, -20] :
    variant === "depth" ? [8, 0, -6] : [0, 0, 0]
  );
  const rotateX = smooth(rotateXRaw);

  const yRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    variant === "rise" ? [140, 0, -80] : [60, 0, -40]
  );
  const y = smooth(yRaw);

  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    variant === "depth" ? [0.82, 1, 0.92] : [0.94, 1, 0.97]
  );
  const scale = smooth(scaleRaw);

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1400, perspectiveOrigin: "50% 50%" }}
    >
      <motion.div
        style={{
          rotateX,
          y,
          scale,
          opacity,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};