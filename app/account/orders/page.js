"use client";
import Link from "next/link";
import { LKR } from "@/lib/shop-data";
import { useOrders } from "@/lib/account/use-orders";
import { Reveal } from "@/components/Reveal";

const CANCELLABLE = ["pending", "confirmed", "processing"];

export default function OrdersPage() {
  const { orders, isLoading, mutatingId, cancelOrder } = useOrders();

  if (isLoading) return <p className="eyebrow text-muted-foreground">Loading…</p>;

  if (orders.length === 0) {
    return (
      <Reveal>
        <p className="font-serif text-2xl text-muted-foreground">You haven&apos;t placed any orders yet.</p>
        <Link href="/shop" className="btn-lux mt-8 inline-flex">
          Start Shopping
        </Link>
      </Reveal>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order, i) => (
        <Reveal key={order.id} delay={i * 80} className="border border-border p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="font-serif text-xl">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="border border-border px-3 py-1 text-xs uppercase tracking-widest">{order.status}</span>
          </div>

          <div className="mt-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {item.image && <img src={item.image} alt={item.name} className="h-14 w-10 object-cover" />}
                <span className="flex-1">{item.name}</span>
                <span className="text-muted-foreground">Qty {item.quantity}</span>
                <span>{LKR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="font-serif text-lg">{LKR(order.total)}</p>
            {CANCELLABLE.includes(order.status) && (
              <button
                onClick={() => cancelOrder(order.id)}
                disabled={mutatingId === order.id}
                className="eyebrow line-link text-muted-foreground"
              >
                {mutatingId === order.id ? "Cancelling…" : "Cancel order"}
              </button>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
