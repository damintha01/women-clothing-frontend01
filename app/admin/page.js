"use client";
import Link from "next/link";
import { LKR } from "@/lib/shop-data";
import { useDashboard } from "@/lib/admin/use-dashboard";

function StatTile({ label, value }) {
  return (
    <div className="border border-border bg-card p-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stats, lowStock, isLoading } = useDashboard();

  if (isLoading || !stats) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Orders" value={stats.totalOrders} />
        <StatTile label="Pending" value={stats.pendingOrders} />
        <StatTile label="Revenue" value={LKR(stats.totalRevenue)} />
        <StatTile label="Products" value={stats.totalProducts} />
        <StatTile label="Customers" value={stats.totalCustomers} />
        <StatTile label="Low Stock" value={stats.lowStockProducts} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border border-border bg-card p-6">
          <p className="mb-4 text-sm font-medium">Recent Orders</p>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders?highlight=${order.id}`}
                className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-b-0"
              >
                <span>{order.orderNumber}</span>
                <span className="text-muted-foreground">{order.status}</span>
                <span>{LKR(order.total)}</span>
              </Link>
            ))}
            {stats.recentOrders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
          </div>
        </div>

        <div className="border border-border bg-card p-6">
          <p className="mb-4 text-sm font-medium">Low Stock</p>
          <div className="space-y-3">
            {lowStock.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-b-0"
              >
                <span>{p.name}</span>
                <span className="text-destructive">Low stock</span>
              </Link>
            ))}
            {lowStock.length === 0 && <p className="text-sm text-muted-foreground">Nothing running low.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
