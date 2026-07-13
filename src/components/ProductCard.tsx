import { Link } from "@tanstack/react-router";
import { Star, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/ecosphere-store";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={product.image} alt={product.title} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary/95 px-2 py-1 text-[11px] font-semibold text-primary-foreground shadow">
          <Leaf className="size-3" /> Eco {product.ecoScore}/5
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent/95 px-2 py-1 text-[11px] font-semibold text-accent-foreground shadow">
          <Star className="size-3 fill-current" /> {product.rating.toFixed(1)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{product.category}</div>
        <h3 className="mt-1 font-display text-base font-semibold leading-tight line-clamp-1">{product.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-display text-lg font-bold text-primary">${product.price}</div>
          <Button asChild size="sm" className="rounded-lg">
            <Link to="/items/$id" params={{ id: product.id }}>View details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="mt-2 flex items-center justify-between">
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
