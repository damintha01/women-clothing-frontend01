"use client";
import { useState } from "react";
import Link from "next/link";
import { LKR } from "@/lib/shop-data";
import { useAdminProducts } from "@/lib/admin/use-admin-products";

export default function AdminProductsPage() {
  const { products, isLoading, mutatingId, removeProduct } = useAdminProducts();
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground">
          + New Product
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products…"
        className="mt-6 w-full max-w-sm border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
      />

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : (
        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="pb-2">Name</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Stock</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="py-3">
                  <Link href={`/admin/products/${p.id}`} className="hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="py-3">{LKR(p.price)}</td>
                <td className="py-3">{p.inStock ? "In stock" : "Out of stock"}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => removeProduct(p.id)}
                    disabled={mutatingId === p.id}
                    className="text-xs text-destructive"
                  >
                    {mutatingId === p.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
