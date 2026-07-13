import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Trash2, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEco } from "@/lib/ecosphere-store";
import { toast } from "sonner";

export const Route = createFileRoute("/items/manage")({
  head: () => ({ meta: [{ title: "Manage products — EcoSphere" }, { name: "robots", content: "noindex" }] }),
  component: ManageItems,
});

function ManageItems() {
  const { user, myProducts, deleteProduct } = useEco();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      toast.error("Please sign in to manage products");
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  if (!user) return null;
  const items = myProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Your listings</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Manage products</h1>
          <p className="mt-2 text-sm text-muted-foreground">Everything you've listed on EcoSphere lives here.</p>
        </div>
        <Button asChild className="rounded-xl"><Link to="/items/add"><Plus className="mr-1.5 size-4" />Add product</Link></Button>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed bg-card p-12 text-center">
          <Package className="mx-auto size-10 text-primary" />
          <h2 className="mt-4 font-display text-xl font-semibold">No products yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Publish your first sustainable product — it takes about a minute.</p>
          <Button asChild className="mt-5 rounded-xl"><Link to="/items/add">Add your first product</Link></Button>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-display font-semibold">{p.title}</div>
                        <div className="truncate text-xs text-muted-foreground md:hidden">{p.category} · ${p.price}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="hidden sm:table-cell font-semibold text-primary">${p.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button asChild size="sm" variant="outline" className="rounded-lg">
                        <Link to="/items/$id" params={{ id: p.id }}><Eye className="size-4 sm:mr-1.5" /><span className="hidden sm:inline">View</span></Link>
                      </Button>
                      <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => setPendingDelete({ id: p.id, title: p.title })}>
                        <Trash2 className="size-4 sm:mr-1.5" /><span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pendingDelete?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the listing from EcoSphere. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (pendingDelete) { deleteProduct(pendingDelete.id); toast.success("Product deleted"); setPendingDelete(null); }
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
