import { useEffect, useMemo, useState, type ReactNode } from "react";
import { EcoContext, type Product, type Review, type User } from "./ecosphere-store";
import { SEED_PRODUCTS, SEED_REVIEWS } from "./ecosphere-data";

const STORAGE_KEY = "ecosphere-state-v1";

interface Persisted {
  user: User | null;
  products: Product[];
  reviews: Review[];
}

const DEMO_USER: User = { id: "demo-user", name: "Alex Green", email: "user@demo.app", role: "user" };
const DEMO_ADMIN: User = { id: "demo-admin", name: "Sam Admin", email: "admin@demo.app", role: "admin" };

function loadInitial(): Persisted {
  if (typeof window === "undefined") {
    return { user: null, products: SEED_PRODUCTS, reviews: SEED_REVIEWS };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Persisted;
      return {
        user: parsed.user ?? null,
        products: parsed.products?.length ? parsed.products : SEED_PRODUCTS,
        reviews: parsed.reviews?.length ? parsed.reviews : SEED_REVIEWS,
      };
    }
  } catch { /* ignore */ }
  return { user: null, products: SEED_PRODUCTS, reviews: SEED_REVIEWS };
}

export function EcoProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<Persisted>({ user: null, products: SEED_PRODUCTS, reviews: SEED_REVIEWS });

  useEffect(() => {
    setState(loadInitial());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state, hydrated]);

  const value = useMemo(() => ({
    user: state.user,
    products: state.products,
    reviews: state.reviews,
    login: (email: string, password: string) => {
      if (!email || !password) return { ok: false, message: "Enter email and password" };
      const name = email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim() || "Friend";
      const user: User = { id: `u-${email}`, name: name.charAt(0).toUpperCase() + name.slice(1), email, role: "user" };
      setState((s) => ({ ...s, user }));
      return { ok: true };
    },
    register: (name: string, email: string, password: string) => {
      if (!name || !email || !password) return { ok: false, message: "All fields are required" };
      if (password.length < 6) return { ok: false, message: "Password must be at least 6 characters" };
      const user: User = { id: `u-${email}`, name, email, role: "user" };
      setState((s) => ({ ...s, user }));
      return { ok: true };
    },
    demoLogin: (role: "user" | "admin") => {
      setState((s) => ({ ...s, user: role === "admin" ? DEMO_ADMIN : DEMO_USER }));
    },
    logout: () => setState((s) => ({ ...s, user: null })),
    addProduct: (input: Omit<Product, "id" | "ownerId" | "rating" | "reviewsCount" | "ecoScore"> & { ecoScore?: number }) => {
      const product: Product = {
        ...input,
        id: `p-${Date.now()}`,
        ownerId: state.user?.id ?? "guest",
        rating: 0,
        reviewsCount: 0,
        ecoScore: input.ecoScore ?? 4,
      };
      setState((s) => ({ ...s, products: [product, ...s.products] }));
      return product;
    },
    deleteProduct: (id: string) => {
      setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
    },
    myProducts: () => state.products.filter((p) => p.ownerId === state.user?.id),
  }), [state]);

  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>;
}
