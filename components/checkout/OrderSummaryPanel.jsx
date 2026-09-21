"use client";
import { LKR } from "@/lib/shop-data";

export function OrderSummaryPanel({ cart, pricing }) {
  const subtotal = pricing?.subtotal ?? cart.subtotal;
  const discount = pricing?.discount ?? cart.discount;
  const shippingCost = pricing?.shippingCost ?? 0;
  const tax = pricing?.tax ?? 0;
  const total = pricing?.total ?? cart.total;

  return (
    <div className="h-fit border border-border p-8">
      <p className="eyebrow mb-6">Order Summary</p>
      <div className="max-h-64 space-y-4 overflow-y-auto border-b border-border pb-6">
        {cart.items.map((line) => (
          <div key={line.id} className="flex gap-3 text-sm">
            {line.image && <img src={line.image} alt={line.name} className="h-16 w-12 object-cover" />}
            <div className="flex-1">
              <p className="leading-tight">{line.name}</p>
              <p className="text-xs text-muted-foreground">
                {[line.size, line.color].filter(Boolean).join(" · ")} · Qty {line.quantity}
              </p>
            </div>
            <p className="whitespace-nowrap">{LKR(line.price * line.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-6 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{LKR(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-rose">
            <span>Discount</span>
            <span>-{LKR(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{pricing ? LKR(shippingCost) : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{pricing ? LKR(tax) : "—"}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-3 font-serif text-xl">
          <span>Total</span>
          <span>{LKR(total)}</span>
        </div>
      </div>
    </div>
  );
}
