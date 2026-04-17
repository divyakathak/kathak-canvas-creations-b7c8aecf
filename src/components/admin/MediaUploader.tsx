import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MediaUploaderProps {
  onUploaded: (publicUrl: string, mediaType: "image" | "video") => void;
  accept?: string;
  label?: string;
}

/**
 * Uploads a file to the 'media' bucket and returns the public URL.
 * Files are stored under {userId}/{timestamp}-{filename} for organization.
 */
export const MediaUploader = ({ onUploaded, accept = "image/*,video/*", label = "Upload media" }: MediaUploaderProps) => {
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const onFile = async (file: File) => {
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id ?? "anon";
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      const mediaType: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
      onUploaded(pub.publicUrl, mediaType);
      toast({ title: "Uploaded", description: file.name });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary/40 text-primary hover:bg-primary hover:text-noir cursor-pointer transition-all eyebrow text-[10px]">
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
      {busy ? "Uploading..." : label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
};
