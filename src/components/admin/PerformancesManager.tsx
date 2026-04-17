import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Performance {
  id: string;
  title: string;
  description: string | null;
  venue: string | null;
  city: string | null;
  event_date: string | null;
  event_type: string;
  ticket_url: string | null;
  is_upcoming: boolean;
  sort_order: number;
}

const TYPES = ["performance", "workshop", "festival"];

const blank = {
  title: "",
  description: "",
  venue: "",
  city: "",
  event_date: "",
  event_type: "performance",
  ticket_url: "",
  is_upcoming: true,
};

export const PerformancesManager = () => {
  const [items, setItems] = useState<Performance[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ ...blank });
  const { toast } = useToast();

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("performances")
      .select("*")
      .order("event_date", { ascending: false });
    if (data) setItems(data as Performance[]);
  }

  const create = async () => {
    if (!draft.title) return toast({ title: "Title required", variant: "destructive" });
    const { error } = await supabase.from("performances").insert([{
      title: draft.title,
      description: draft.description || null,
      venue: draft.venue || null,
      city: draft.city || null,
      event_date: draft.event_date || null,
      event_type: draft.event_type,
      ticket_url: draft.ticket_url || null,
      is_upcoming: draft.is_upcoming,
      sort_order: items.length,
    }]);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setDraft({ ...blank });
    setAdding(false);
    toast({ title: "Performance added" });
    load();
  };

  const update = async (id: string, patch: Partial<Performance>) => {
    const { error } = await supabase.from("performances").update(patch).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this performance?")) return;
    const { error } = await supabase.from("performances").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-border flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-cream italic mb-1">Performances</h2>
          <p className="text-cream/50 text-sm">Upcoming & past events, workshops, and festivals.</p>
        </div>
        <Button variant="gold" onClick={() => setAdding((v) => !v)}>
          <Plus size={14} /> {adding ? "Cancel" : "Add Event"}
        </Button>
      </header>

      {adding && (
        <div className="border border-primary/40 p-6 mb-8 bg-card space-y-4">
          <p className="eyebrow text-primary">New event</p>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Title *" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm" />
            <select value={draft.event_type} onChange={(e) => setDraft({ ...draft, event_type: e.target.value })}
              className="bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input placeholder="Venue" value={draft.venue} onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
              className="bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm" />
            <input placeholder="City" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              className="bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm" />
            <input type="date" value={draft.event_date} onChange={(e) => setDraft({ ...draft, event_date: e.target.value })}
              className="bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm" />
            <input placeholder="Ticket URL (optional)" value={draft.ticket_url} onChange={(e) => setDraft({ ...draft, ticket_url: e.target.value })}
              className="bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm" />
          </div>
          <textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={2}
            className="w-full bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm resize-none" />
          <label className="flex items-center gap-2 text-cream/70 text-sm">
            <input type="checkbox" checked={draft.is_upcoming} onChange={(e) => setDraft({ ...draft, is_upcoming: e.target.checked })} />
            Mark as upcoming
          </label>
          <Button variant="gold" onClick={create}><Save size={14} /> Save event</Button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="border border-border bg-card p-5 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 md:col-span-2">
              <input type="date" value={p.event_date ?? ""} onChange={(e) => update(p.id, { event_date: e.target.value })}
                className="w-full bg-input border border-border px-2 py-1.5 text-cream text-xs" />
            </div>
            <div className="col-span-12 md:col-span-5">
              <input value={p.title} onChange={(e) => setItems((prev) => prev.map((x) => x.id === p.id ? { ...x, title: e.target.value } : x))}
                onBlur={(e) => update(p.id, { title: e.target.value })}
                className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-1 text-cream font-display text-lg" />
              <input value={p.venue ?? ""} placeholder="Venue, City"
                onChange={(e) => setItems((prev) => prev.map((x) => x.id === p.id ? { ...x, venue: e.target.value } : x))}
                onBlur={(e) => update(p.id, { venue: e.target.value })}
                className="w-full bg-transparent border-b border-border/40 focus:border-primary outline-none py-1 text-cream/70 text-sm mt-1" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <select value={p.event_type} onChange={(e) => update(p.id, { event_type: e.target.value })}
                className="w-full bg-input border border-border px-2 py-1.5 text-cream text-xs">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-4 md:col-span-2">
              <label className="flex items-center gap-2 text-cream/70 text-xs">
                <input type="checkbox" checked={p.is_upcoming} onChange={(e) => update(p.id, { is_upcoming: e.target.checked })} />
                Upcoming
              </label>
            </div>
            <div className="col-span-2 md:col-span-1 flex justify-end">
              <button onClick={() => remove(p.id)} className="text-destructive/70 hover:text-destructive p-1.5" aria-label="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-cream/50 py-12 italic font-display">No events yet.</p>}
      </div>
    </div>
  );
};
