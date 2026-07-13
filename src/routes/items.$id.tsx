import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Leaf, Star, ShieldCheck, Truck, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ProductCard } from "@/components/ProductCard";
import { useEco } from "@/lib/ecosphere-store";
import { toast } from "sonner";

export const Route = createFileRoute("/items/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product · EcoSphere` },
      { name: "description", content: `Details for product ${params.id} on EcoSphere.` },
    ],
  }),
  component: ItemDetails,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <p className="mt-2 text-muted-foreground">This item may have been removed.</p>
      <Button asChild className="mt-6 rounded-xl"><Link to="/explore">Back to explore</Link></Button>
    </div>
  ),
});

function ItemDetails() {
  const { id } = Route.useParams();
  const { products, reviews } = useEco();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [active, setActive] = useState(0);

  if (!product) throw notFound();

  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image, product.image, product.image];
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <Button variant="ghost" size="sm" className="mb-6 rounded-xl" onClick={() => navigate({ to: "/explore" })}>
        <ArrowLeft className="mr-1.5 size-4" /> Back to explore
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
            <img src={gallery[active]} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {gallery.map((src, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden rounded-xl border transition ${i === active ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">{product.category}</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{product.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`size-4 ${i < Math.round(product.rating) ? "fill-current" : "opacity-30"}`} />
              ))}
              <span className="ml-1 text-sm font-medium text-foreground">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({product.reviewsCount} reviews)</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <Leaf className="size-3.5" /> Eco-score {product.ecoScore}/5
            </span>
          </div>

          <div className="mt-6 font-display text-4xl font-extrabold text-primary">${product.price}</div>

          <div className="mt-6 rounded-xl border bg-card p-5 shadow-soft">
            <h2 className="font-display text-base font-semibold">Product overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.fullDescription}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button size="lg" className="flex-1 rounded-xl" onClick={() => toast.success(`Added ${product.title} to cart`)}>Add to cart</Button>
            <Button size="lg" variant="outline" className="rounded-xl" onClick={() => toast("Saved to wishlist")}>♡ Save</Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, label: "Free shipping over $50" },
              { icon: ShieldCheck, label: "60-day returns" },
              { icon: Recycle, label: "Zero-plastic packaging" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border bg-card p-3 text-xs text-muted-foreground">
                <Icon className="size-4 text-primary" /> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs */}
      {product.specs && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Specifications</h2>
          <div className="mt-4 overflow-hidden rounded-xl border bg-card shadow-soft">
            <Table>
              <TableBody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <TableRow key={k}>
                    <TableCell className="w-1/3 bg-surface-muted font-medium">{k}</TableCell>
                    <TableCell className="text-muted-foreground">{v}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Customer reviews</h2>
        {productReviews.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
            No reviews yet — be the first to share your experience.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {productReviews.map((r) => (
              <div key={r.id} className="rounded-xl border bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="font-display font-semibold">{r.author}</div>
                  <div className="flex text-accent">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-4 ${i < r.rating ? "fill-current" : "opacity-30"}`} />)}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">"{r.comment}"</p>
                <div className="mt-3 text-xs text-muted-foreground">{r.date}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Related items</h2>
          <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {related.map((p) => (
              <div key={p.id} className="w-72 shrink-0 snap-start"><ProductCard product={p} /></div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
