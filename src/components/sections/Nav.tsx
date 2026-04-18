import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#performances", label: "Performances" },
  { href: "#testimonials", label: "Press" },
  { href: "#contact", label: "Contact" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-noir/85 backdrop-blur-md border-b border-border/50 py-4"
          : "py-6",
      )}
    >
      <div className="container-elegant flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <span className="font-display text-2xl tracking-wider text-cream group-hover:text-primary transition-colors duration-500">
            Divya<span className="text-primary"> · </span>Bhardwaj
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={isHome ? l.href : `/${l.href}`}
              className="story-link eyebrow text-cream/70 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-cream"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-noir border-t border-border/50"
        >
          <nav className="container-elegant py-8 flex flex-col gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={isHome ? l.href : `/${l.href}`}
                onClick={() => setOpen(false)}
                className="eyebrow text-cream/80 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};
