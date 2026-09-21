"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LKR } from "@/lib/shop-data";
import { Reveal } from "@/components/Reveal";

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }
    try {
      const cached = sessionStorage.getItem(`order:${orderId}`);
      if (cached) {
        setOrder(JSON.parse(cached));
        setIsLoading(false);
        return;
      }
    } catch {
      // fall through to fetch
    }
    fetch(`/api/orders/${orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOrder(data?.order ?? null))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  if (isLoading) {
    return <p className="py-40 text-center eyebrow text-muted-foreground">Loading…</p>;
  }

  if (!order) {
    return (
      <div className="py-40 text-center">
        <p className="font-serif text-2xl text-muted-foreground">We couldn&apos;t find that order.</p>
        <Link href="/shop" className="btn-lux mt-10 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-rose">Order confirmed</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4.5rem)]">Thank you.</h1>
      <p className="mt-6 text-sm text-muted-foreground">
        Order <span className="text-foreground">{order.orderNumber}</span> has been placed. A confirmation has
        been sent to {order.email}.
      </p>

      <div className="mt-12 divide-y divide-border border-y border-border text-left">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 py-4">
            {item.image && <img src={item.image} alt={item.name} className="h-20 w-14 object-cover" />}
            <div className="flex-1">
              <p className="font-serif text-lg leading-tight">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {[item.size, item.color].filter(Boolean).join(" · ")} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-sm">{LKR(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-2 text-left text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{LKR(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{LKR(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{LKR(order.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-serif text-xl">
          <span>Total</span>
          <span>{LKR(order.total)}</span>
        </div>
      </div>

      <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
        Payment status: {order.paymentStatus}
      </p>

      <Link href="/shop" className="btn-lux mt-12 inline-flex">
        Continue Shopping
      </Link>
    </Reveal>
  );
}
