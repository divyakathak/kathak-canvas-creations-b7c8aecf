import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FooterData {
  title: string;
  subtitle: string;
  body: string;
  data: { email?: string; instagram?: string; youtube?: string; facebook?: string };
}

export const Footer = () => {
  const [c, setC] = useState<FooterData | null>(null);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("title,subtitle,body,data")
      .eq("id", "footer")
      .maybeSingle()
      .then(({ data }) => data && setC(data as FooterData));
  }, []);

  return (
    <footer className="border-t border-primary/20 pt-20 pb-10 bg-noir">
      <div className="container-elegant grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div>
          <p className="font-display text-3xl text-cream tracking-wider">
            {c?.title ?? "Divya Bhardwaj"}
          </p>
          <p className="eyebrow text-primary mt-2">{c?.subtitle ?? "Kathak Artist"}</p>
          <p className="text-cream/60 mt-6 max-w-sm">{c?.body ?? ""}</p>
        </div>

        <div>
          <p className="eyebrow text-cream/50 mb-5">Explore</p>
          <ul className="space-y-3 font-display text-lg">
            <li><a href="#about" className="text-cream/80 hover:text-primary story-link">About</a></li>
            <li><a href="#gallery" className="text-cream/80 hover:text-primary story-link">Gallery</a></li>
            <li><a href="#performances" className="text-cream/80 hover:text-primary story-link">Performances</a></li>
            <li><a href="#contact" className="text-cream/80 hover:text-primary story-link">Booking</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-cream/50 mb-5">Connect</p>
          {c?.data?.email && (
            <a
              href={`mailto:${c.data.email}`}
              className="block font-display text-lg text-primary hover:text-primary-glow mb-6"
            >
              {c.data.email}
            </a>
          )}
          <div className="flex gap-4">
            {c?.data?.instagram && (
              <a href={c.data.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="w-11 h-11 border border-primary/40 flex items-center justify-center text-primary hover:bg-primary hover:text-noir transition-all duration-500">
                <Instagram size={18} />
              </a>
            )}
            {c?.data?.youtube && (
              <a href={c.data.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"
                className="w-11 h-11 border border-primary/40 flex items-center justify-center text-primary hover:bg-primary hover:text-noir transition-all duration-500">
                <Youtube size={18} />
              </a>
            )}
            {c?.data?.facebook && (
              <a href={c.data.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
                className="w-11 h-11 border border-primary/40 flex items-center justify-center text-primary hover:bg-primary hover:text-noir transition-all duration-500">
                <Facebook size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container-elegant border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="eyebrow text-cream/40 text-[10px]">
          © {new Date().getFullYear()} {c?.title ?? "Divya Bhardwaj"} · All Rights Reserved
        </p>
        <Link to="/admin" className="eyebrow text-cream/30 hover:text-primary text-[10px]">
          Admin
        </Link>
      </div>
    </footer>
  );
};
