import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion ইমপোর্ট করা হয়েছে
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

// মোবাইল ড্রপডাউন অ্যানিমেশন ভ্যারিয়েন্টস
const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: { 
      height: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { 
      height: { duration: 0.25 },
      opacity: { duration: 0.15 }
    }
  }
};

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
        
        {/* Brand Logo with Rotate Hover */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow transition-transform duration-300 group-hover:rotate-12"
          >
            <Leaf className="size-5" />
          </motion.span>
          <span className="font-display text-lg font-bold tracking-tight">EcoSphere</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link 
                key={l.to} 
                to={l.to}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active link এর জন্য স্লাইডিং ব্যাকগ্রাউন্ড বাবল */}
                {active && (
                  <motion.span
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 z-[-1] rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5">
                <UserIcon className="size-4 text-primary" />
                <span className="text-xs font-medium">{user.name}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-1.5 size-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon with Spin Animation */}
        <motion.button 
          onClick={() => setOpen((v) => !v)} 
          whileTap={{ scale: 0.9 }}
          className="rounded-lg p-2 hover:bg-muted md:hidden" 
          aria-label="Toggle menu"
        >
          <motion.div
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Menu Box with Slide-down / AnimatePresence */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border-t bg-background/95 backdrop-blur-md md:hidden overflow-hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-3">
              <nav className="flex flex-col gap-1">
                {links.map((l) => {
                  const active = pathname === l.to;
                  return (
                    <Link 
                      key={l.to} 
                      to={l.to} 
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-3 flex gap-2 border-t pt-3">
                {user ? (
                  <Button 
                    className="flex-1" 
                    variant="outline" 
                    onClick={() => { handleLogout(); setOpen(false); }}
                  >
                    Sign out
                  </Button>
                ) : (
                  <>
                    <Button asChild className="flex-1" variant="outline">
                      <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/register" onClick={() => setOpen(false)}>Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}