import { useEffect, useState } from "react";
import { Trash2, Mail, Phone, Calendar, MapPin, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Inquiry {
  id: string;
  inquiry_type: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  event_date: string | null;
  venue: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const InquiriesViewer = () => {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  const { toast } = useToast();

  useEffect(() => { void load(); }, []);

  async function load() {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as Inquiry[]);
  }

  const markRead = async (id: string) => {
    const { error } = await supabase.from("inquiries").update({ is_read: true }).eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  const visible = filter === "unread" ? items.filter((i) => !i.is_read) : items;
  const unreadCount = items.filter((i) => !i.is_read).length;

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-border flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-cream italic mb-1">Inquiries</h2>
          <p className="text-cream/50 text-sm">Contact and booking submissions from the website.</p>
        </div>
        <div className="flex gap-2">
          {(["unread", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("eyebrow text-[10px] px-4 py-2 border transition-colors",
                filter === f ? "border-primary text-noir bg-primary" : "border-border text-cream/60 hover:text-primary")}>
              {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-4">
        {visible.length === 0 && <p className="text-center text-cream/50 py-12 italic font-display">No {filter} inquiries.</p>}
        {visible.map((i) => (
          <div key={i.id} className={cn("border bg-card p-6 transition-all", i.is_read ? "border-border" : "border-primary/40")}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-display text-2xl text-cream italic">{i.name}</p>
                  <span className="eyebrow text-[10px] px-2 py-0.5 border border-primary/40 text-primary">
                    {i.inquiry_type}
                  </span>
                  {!i.is_read && <span className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                <p className="text-cream/40 text-xs">
                  {new Date(i.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-1">
                {!i.is_read && (
                  <button onClick={() => markRead(i.id)} className="p-2 text-primary hover:bg-primary/10" aria-label="Mark read">
                    <Check size={16} />
                  </button>
                )}
                <button onClick={() => remove(i.id)} className="p-2 text-destructive/70 hover:text-destructive" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/70 mb-4">
              <a href={`mailto:${i.email}`} className="flex items-center gap-2 hover:text-primary"><Mail size={14} />{i.email}</a>
              {i.phone && <span className="flex items-center gap-2"><Phone size={14} />{i.phone}</span>}
              {i.event_date && <span className="flex items-center gap-2"><Calendar size={14} />{i.event_date}</span>}
              {i.venue && <span className="flex items-center gap-2"><MapPin size={14} />{i.venue}</span>}
            </div>

            {i.subject && <p className="font-display text-lg text-cream mb-2">{i.subject}</p>}
            <p className="text-cream/80 whitespace-pre-wrap leading-relaxed">{i.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
