import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Leaf, Recycle, Sun, Sprout, Truck, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoSphere — Sustainable products, delivered kindly" },
      { name: "description", content: "Shop bamboo tech, solar gadgets, zero-waste essentials and organic apparel from vetted brands. Free shipping on orders over $50." },
      { property: "og:title", content: "EcoSphere — Sustainable products, delivered kindly" },
      { property: "og:description", content: "Bamboo tech, solar gadgets, zero-waste living, and organic apparel from vetted brands." },
    ],
  }),
  component: Landing,
});

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=70",
    tag: "New drop",
    title: "Solar gadgets that never need the wall",
    subtitle: "Foldable panels, lanterns, and chargers designed for the outdoors.",
  },
  {
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=70",
    tag: "Best sellers",
    title: "Zero-waste starter kits",
    subtitle: "Everything you need to cut single-use plastic out of your kitchen.",
  },
  {
    image: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=1600&q=70",
    tag: "Craft",
    title: "Bamboo tech, hand-finished",
    subtitle: "Repairable devices sculpted from sustainably-harvested bamboo.",
  },
];

const CATEGORIES = [
  { name: "Bamboo Tech", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=70", count: 18 },
  { name: "Solar Gadgets", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=70", count: 24 },
  { name: "Zero-Waste Living", image: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=70", count: 46 },
  { name: "Organic Apparel", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=70", count: 32 },
];

const VALUES = [
  { icon: Recycle, title: "Recycled packaging", body: "Every order ships in 100% post-consumer paper. No plastic, no tape, ever." },
  { icon: Sprout, title: "Organic materials", body: "GOTS-certified fabrics, FSC-certified bamboo, and food-safe finishes." },
  { icon: Sun, title: "Renewable-first", body: "Our warehouse runs on 100% wind and rooftop solar. Even the coffee machine." },
  { icon: ShieldCheck, title: "Vetted brands", body: "Every seller passes a 32-point audit before their first listing goes live." },
];

const IMPACT = [
  { value: "4.2M", label: "Plastic items diverted" },
  { value: "180k", label: "Trees planted with sales" },
  { value: "92%", label: "Orders shipped carbon-neutral" },
  { value: "18k", label: "Verified sustainable products" },
];

const TESTIMONIALS = [
  { name: "Maya R.", role: "Verified customer", rating: 5, body: "The bamboo speaker is beautiful and the sound is warmer than my old plastic one. Packaging arrived spotless — no bubble wrap in sight." },
  { name: "Elias K.", role: "Verified customer", rating: 5, body: "I've replaced almost my whole kitchen with EcoSphere finds. The beeswax wraps alone have paid for themselves twice over." },
  { name: "Priya D.", role: "Verified customer", rating: 4, body: "Love that every product shows its eco-score. It's helping me shop with more intent instead of just scrolling." },
];

const BLOGS = [
  { title: "The real math behind carbon-neutral shipping", excerpt: "We break down what 'offset' actually means, why cheap offsets are a red flag, and how we vet ours.", author: "Nia Okoro", date: "Jul 8, 2026", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=70" },
  { title: "Bamboo vs. plastic: a 12-month teardown", excerpt: "We buried both in an active compost pile. Here's what came out — and what we learned about biodegradability claims.", author: "Theo Marsh", date: "Jun 22, 2026", image: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=900&q=70" },
  { title: "The zero-waste starter kit that actually sticks", excerpt: "The one habit change most people miss when they try to go zero-waste, and the three products that make it painless.", author: "Sana Weiss", date: "Jun 4, 2026", image: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=900&q=70" },
];

const FAQ = [
  { q: "How do you verify a product is genuinely sustainable?", a: "Every seller submits a full materials and supply chain disclosure. We audit against a 32-point checklist covering sourcing, labor, packaging, and end-of-life. Sellers must re-verify annually." },
  { q: "What is the eco-score on every product?", a: "It's a 1-to-5 rating combining materials, manufacturing energy, packaging, and repairability. Products under 3 aren't allowed on the marketplace." },
  { q: "Is shipping really carbon-neutral?", a: "We ship 92% of orders using electric last-mile delivery. The remaining 8% is offset through verified reforestation projects, and we publish the ledger every quarter." },
  { q: "What's your return policy?", a: "60 days, no questions. Returns come back in the same recycled mailer they arrived in — reversible label included." },
];

function Landing() {
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Enter a valid email"); return; }
    toast.success("Welcome to EcoSphere — check your inbox");
    setEmail("");
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ height: "65vh", minHeight: 520 }}>
        {SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}>
            <img src={s.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
          </div>
        ))}

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Leaf className="size-3.5" /> {SLIDES[slide].tag}
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {SLIDES[slide].title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">{SLIDES[slide].subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/explore">Shop now <ArrowRight className="ml-1.5 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link to="/about">Our mission</Link>
              </Button>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${i === slide ? "w-8 bg-primary" : "w-2 bg-primary/30"}`}
                aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">What makes us different</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Sustainability isn't a label — it's a checklist.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border bg-card p-6 shadow-soft transition hover:shadow-card">
              <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-surface-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Top categories</div>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Start where you're curious.</h2>
            </div>
            <Button asChild variant="ghost" className="rounded-xl"><Link to="/explore">Browse everything <ArrowRight className="ml-1 size-4" /></Link></Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.name} to="/explore" search={{ category: c.name }}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl border shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="text-xs opacity-80">{c.count} products</div>
                  <div className="mt-0.5 font-display text-lg font-semibold">{c.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="rounded-2xl border bg-primary p-10 text-primary-foreground md:p-14">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Our impact so far</div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Small choices. Measurable outcomes.</h2>
            <p className="mt-3 opacity-90">Every purchase on EcoSphere is tracked against verified impact metrics. Here's what our community has accomplished together.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl font-extrabold sm:text-5xl">{s.value}</div>
                <div className="mt-1 text-sm opacity-85">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Loved by 240,000+ customers</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">The reviews we're most proud of.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-xl border bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-4 ${i < t.rating ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed">"{t.body}"</p>
              <div className="mt-5 border-t pt-3">
                <div className="font-display text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOGS */}
      <section className="bg-surface-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">From the journal</div>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Latest eco reads.</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BLOGS.map((b) => (
              <article key={b.title} className="overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={b.image} alt={b.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="text-xs text-muted-foreground">{b.author} · {b.date}</div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-tight">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.excerpt}</p>
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">Read article <ArrowRight className="size-4" /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Questions, answered</div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Frequently asked.</h2>
            <Accordion type="single" collapsible className="mt-6">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`i-${i}`} className="rounded-xl border bg-card px-4 mb-2">
                  <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-10">
            <Truck className="size-8 text-primary" />
            <h3 className="mt-4 font-display text-2xl font-bold">One thoughtful email a month.</h3>
            <p className="mt-2 text-sm text-muted-foreground">New drops, behind-the-scenes brand stories, and impact updates. No spam, unsubscribe in one click.</p>
            <form onSubmit={subscribe} className="mt-6 flex gap-2">
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl bg-background" />
              <Button type="submit" className="rounded-xl">Subscribe</Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">By subscribing you agree to our privacy policy.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
