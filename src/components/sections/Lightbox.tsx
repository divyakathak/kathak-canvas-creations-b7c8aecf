import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Item {
  id: string;
  title: string;
  description: string | null;
  category: string;
  media_type: "image" | "video";
  media_url: string;
}

interface LightboxProps {
  items: Item[];
  startIndex: number;
  onClose: () => void;
}

export const Lightbox = ({ items, startIndex, onClose }: LightboxProps) => {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [items.length, onClose]);

  const current = items[index];
  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-noir/98 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-cream/70 hover:text-primary z-10 p-2"
        aria-label="Close"
      >
        <X size={28} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIndex((i) => (i - 1 + items.length) % items.length);
        }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-cream/70 hover:text-primary p-3 z-10"
        aria-label="Previous"
      >
        <ChevronLeft size={36} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIndex((i) => (i + 1) % items.length);
        }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-cream/70 hover:text-primary p-3 z-10"
        aria-label="Next"
      >
        <ChevronRight size={36} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl max-h-full flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {current.media_type === "image" ? (
            <img
              src={current.media_url}
              alt={current.title}
              className="max-h-[80vh] w-auto object-contain shadow-elegant"
            />
          ) : (
            <video
              src={current.media_url}
              controls
              autoPlay
              className="max-h-[80vh] w-auto shadow-elegant"
            />
          )}
          <div className="mt-6 text-center">
            <p className="eyebrow text-primary mb-2">{current.category}</p>
            <p className="font-display text-2xl text-cream italic">{current.title}</p>
            {current.description && (
              <p className="mt-2 text-cream/60 max-w-xl">{current.description}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 eyebrow text-cream/40">
        {index + 1} / {items.length}
      </p>
    </motion.div>
  );
};
