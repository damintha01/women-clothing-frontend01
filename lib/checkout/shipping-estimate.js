/**
 * Client-side display mirror of the backend's src/lib/orderHelper.js tiers, so the shipping
 * step can show a price before the real pricing-preview round trip resolves. Not authoritative —
 * the backend recomputes this server-side for both the preview and the final order.
 */
export function estimateShipping(subtotalAfterDiscount, methodId = "standard") {
  if (methodId === "express") return 2500;
  if (subtotalAfterDiscount >= 25000) return 0;
  if (subtotalAfterDiscount >= 10000) return 500;
  return 990;
}

export const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "Insured courier delivery, signature on arrival.",
    etaLabel: "2-5 business days",
  },
  {
    id: "express",
    label: "Express Delivery",
    description: "Priority handling and expedited courier transit.",
    etaLabel: "1-2 business days",
  },
];
