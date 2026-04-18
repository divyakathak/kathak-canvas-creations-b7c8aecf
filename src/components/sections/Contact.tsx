import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  inquiry_type: z.enum(["contact", "booking"]),
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  venue: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Required").max(5000),
});

export const Contact = () => {
  const { toast } = useToast();
  const [type, setType] = useState<"contact" | "booking">("contact");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      inquiry_type: type,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      event_date: String(fd.get("event_date") ?? ""),
      venue: String(fd.get("venue") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      toast({
        title: "Please review the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const payload = {
      inquiry_type: parsed.data.inquiry_type,
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      phone: parsed.data.phone || undefined,
      subject: parsed.data.subject || undefined,
      venue: parsed.data.venue || undefined,
      event_date: parsed.data.event_date || undefined,
    };

    const { error } = await supabase.from("inquiries").insert([payload]);
    setSubmitting(false);

    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Message sent", description: "We'll be in touch shortly." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-32 md:py-44">
      <div className="container-elegant grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="lg:col-span-5"
        >
          <p className="eyebrow mb-6">
            <span className="gold-line mr-4" />
            Get in Touch
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-cream italic mb-6 text-balance">
            Bookings & Inquiries
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed text-pretty mb-10">
            For performances, workshops, festivals, and press — please use the form. Divya responds personally within two business days.
          </p>

          <div className="space-y-6 border-l border-primary/30 pl-6">
            <div>
              <p className="eyebrow text-cream/50 mb-1">Email</p>
              <p className="font-display text-xl text-primary">Divyabharadwaj020@gmail.com</p>
            </div>
            <div>
              <p className="eyebrow text-cream/50 mb-1">Phone</p>
              <p className="font-display text-xl text-cream">+91 98704 42949</p>
            </div>
            <div>
              <p className="eyebrow text-cream/50 mb-1">Studio</p>
              <p className="font-display text-xl text-cream">Narela, New Delhi, India</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-7"
        >
          {/* Type tabs */}
          <div className="flex gap-2 mb-8">
            {(["contact", "booking"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`eyebrow px-5 py-2.5 border transition-all duration-500 ${
                  type === t
                    ? "border-primary text-noir bg-primary"
                    : "border-border text-cream/60 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {t === "contact" ? "General" : "Performance Booking"}
              </button>
            ))}
          </div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-primary/40 p-12 text-center"
            >
              <p className="font-display text-3xl italic text-primary mb-3">Thank you.</p>
              <p className="text-cream/70">
                Your message has reached us. Divya will respond shortly.
              </p>
              <Button variant="ghost" onClick={() => setDone(false)} className="mt-6 text-primary">
                Send another
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Field name="name" label="Full Name *" required />
                <Field name="email" label="Email *" type="email" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <Field name="phone" label="Phone" />
                <Field name="subject" label={type === "booking" ? "Event Title" : "Subject"} />
              </div>

              {type === "booking" && (
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field name="event_date" label="Proposed Date" type="date" />
                  <Field name="venue" label="Venue / City" />
                </div>
              )}

              <div>
                <label className="eyebrow text-cream/60 block mb-3">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="w-full bg-input border border-border focus:border-primary outline-none px-4 py-3 text-cream font-sans text-base resize-none transition-colors"
                />
              </div>

              <Button type="submit" variant="gold" size="lg" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const Field = ({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label className="eyebrow text-cream/60 block mb-3">{label}</label>
    <input
      name={name}
      type={type}
      required={required}
      className="w-full bg-input border border-border focus:border-primary outline-none px-4 py-3 text-cream font-sans text-base transition-colors"
    />
  </div>
);
