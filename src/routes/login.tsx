import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Leaf, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEco } from "@/lib/ecosphere-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — EcoSphere" }, { name: "description", content: "Log in to your EcoSphere account." }] }),
  component: Login,
});

function Login() {
  const { login, demoLogin } = useEco();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) { toast.error(res.message ?? "Login failed"); return; }
    toast.success("Welcome back to EcoSphere");
    navigate({ to: "/explore" });
  };

  const asDemo = (role: "user" | "admin") => {
    demoLogin(role);
    toast.success(`Signed in as demo ${role}`);
    navigate({ to: role === "admin" ? "/items/manage" : "/explore" });
  };

  const social = (name: string) => toast(`${name} login is disabled in demo mode`);

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-20">
      <div className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="size-5" /></span>
          <span className="font-display text-lg font-bold">EcoSphere</span>
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to shop or manage your listings.</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => asDemo("user")}>
            <UserIcon className="mr-1.5 size-4" />Demo User
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => asDemo("admin")}>
            <ShieldCheck className="mr-1.5 size-4" />Demo Admin
          </Button>
        </div>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or sign in with email <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">Password</Label>
            <div className="relative">
              <Input id="pw" type={show ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl pr-10" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Toggle password visibility">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full rounded-xl">Log in</Button>
        </form>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => social("Google")}>Continue with Google</Button>
          <Button variant="outline" className="rounded-xl" onClick={() => social("Facebook")}>Continue with Facebook</Button>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          New to EcoSphere? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
