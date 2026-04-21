import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "919870442949"; // +91 98704 42949

/**
 * Floating "Book Divya" action stack — pinned bottom-right.
 * - Primary: gold "Book Divya" pill that scrolls to #contact
 * - Secondary: WhatsApp click-to-chat
 * Appears after the user scrolls past the hero.
 */
export const FloatingActions = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 z-[70] flex flex-col items-start gap-3"
        >
          <AnimatePresence>
            {open && (
              <motion.a
                key="wa"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Namaste Divya, I'd like to discuss a Kathak performance / workshop booking.",
                )}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="group flex items-center gap-3 rounded-full bg-noir/80 backdrop-blur-md border border-primary/30 pl-4 pr-5 py-3 shadow-elegant hover:border-primary transition-all"
              >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle size={18} />
                  <span className="absolute inset-0 rounded-full bg-[#25D366]/60 animate-ping" />
                </span>
                <span className="eyebrow text-cream group-hover:text-primary transition-colors">WhatsApp</span>
              </motion.a>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Hide quick actions" : "Show quick actions"}
              className="h-10 w-10 rounded-full border border-border bg-noir/80 backdrop-blur-md text-cream/60 hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center"
            >
              <X size={14} className={`transition-transform ${open ? "" : "rotate-45"}`} />
            </button>

            <a
              href="#contact"
              className="relative group inline-flex items-center gap-2 rounded-full bg-gradient-gold pl-5 pr-6 py-3.5 shadow-gold hover:shadow-[0_25px_70px_-15px_hsl(var(--gold)/0.6)] transition-all"
            >
              <Calendar size={16} className="text-noir" />
              <span className="eyebrow text-noir font-semibold">Book Divya</span>
              <span className="absolute inset-0 rounded-full ring-1 ring-primary-glow/40 group-hover:ring-primary-glow transition-all" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};