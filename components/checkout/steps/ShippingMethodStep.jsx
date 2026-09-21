"use client";
import { LKR } from "@/lib/shop-data";
import { SHIPPING_METHODS, estimateShipping } from "@/lib/checkout/shipping-estimate";

export function ShippingMethodStep({ value, onChange, subtotalAfterDiscount }) {
  return (
    <div className="space-y-3">
      {SHIPPING_METHODS.map((method) => (
        <label
          key={method.id}
          className={`flex cursor-pointer items-center justify-between border p-4 transition-colors duration-500 ${
            value === method.id ? "border-foreground" : "border-border"
          }`}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="shippingMethod"
              checked={value === method.id}
              onChange={() => onChange(method.id)}
            />
            <div>
              <p className="text-sm font-medium">{method.label}</p>
              <p className="text-xs text-muted-foreground">{method.description}</p>
              <p className="text-xs text-muted-foreground">{method.etaLabel}</p>
            </div>
          </div>
          <p className="text-sm">{LKR(estimateShipping(subtotalAfterDiscount, method.id))}</p>
        </label>
      ))}
    </div>
  );
}
