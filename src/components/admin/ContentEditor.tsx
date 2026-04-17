import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ContentRow {
  id: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  data: Record<string, unknown> | null;
}

const SECTIONS: { id: string; label: string; description: string; arrayField?: string }[] = [
  { id: "hero", label: "Hero", description: "Title, subtitle, tagline, CTA. Shown at the top of the homepage." },
  { id: "about", label: "About", description: "Biography & list of recognitions.", arrayField: "achievements" },
  { id: "footer", label: "Footer", description: "Footer brand text + email and social links." },
];

export const ContentEditor = () => {
  const [rows, setRows] = useState<Record<string, ContentRow>>({});
  const [active, setActive] = useState("hero");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase.from("site_content").select("id,title,subtitle,body,data");
    if (data) {
      const map: Record<string, ContentRow> = {};
      data.forEach((r) => {
        map[r.id] = r as ContentRow;
      });
      // ensure all sections have a row
      SECTIONS.forEach((s) => {
        if (!map[s.id]) {
          map[s.id] = { id: s.id, title: "", subtitle: "", body: "", data: {} };
        }
      });
      setRows(map);
    }
  }

  const current = rows[active];
  const meta = SECTIONS.find((s) => s.id === active)!;

  const update = (patch: Partial<ContentRow>) => {
    setRows((r) => ({ ...r, [active]: { ...r[active], ...patch } }));
  };

  const updateData = (key: string, value: unknown) => {
    update({ data: { ...(current.data ?? {}), [key]: value } });
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert([{
      id: current.id,
      title: current.title,
      subtitle: current.subtitle,
      body: current.body,
      data: current.data ?? {},
    }]);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: `${meta.label} updated.` });
    }
  };

  if (!current) return <p className="text-cream/50">Loading...</p>;

  const data = (current.data ?? {}) as Record<string, unknown>;
  const arrayItems = (meta.arrayField ? (data[meta.arrayField] as string[] | undefined) ?? [] : []);

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-border">
        <h2 className="font-display text-3xl text-cream italic mb-1">Site Content</h2>
        <p className="text-cream/50 text-sm">Edit hero, about, and footer text. Changes are live immediately.</p>
      </header>

      {/* Section tabs */}
      <div className="flex gap-2 mb-8 border-b border-border/40">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`px-4 py-2 eyebrow text-[10px] border-b-2 -mb-px transition-colors ${
              active === s.id
                ? "border-primary text-primary"
                : "border-transparent text-cream/50 hover:text-cream"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-cream/50 text-sm mb-6 italic">{meta.description}</p>

      <div className="space-y-5">
        <Field label="Title" value={current.title ?? ""} onChange={(v) => update({ title: v })} />
        <Field label="Subtitle" value={current.subtitle ?? ""} onChange={(v) => update({ subtitle: v })} />
        <Field label="Body" value={current.body ?? ""} onChange={(v) => update({ body: v })} multiline />

        {active === "hero" && (
          <div className="grid grid-cols-2 gap-5">
            <Field
              label="CTA Label"
              value={(data.cta_label as string) ?? ""}
              onChange={(v) => updateData("cta_label", v)}
            />
            <Field
              label="CTA Link"
              value={(data.cta_link as string) ?? ""}
              onChange={(v) => updateData("cta_link", v)}
            />
          </div>
        )}

        {active === "about" && (
          <div>
            <label className="eyebrow text-cream/60 block mb-3">Recognitions / Achievements</label>
            <div className="space-y-2">
              {arrayItems.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => {
                      const next = [...arrayItems];
                      next[i] = e.target.value;
                      updateData("achievements", next);
                    }}
                    className="flex-1 bg-input border border-border focus:border-primary outline-none px-4 py-2.5 text-cream text-sm"
                  />
                  <button
                    onClick={() => updateData("achievements", arrayItems.filter((_, idx) => idx !== i))}
                    className="px-3 border border-border text-cream/50 hover:text-destructive hover:border-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateData("achievements", [...arrayItems, ""])}
                className="eyebrow text-[10px] flex items-center gap-2 text-primary hover:text-primary-glow mt-3"
              >
                <Plus size={14} /> Add achievement
              </button>
            </div>

            <div className="mt-5">
              <Field
                label="Image Caption"
                value={(data.image_caption as string) ?? ""}
                onChange={(v) => updateData("image_caption", v)}
              />
            </div>
          </div>
        )}

        {active === "footer" && (
          <div className="grid grid-cols-2 gap-5">
            <Field label="Email" value={(data.email as string) ?? ""} onChange={(v) => updateData("email", v)} />
            <Field label="Instagram URL" value={(data.instagram as string) ?? ""} onChange={(v) => updateData("instagram", v)} />
            <Field label="YouTube URL" value={(data.youtube as string) ?? ""} onChange={(v) => updateData("youtube", v)} />
            <Field label="Facebook URL" value={(data.facebook as string) ?? ""} onChange={(v) => updateData("facebook", v)} />
          </div>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-border">
        <Button variant="gold" onClick={save} disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) => (
  <div>
    <label className="eyebrow text-cream/60 block mb-2 text-[10px]">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full bg-input border border-border focus:border-primary outline-none px-4 py-3 text-cream text-sm resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-input border border-border focus:border-primary outline-none px-4 py-2.5 text-cream text-sm"
      />
    )}
  </div>
);
