/** Fetches a product's full detail (incl. variants) and picks a sensible default variant to add. */
export async function fetchDefaultVariant(slug) {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const detail = data?.product;
  if (!detail) return null;
  const variant = detail.variants?.find((v) => v.inStock) ?? detail.variants?.[0];
  if (!variant) return null;
  return { detail, variant };
}

export function toCartInput(detail, variant, overrides = {}) {
  return {
    productId: detail.id,
    variantId: variant.id,
    name: detail.name,
    price: detail.price,
    size: variant.size,
    color: variant.color,
    quantity: 1,
    image: detail.images?.[0]?.url,
    ...overrides,
  };
}
