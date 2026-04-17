import { useEffect, useState } from "react";
import { Trash2, Plus, Star, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "./MediaUploader";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_featured: boolean;
}

const CATEGORIES = ["performance", "rehearsal", "portrait", "workshop", "festival"];

export const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  // New item draft
  const [draft, setDraft] = useState<{
    title: string;
    description: string;
    category: string;
    media_url: string;
    media_type: "image" | "video";
  }>({ title: "", description: "", category: "performance", media_url: "", media_type: "image" });

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data as GalleryItem[]);
  }

  const create = async () => {
    if (!draft.title || !draft.media_url) {
      toast({ title: "Title and media required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("gallery_items").insert([{
      title: draft.title,
      description: draft.description || null,
      category: draft.category,
      media_url: draft.media_url,
      media_type: draft.media_type,
      sort_order: items.length,
    }]);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    setDraft({ title: "", description: "", category: "performance", media_url: "", media_type: "image" });
    setAdding(false);
    toast({ title: "Added to gallery" });
    load();
  };

  const update = async (id: string, patch: Partial<GalleryItem>) => {
    const { error } = await supabase.from("gallery_items").update(patch).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Deleted" });
      load();
    }
  };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-border flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-cream italic mb-1">Gallery</h2>
          <p className="text-cream/50 text-sm">Manage photos and videos. Categories filter on the public site.</p>
        </div>
        <Button variant="gold" onClick={() => setAdding((v) => !v)}>
          <Plus size={14} /> {adding ? "Cancel" : "Add Media"}
        </Button>
      </header>

      {adding && (
        <div className="border border-primary/40 p-6 mb-8 bg-card space-y-4">
          <p className="eyebrow text-primary">New gallery item</p>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm"
            />
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea
            placeholder="Description (optional)"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={2}
            className="w-full bg-input border border-border focus:border-primary outline-none px-3 py-2.5 text-cream text-sm resize-none"
          />
          <div className="flex items-center gap-4">
            <MediaUploader
              onUploaded={(url, mediaType) => setDraft({ ...draft, media_url: url, media_type: mediaType })}
              label="Upload file"
            />
            <span className="text-cream/40 text-xs">or paste URL:</span>
            <input
              placeholder="https://..."
              value={draft.media_url}
              onChange={(e) => setDraft({ ...draft, media_url: e.target.value })}
              className="flex-1 bg-input border border-border focus:border-primary outline-none px-3 py-2 text-cream text-sm"
            />
          </div>
          {draft.media_url && (
            <div className="aspect-video w-full max-w-xs">
              {draft.media_type === "image" ? (
                <img src={draft.media_url} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <video src={draft.media_url} controls className="w-full h-full object-cover" />
              )}
            </div>
          )}
          <Button variant="gold" onClick={create}>
            <Save size={14} /> Add to gallery
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.id} className="border border-border bg-card group">
            <div className="aspect-square overflow-hidden bg-noir relative">
              {item.media_type === "image" ? (
                <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <video src={item.media_url} className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => update(item.id, { is_featured: !item.is_featured })}
                className={`absolute top-2 right-2 p-2 ${item.is_featured ? "text-primary" : "text-cream/40 hover:text-primary"}`}
                aria-label="Toggle featured"
              >
                <Star size={16} fill={item.is_featured ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <input
                value={item.title}
                onChange={(e) => setItems((p) => p.map((x) => x.id === item.id ? { ...x, title: e.target.value } : x))}
                onBlur={(e) => update(item.id, { title: e.target.value })}
                className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-1 text-cream font-display text-lg"
              />
              <select
                value={item.category}
                onChange={(e) => update(item.id, { category: e.target.value })}
                className="w-full bg-input border border-border focus:border-primary outline-none px-2 py-1.5 text-cream text-xs"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                onClick={() => remove(item.id)}
                className="flex items-center gap-2 text-destructive/70 hover:text-destructive eyebrow text-[10px] mt-2"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-cream/50 py-12 italic font-display">No gallery items yet.</p>
        )}
      </div>
    </div>
  );
};
