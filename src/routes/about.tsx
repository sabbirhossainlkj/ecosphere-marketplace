import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Sprout, Users, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EcoSphere — Our mission" },
      { name: "description", content: "EcoSphere is a marketplace for products that leave the planet better. Meet the team behind it and the values that guide every listing." },
      { property: "og:title", content: "About EcoSphere — Our mission" },
      { property: "og:description", content: "The people and values behind the marketplace for sustainable products." },
    ],
  }),
  component: About,
});

const TEAM = [
  { name: "Ayana Kim", role: "Founder & CEO", bio: "Ex-textile-engineer, spent a decade auditing supply chains before starting EcoSphere.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=70" },
  { name: "Daniel Rowe", role: "Head of Product", bio: "Believes the best sustainability tool is a well-designed interface that makes shopping thoughtfully feel effortless.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=70" },
  { name: "Sana Weiss", role: "Impact Lead", bio: "Runs our 32-point audit process and publishes our quarterly public impact ledger.", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=70" },
  { name: "Theo Marsh", role: "Head of Engineering", bio: "Builds the platform on renewable-powered infrastructure. Cyclist. Compost enthusiast.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=70" },
];

function About() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-24">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">Our mission</div>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Make sustainable the easy choice.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          EcoSphere exists because thoughtful shopping should never require a spreadsheet. We vet every brand, publish every impact number, and reject anything that doesn't materially reduce harm.
        </p>
      </section>

      <section className="bg-surface-muted py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Leaf, title: "Materials-first", body: "If it's not made from something we can trace back to a farm, forest, or recycled stream, it doesn't list." },
              { icon: Sprout, title: "Repair, not replace", body: "We prioritize brands whose products can be repaired instead of thrown out." },
              { icon: Users, title: "Fair labor", body: "Every factory in our supply chain is audited annually against ILO standards." },
              { icon: Globe, title: "Transparent impact", body: "Our quarterly impact ledger is public. Every claim, every number, published." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border bg-card p-6 shadow-soft">
                <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
                <h3 className="mt-4 font-display font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">The team</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">People who read every audit report.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((t) => (
            <div key={t.name} className="overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="font-display font-semibold">{t.name}</div>
                <div className="text-xs text-primary">{t.role}</div>
                <p className="mt-2 text-sm text-muted-foreground">{t.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
