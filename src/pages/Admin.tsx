import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { LogOut, FileText, Image as ImageIcon, Calendar, Quote, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { PerformancesManager } from "@/components/admin/PerformancesManager";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { InquiriesViewer } from "@/components/admin/InquiriesViewer";

type Tab = "content" | "gallery" | "performances" | "testimonials" | "inquiries";

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "content", label: "Site Content", icon: FileText },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "performances", label: "Performances", icon: Calendar },
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "inquiries", label: "Inquiries", icon: Mail },
];

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("content");

  useEffect(() => {
    document.title = "Dashboard · Anaya Rao";
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <p className="font-display italic text-cream/50">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin)
    return (
      <div className="min-h-screen bg-noir flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-3xl text-cream italic mb-4">Access denied</p>
        <p className="text-cream/60 mb-8">This account does not have admin privileges.</p>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-noir text-cream">
      {/* Top bar */}
      <header className="border-b border-border bg-noir-soft sticky top-0 z-30">
        <div className="container-elegant py-5 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="font-display text-2xl tracking-wider">
              Anaya<span className="text-primary"> · </span>Rao
            </span>
            <span className="eyebrow text-cream/40 text-[10px]">Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden md:block eyebrow text-cream/50 text-[10px]">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut size={14} /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container-elegant py-10 grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3">
          <nav className="flex lg:flex-col gap-1 lg:gap-2 overflow-x-auto lg:sticky lg:top-28">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-left transition-all duration-300 border-l-2 whitespace-nowrap",
                    active
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-cream/60 hover:text-cream hover:bg-card",
                  )}
                >
                  <Icon size={16} />
                  <span className="font-sans text-sm tracking-wide">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="col-span-12 lg:col-span-9">
          {tab === "content" && <ContentEditor />}
          {tab === "gallery" && <GalleryManager />}
          {tab === "performances" && <PerformancesManager />}
          {tab === "testimonials" && <TestimonialsManager />}
          {tab === "inquiries" && <InquiriesViewer />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
