import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type Category, useEco } from "@/lib/ecosphere-store";
import { toast } from "sonner";

export const Route = createFileRoute("/items/add")({
  head: () => ({ meta: [{ title: "Add product — EcoSphere" }, { name: "robots", content: "noindex" }] }),
  component: AddItem,
});

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
  shortDescription: z.string().trim().min(10, "Add a short description (10+ chars)").max(160),
  fullDescription: z.string().trim().min(30, "Full description must be at least 30 characters").max(2000),
  price: z.number().positive("Price must be greater than 0").max(100000),
  category: z.string().min(1, "Pick a category"),
  image: z.string().trim().url("Enter a valid image URL"),
});

function AddItem() {
  const { user, addProduct } = useEco();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      toast.error("Please sign in to add a product");
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    category: "" as Category | "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, price: parseFloat(form.price) });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    const p = addProduct({
      title: parsed.data.title,
      shortDescription: parsed.data.shortDescription,
      fullDescription: parsed.data.fullDescription,
      price: parsed.data.price,
      category: parsed.data.category as Category,
      image: parsed.data.image,
    });
    toast.success("Product listed on EcoSphere");
    navigate({ to: "/items/$id", params: { id: p.id } });
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">List a product</div>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Add a new eco-friendly product</h1>
      <p className="mt-2 text-sm text-muted-foreground">Fill in every field so shoppers know exactly what they're buying and why it's sustainable.</p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border bg-card p-6 shadow-soft md:p-8">
        <Field label="Product title" error={errors.title}>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Bamboo Bluetooth Speaker" maxLength={100} className="rounded-xl" />
        </Field>

        <Field label="Short description" hint="Shown on cards — keep it under 160 characters." error={errors.shortDescription}>
          <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} maxLength={160} className="rounded-xl" />
        </Field>

        <Field label="Full description" hint="Cover materials, sourcing, and what makes it sustainable." error={errors.fullDescription}>
          <Textarea value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} rows={5} maxLength={2000} className="rounded-xl" />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Price (USD)" error={errors.price}>
            <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl" />
          </Field>
          <Field label="Category" error={errors.category}>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose a category" /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Image URL" hint="Use a square image ~800px wide." error={errors.image}>
          <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" className="rounded-xl" />
        </Field>

        {form.image && (
          <div className="overflow-hidden rounded-xl border">
            <img src={form.image} alt="Preview" className="h-56 w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" size="lg" className="rounded-xl"><Plus className="mr-1.5 size-4" />Publish product</Button>
          <Button type="button" size="lg" variant="outline" className="rounded-xl" onClick={() => navigate({ to: "/items/manage" })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
