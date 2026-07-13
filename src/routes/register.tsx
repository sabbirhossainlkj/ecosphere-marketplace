import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEco } from "@/lib/ecosphere-store";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create an account — EcoSphere" }, { name: "description", content: "Create your free EcoSphere account." }] }),
  component: Register,
});

function Register() {
  const { register, demoLogin } = useEco();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    const res = register(form.name.trim(), form.email.trim(), form.password);
    if (!res.ok) { toast.error(res.message ?? "Signup failed"); return; }
    toast.success("Account created — welcome to EcoSphere");
    navigate({ to: "/explore" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-20">
      <div className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="size-5" /></span>
          <span className="font-display text-lg font-bold">EcoSphere</span>
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Free forever. No spam, no ads.</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => { demoLogin("user"); navigate({ to: "/explore" }); }}>Demo User</Button>
          <Button variant="outline" className="rounded-xl" onClick={() => { demoLogin("admin"); navigate({ to: "/items/manage" }); }}>Demo Admin</Button>
        </div>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or sign up with email <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">Password (min. 6)</Label>
            <div className="relative">
              <Input id="pw" type={show ? "text" : "password"} required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-xl pr-10" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Toggle password visibility">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw2">Confirm password</Label>
            <Input id="pw2" type={show ? "text" : "password"} required minLength={6} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="rounded-xl" />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-xl">Create account</Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
