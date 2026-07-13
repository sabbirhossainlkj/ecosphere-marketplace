import { Link } from "@tanstack/react-router";
import { Leaf, Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Enter a valid email"); return; }
    toast.success("You're subscribed to the EcoSphere newsletter");
    setEmail("");
  };

  return (
    <footer className="mt-20 border-t bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="size-5" /></span>
              <span className="font-display text-lg font-bold">EcoSphere</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">The marketplace for products that leave the planet better than they found it.</p>
            <div className="mt-4 flex gap-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid size-9 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:border-primary hover:text-primary" aria-label="Social link">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/explore" className="hover:text-primary">All products</Link></li>
              <li><Link to="/about" className="hover:text-primary">About us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold">Get in touch</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="size-4 text-primary" /> hello@ecosphere.app</li>
              <li className="flex items-center gap-2"><Phone className="size-4 text-primary" /> +1 (415) 555-0182</li>
              <li className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> 240 Green St, Portland OR</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold">Join the newsletter</h4>
            <p className="mt-3 text-sm text-muted-foreground">One email a month. New drops, impact updates, no spam.</p>
            <form onSubmit={subscribe} className="mt-3 flex gap-2">
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
              <Button type="submit" className="rounded-xl">Join</Button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} EcoSphere. Grown, not manufactured.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Impact report</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
