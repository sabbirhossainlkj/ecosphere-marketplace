import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { useEco } from "@/lib/ecosphere-store";
import { CATEGORIES, type Category } from "@/lib/ecosphere-store";

interface ExploreSearch { category?: string; q?: string; page?: number; }

export const Route = createFileRoute("/explore")({
  validateSearch: (s: Record<string, unknown>): ExploreSearch => ({
    category: typeof s.category === "string" ? s.category : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    page: typeof s.page === "number" ? s.page : 1,
  }),
  head: () => ({
    meta: [
      { title: "Explore — EcoSphere" },
      { name: "description", content: "Browse every product on EcoSphere. Filter by category and price, sort by value or rating." },
    ],
  }),
  component: Explore,
});

const PRICE_RANGES = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 – $75", min: 25, max: 75 },
  { label: "$75 – $150", min: 75, max: 150 },
  { label: "$150+", min: 150, max: Infinity },
];

const PER_PAGE = 8;

function Explore() {
  const { products } = useEco();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(search.q ?? "");
  const [category, setCategory] = useState<string>(search.category ?? "all");
  const [priceIdx, setPriceIdx] = useState("0");
  const [sort, setSort] = useState<"featured" | "asc" | "desc" | "rating">("featured");
  const [page, setPage] = useState(search.page ?? 1);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      navigate({ search: { q: query || undefined, category: category !== "all" ? category : undefined, page } as ExploreSearch, replace: true });
    }, 200);
    return () => clearTimeout(id);
  }, [query, category, page, navigate]);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[Number(priceIdx)];
    let list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (p.price < range.min || p.price > range.max) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.shortDescription.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, priceIdx, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const reset = () => { setQuery(""); setCategory("all"); setPriceIdx("0"); setSort("featured"); setPage(1); };
  const hasFilters = query || category !== "all" || priceIdx !== "0" || sort !== "featured";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Explore</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">All eco-friendly products</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">Every product is vetted against 32 sustainability criteria. Filter freely — we've done the homework for you.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-display text-lg font-bold text-foreground">{filtered.length}</span> products
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-xl border bg-card p-4 shadow-soft md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search bamboo, solar, wraps…" className="rounded-xl pl-9" />
          </div>
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="w-full rounded-xl md:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c: Category) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priceIdx} onValueChange={(v) => { setPriceIdx(v); setPage(1); }}>
            <SelectTrigger className="w-full rounded-xl md:w-40"><SelectValue placeholder="Price" /></SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((r, i) => <SelectItem key={i} value={String(i)}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-full rounded-xl md:w-48"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters ? (
            <Button variant="outline" onClick={reset} className="rounded-xl"><X className="mr-1.5 size-4" />Clear</Button>
          ) : (
            <div className="hidden items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground md:flex md:px-4"><SlidersHorizontal className="mr-1.5 size-3.5" />Filters</div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : paged.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {!loading && paged.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed bg-card p-10 text-center">
          <div className="font-display text-lg font-semibold">No products match</div>
          <p className="mt-1 text-sm text-muted-foreground">Try clearing filters or exploring another category.</p>
          <Button className="mt-4 rounded-xl" onClick={reset}>Reset filters</Button>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <Button variant="outline" className="rounded-xl" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} size="icon" className="rounded-xl" onClick={() => setPage(i + 1)}>{i + 1}</Button>
          ))}
          <Button variant="outline" className="rounded-xl" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</Button>
        </div>
      )}

      <div className="mt-16 rounded-2xl border bg-primary/5 p-8 text-center">
        <h2 className="font-display text-2xl font-bold">Selling something sustainable?</h2>
        <p className="mt-2 text-sm text-muted-foreground">List a product in under a minute. Free while EcoSphere is in beta.</p>
        <Button asChild className="mt-5 rounded-xl"><Link to="/items/add">Add your product</Link></Button>
      </div>
    </div>
  );
}
