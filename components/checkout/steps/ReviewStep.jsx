"use client";
import { LKR } from "@/lib/shop-data";

export function ReviewStep({ contact, address, shippingMethodId, agreed, onAgreedChange, onPlaceOrder, placing }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="eyebrow text-muted-foreground">Contact</p>
          <p className="mt-2">{contact.email}</p>
          <p>{contact.phone}</p>
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Ship to</p>
          <p className="mt-2">{address.fullName}</p>
          <p>
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
          </p>
          <p>
            {address.city}, {address.zip}
          </p>
          <p>{address.country}</p>
        </div>
      </div>
      <p className="text-sm">
        <span className="eyebrow text-muted-foreground">Shipping · </span>
        {shippingMethodId === "express" ? "Express Delivery" : "Standard Delivery"}
      </p>

      <label className="flex items-start gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
        <input type="checkbox" checked={agreed} onChange={(e) => onAgreedChange(e.target.checked)} className="mt-0.5" />
        I agree to the Terms of Service and understand my order will be processed once payment is confirmed.
      </label>

      <button className="btn-lux w-full disabled:opacity-40" disabled={!agreed || placing} onClick={onPlaceOrder}>
        {placing ? "Placing order…" : "Place Order & Pay"}
      </button>
    </div>
  );
}
