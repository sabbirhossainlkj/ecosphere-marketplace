import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEco } from "@/lib/ecosphere-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LOGGED_OUT = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const LOGGED_IN = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/items/add", label: "Add Item" },
  { to: "/items/manage", label: "Manage Items" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { user, logout } = useEco();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const links = user ? LOGGED_IN : LOGGED_OUT;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Leaf className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">EcoSphere</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link key={l.to} to={l.to}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5">
                <UserIcon className="size-4 text-primary" />
                <span className="text-xs font-medium">{user.name}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={handleLogout}><LogOut className="mr-1.5 size-4" />Sign out</Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost"><Link to="/login">Log in</Link></Button>
              <Button asChild size="sm"><Link to="/register">Sign up</Link></Button>
            </>
          )}
        </div>

        <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 hover:bg-muted md:hidden" aria-label="Toggle menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <nav className="flex flex-col gap-1">
              {links.map((l) => {
                const active = pathname === l.to;
                return (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}>
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 flex gap-2 border-t pt-3">
              {user ? (
                <Button className="flex-1" variant="outline" onClick={() => { handleLogout(); setOpen(false); }}>Sign out</Button>
              ) : (
                <>
                  <Button asChild className="flex-1" variant="outline"><Link to="/login" onClick={() => setOpen(false)}>Log in</Link></Button>
                  <Button asChild className="flex-1"><Link to="/register" onClick={() => setOpen(false)}>Sign up</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
