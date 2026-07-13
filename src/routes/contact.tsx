import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EcoSphere" },
      { name: "description", content: "Get in touch with the EcoSphere team — support, press, partnerships, or hello notes welcome." },
      { property: "og:title", content: "Contact EcoSphere" },
      { property: "og:description", content: "We reply within one business day." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  message: z.string().trim().min(10, "Message is too short").max(2000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path[0] as string] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    toast.success("Message sent — we'll reply within a business day");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Get in touch</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Say hello.</h1>
          <p className="mt-3 text-sm text-muted-foreground">Support questions, partnership pitches, or just a friendly note — everything lands in the same inbox and a real person reads it.</p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Mail className="size-5" /></span>
              <div><div className="font-display font-semibold">Email</div><div className="text-muted-foreground">hello@ecosphere.app</div></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Phone className="size-5" /></span>
              <div><div className="font-display font-semibold">Phone</div><div className="text-muted-foreground">+1 (415) 555-0182 · Mon-Fri 9-5 PT</div></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="size-5" /></span>
              <div><div className="font-display font-semibold">Studio</div><div className="text-muted-foreground">240 Green Street, Portland OR 97204</div></div>
            </li>
          </ul>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-card md:p-8">
          <div className="space-y-1.5">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} className="rounded-xl" />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cemail">Email</Label>
            <Input id="cemail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={160} className="rounded-xl" />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} className="rounded-xl" />
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          </div>
          <Button type="submit" size="lg" className="rounded-xl"><Send className="mr-1.5 size-4" />Send message</Button>
        </form>
      </div>
    </div>
  );
}
