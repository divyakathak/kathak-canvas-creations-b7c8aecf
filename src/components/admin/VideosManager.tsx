import { useEffect, useState } from "react";
import { Trash2, Plus, Star, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "./MediaUploader";
import { useToast } from "@/hooks/use-toast";

interface VideoItem {
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

const CATEGORIES = ["performance", "rehearsal", "workshop", "festival", "interview"];

/**
 * VideosManager — dedicated admin section for uploading and managing video content.
 * Stored in the same `gallery_items` table, filtered by media_type = 'video'.
 */
export const VideosManager = () => {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const [draft, setDraft] = useState<{
    title: string;
    description: string;
    category: string;
    media_url: string;
    thumbnail_url: string;
  }>({ title: "", description: "", category: "performance", media_url: "", thumbnail_url: "" });

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("media_type", "video")
      .order("sort_order", { ascending: true });
    if (data) setItems(data as VideoItem[]);
  }

  const create = async () => {
    if (!draft.title || !draft.media_url) {
      toast({ title: "Title and video required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("gallery_items").insert([{
      title: draft.title,
      description: draft.description || null,
      category: draft.category,
      media_url: draft.media_url,
      media_type: "video",
      thumbnail_url: draft.thumbnail_url || null,
      sort_order: items.length,
    }]);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    setDraft({ title: "", description: "", category: "performance", media_url: "", thumbnail_url: "" });
    setAdding(false);
    toast({ title: "Video added" });
    load();
  };

  const update = async (id: string, patch: Partial<VideoItem>) => {
    const { error } = await supabase.from("gallery_items").update(patch).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this video permanently?")) return;
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
          <h2 className="font-display text-3xl text-cream italic mb-1">Videos</h2>
          <p className="text-cream/50 text-sm">Upload performance reels, rehearsals, and interviews. Files up to ~50MB upload directly; for larger files paste a YouTube/Vimeo/CDN URL.</p>
        </div>
        <Button variant="gold" onClick={() => setAdding((v) => !v)}>
          <Plus size={14} /> {adding ? "Cancel" : "Add Video"}
        </Button>
      </header>

      {adding && (
        <div className="border border-primary/40 p-6 mb-8 bg-card space-y-4">
          <p className="eyebrow text-primary">New video</p>
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

          <div className="space-y-2">
            <label className="eyebrow text-cream/60 text-[10px]">Video file</label>
            <div className="flex items-center gap-4 flex-wrap">
              <MediaUploader
                accept="video/*"
                onUploaded={(url) => setDraft({ ...draft, media_url: url })}
                label="Upload video"
              />
              <span className="text-cream/40 text-xs">or paste URL:</span>
              <input
                placeholder="https://... (mp4 or hosted video URL)"
                value={draft.media_url}
                onChange={(e) => setDraft({ ...draft, media_url: e.target.value })}
                className="flex-1 min-w-[240px] bg-input border border-border focus:border-primary outline-none px-3 py-2 text-cream text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="eyebrow text-cream/60 text-[10px]">Thumbnail image (optional)</label>
            <div className="flex items-center gap-4 flex-wrap">
              <MediaUploader
                accept="image/*"
                onUploaded={(url) => setDraft({ ...draft, thumbnail_url: url })}
                label="Upload thumbnail"
              />
              <input
                placeholder="https://... thumbnail URL"
                value={draft.thumbnail_url}
                onChange={(e) => setDraft({ ...draft, thumbnail_url: e.target.value })}
                className="flex-1 min-w-[240px] bg-input border border-border focus:border-primary outline-none px-3 py-2 text-cream text-sm"
              />
            </div>
          </div>

          {draft.media_url && (
            <div className="aspect-video w-full max-w-md bg-noir">
              <video src={draft.media_url} controls className="w-full h-full object-cover" poster={draft.thumbnail_url || undefined} />
            </div>
          )}
          <Button variant="gold" onClick={create}>
            <Save size={14} /> Save video
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.id} className="border border-border bg-card group">
            <div className="aspect-video overflow-hidden bg-noir relative">
              <video
                src={item.media_url}
                poster={item.thumbnail_url ?? undefined}
                controls
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => update(item.id, { is_featured: !item.is_featured })}
                className={`absolute top-2 right-2 p-2 bg-noir/70 ${item.is_featured ? "text-primary" : "text-cream/60 hover:text-primary"}`}
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
          <p className="col-span-full text-center text-cream/50 py-12 italic font-display">No videos yet. Click "Add Video" to upload your first reel.</p>
        )}
      </div>
    </div>
  );
};
