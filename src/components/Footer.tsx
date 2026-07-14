import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";
import { 
  Leaf, Facebook, Instagram, Twitter, Youtube, 
  Mail, MapPin, Phone, LucideIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ১. স্ট্যাটিক ডাটা কম্পোনেন্টের বাইরে ডিফাইন করা হয়েছে (মেমরি অপ্টিমাইজেশন)
interface SocialLink {
  Icon: LucideIcon;
  href: string;
  label: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Youtube, href: "#", label: "Youtube" },
];

const EXPLORE_LINKS = [
  { label: "Home", to: "/" },
  { label: "All products", to: "/explore" },
  { label: "About us", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

const CONTACT_INFO = [
  { Icon: Mail, text: "hello@ecosphere.app" },
  { Icon: Phone, text: "+1 (415) 555-0182" },
  { Icon: MapPin, text: "240 Green St, Portland OR" },
] as const;

// ২. অ্যানিমেশন ভ্যারিয়েন্টস (বারবার রি-রেন্ডার হওয়া আটকাতে বাইরে রাখা হয়েছে)
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  },
};

const linkHoverTransition = { type: "spring", stiffness: 400, damping: 25 };

export function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { 
      toast.error("Enter a valid email"); 
      return; 
    }
    toast.success("You're subscribed to the EcoSphere newsletter");
    setEmail("");
  };

  return (
    <footer className="mt-20 border-t bg-surface-muted overflow-hidden">
      <motion.div 
        className="mx-auto max-w-7xl px-4 py-14 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }} // ভিউপোর্টে ১৫% আসলেই ট্র্রিগার হবে
        variants={containerVariants}
      >
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Column 1: Brand & Socials */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-12">
                <Leaf className="size-5" />
              </span>
              <span className="font-display text-lg font-bold">EcoSphere</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The marketplace for products that leave the planet better than they found it.
            </p>
            <div className="mt-1 flex gap-2">
              {SOCIAL_LINKS.map(({ Icon, href, label }, i) => (
                <motion.a 
                  key={label} 
                  href={href} 
                  whileHover={{ scale: 1.12, rotate: i % 2 === 0 ? 5 : -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="grid size-9 place-items-center rounded-lg border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary" 
                  aria-label={label}
                >
                  <Icon className="size-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Explore links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-sm font-semibold">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="inline-block">
                    <motion.span 
                      className="inline-block hover:text-primary cursor-pointer"
                      whileHover={{ x: 5 }} 
                      transition={linkHoverTransition}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-sm font-semibold">Get in touch</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {CONTACT_INFO.map(({ Icon, text }, idx) => (
                <li key={idx}>
                  <motion.span 
                    whileHover={{ x: 4 }} 
                    transition={linkHoverTransition}
                    className="flex items-center gap-2 cursor-pointer hover:text-primary w-fit"
                  >
                    <Icon className="size-4 text-primary shrink-0" /> 
                    {text}
                  </motion.span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-sm font-semibold">Join the newsletter</h4>
            <p className="mt-3 text-sm text-muted-foreground">One email a month. New drops, impact updates, no spam.</p>
            <form onSubmit={subscribe} className="mt-3 flex gap-2">
              <Input 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="rounded-xl focus-visible:ring-primary" 
              />
              <Button type="submit" className="rounded-xl active:scale-95 transition-transform shrink-0">
                Join
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div 
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row"
        >
          <div>© {new Date().getFullYear()} EcoSphere. Grown, not manufactured.</div>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Impact report"].map((policy) => (
              <a key={policy} href="#" className="hover:text-primary transition-colors">
                {policy}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}