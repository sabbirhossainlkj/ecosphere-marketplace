import { createContext, useContext } from "react";

export type Category = "Bamboo Tech" | "Solar Gadgets" | "Zero-Waste Living" | "Organic Apparel" | "Eco Home";

export const CATEGORIES: Category[] = [
  "Bamboo Tech",
  "Solar Gadgets",
  "Zero-Waste Living",
  "Organic Apparel",
  "Eco Home",
];

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: Category;
  image: string;
  gallery?: string[];
  ecoScore: number; // 1-5
  rating: number; // 0-5
  reviewsCount: number;
  ownerId: string; // "seed" or user id
  specs?: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface EcoState {
  user: User | null;
  products: Product[];
  reviews: Review[];
  login: (email: string, password: string) => { ok: boolean; message?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; message?: string };
  demoLogin: (role: "user" | "admin") => void;
  logout: () => void;
  addProduct: (p: Omit<Product, "id" | "ownerId" | "rating" | "reviewsCount" | "ecoScore"> & { ecoScore?: number }) => Product;
  deleteProduct: (id: string) => void;
  myProducts: () => Product[];
}

export const EcoContext = createContext<EcoState | null>(null);

export function useEco(): EcoState {
  const ctx = useContext(EcoContext);
  if (!ctx) throw new Error("useEco must be used within EcoProvider");
  return ctx;
}
