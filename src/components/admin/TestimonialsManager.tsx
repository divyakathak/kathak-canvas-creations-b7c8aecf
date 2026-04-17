import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  quote: string;
  is_published: boolean;
  sort_order: number;
}

export const TestimonialsManager = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ author_name: "", author_title: "", quote: "" });
  const { toast } = useToast();

  useEffect(() => { void load(); }, []);

  async function load() {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
    if (data) setItems(data as Testimonial[]);
  }

  const create = async () => {
    if (!draft.author_name || !draft.quote) return toast({ title: "Author and quote required", variant: "destructive" });
    const { error } = await supabase.from("testimonials").insert([{
      author_name: draft.author_name,
      author_title: draft.author_title || null,
      quote: draft.quote,
      sort_order: items.length,
    }]);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setDraft({ author_name: "", author_title: "", quote: "" });
    setAdding(false);
    toast({ title: "Testimonial added" });
    load();
  };

  const update = async (id: string, patch: Partial<Testimonial>) => {
    const { error } = await supabase.from("testimonials").update(patch).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-border flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-cream italic mb-1">Testimonials</h2>
          <p className="text-cream/50 text-sm">Press quotes and reviews. Toggle visibility individually.</p>
        </div>
        <Button variant="gold" onClick={() => setAdding((v) => !v)}>
          <Plus size={14} /> {adding ? "Cancel" : "Add Quote"}
        </Button>
      </header>

      {adding && (
        <div className="border border-primary/40 p-6 mb-8 bg-card space-y-4">
          <input placeholder="Author name *" value={draft.author_name} onChange={(e) => setDraft({ ...draft, author_name: e.target.value })}
            className="w-full bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm" />
          <input placeholder="Author title / publication" value={draft.author_title} onChange={(e) => setDraft({ ...draft, author_title: e.target.value })}
            className="w-full bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm" />
          <textarea placeholder="Quote *" value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} rows={4}
            className="w-full bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm resize-none" />
          <Button variant="gold" onClick={create}><Save size={14} /> Save</Button>
        </div>
      )}

      <div className="space-y-4">
        {items.map((t) => (
          <div key={t.id} className="border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <input value={t.author_name}
                  onChange={(e) => setItems((p) => p.map((x) => x.id === t.id ? { ...x, author_name: e.target.value } : x))}
                  onBlur={(e) => update(t.id, { author_name: e.target.value })}
                  className="bg-transparent border-b border-border focus:border-primary outline-none py-1 text-primary font-display text-lg w-full" />
                <input value={t.author_title ?? ""} placeholder="Title / publication"
                  onChange={(e) => setItems((p) => p.map((x) => x.id === t.id ? { ...x, author_title: e.target.value } : x))}
                  onBlur={(e) => update(t.id, { author_title: e.target.value })}
                  className="bg-transparent border-b border-border/40 focus:border-primary outline-none py-1 text-cream/60 text-xs uppercase tracking-wider w-full mt-1" />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => update(t.id, { is_published: !t.is_published })}
                  className={`p-2 ${t.is_published ? "text-primary" : "text-cream/40"}`} aria-label="Toggle published">
                  {t.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => remove(t.id)} className="p-2 text-destructive/70 hover:text-destructive" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <textarea value={t.quote}
              onChange={(e) => setItems((p) => p.map((x) => x.id === t.id ? { ...x, quote: e.target.value } : x))}
              onBlur={(e) => update(t.id, { quote: e.target.value })}
              rows={3}
              className="w-full bg-transparent border-l-2 border-primary/40 pl-4 outline-none text-cream font-display italic text-lg resize-none" />
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-cream/50 py-12 italic font-display">No testimonials yet.</p>}
      </div>
    </div>
  );
};
