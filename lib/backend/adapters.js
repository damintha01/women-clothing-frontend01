import { colorNameToHex } from "./color-hex";

const CURRENCY = "LKR";

export const DELIVERY_INFO = [
  {
    label: "Island-wide Shipping",
    description:
      "Insured delivery within 2-5 business days across Sri Lanka. Express options available at checkout.",
  },
  {
    label: "Returns & Exchanges",
    description: "14-day return window for unworn pieces in original packaging with tags attached.",
  },
  {
    label: "Ceylon Care",
    description: "Garment care instructions and a spare button set are included with every order.",
  },
];

function collectionRef(product) {
  return typeof product.collectionId === "object" && product.collectionId !== null
    ? product.collectionId
    : null;
}

function deriveBadges(product) {
  const badges = [];
  const tags = product.tags ?? [];
  if (tags.includes("sale") || (product.comparePrice !== undefined && product.comparePrice > product.price)) {
    badges.push("sale");
  }
  if (tags.includes("new")) badges.push("new");
  if (tags.includes("limited") || product.isExclusive) badges.push("limited");
  if (product.isFeatured || tags.includes("bestseller")) badges.push("bestseller");
  return badges;
}

export function adaptImages(raw) {
  return (raw.images ?? []).map((url, index) => ({
    id: `${raw._id}-${index}`,
    alt: raw.name,
    url,
  }));
}

export function adaptProduct(raw) {
  const collection = collectionRef(raw);
  const variants = raw.variants ?? [];
  const sizes = Array.from(new Set(variants.map((v) => v.size))).filter(Boolean);
  const colorMap = new Map();
  for (const variant of variants) {
    if (!variant.color) continue;
    colorMap.set(variant.color, { name: variant.color, hex: colorNameToHex(variant.color) });
  }

  return {
    id: raw._id,
    slug: raw.slug,
    name: raw.name,
    category: collection?.slug ?? "uncategorized",
    categoryLabel: collection?.name ?? "Uncategorized",
    images: adaptImages(raw),
    price: raw.price,
    compareAtPrice: raw.comparePrice,
    currency: CURRENCY,
    description: raw.description ?? "",
    badges: deriveBadges(raw),
    sizes,
    colors: Array.from(colorMap.values()),
    inStock: (raw.totalStock ?? 0) > 0,
    salesRank: 0,
    createdAt: raw.createdAt,
  };
}

export function adaptVariant(raw) {
  return {
    id: raw._id,
    size: raw.size,
    color: raw.color,
    colorHex: colorNameToHex(raw.color),
    sku: raw.sku ?? "",
    stock: raw.stock,
    inStock: raw.stock > 0,
  };
}

function clampRating(value) {
  const rounded = Math.round(value);
  return Math.min(5, Math.max(1, rounded));
}

export function adaptReviews(raw) {
  const reviews = (raw.reviews ?? [])
    .filter((r) => r.isVisible)
    .map((r) => ({
      id: r._id,
      author: r.name,
      rating: clampRating(r.rating),
      content: r.comment,
      createdAt: r.createdAt,
    }));

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  return {
    rating: { average: raw.average ?? 0, count: raw.total ?? 0, distribution },
    reviews,
  };
}

export function adaptProductDetail(raw, reviewsResponse, relatedProducts) {
  const { rating, reviews } = adaptReviews(reviewsResponse);

  return {
    ...adaptProduct(raw),
    images: adaptImages(raw),
    variants: (raw.variants ?? []).map(adaptVariant),
    rating,
    reviews,
    delivery: DELIVERY_INFO,
    relatedProducts,
  };
}

export function adaptCollection(raw, productCount) {
  return {
    id: raw._id,
    slug: raw.slug,
    label: raw.name,
    description: raw.description,
    tag: raw.tag,
    imageUrl: raw.imageUrl,
    productCount,
  };
}

export function adaptCart(raw) {
  const items = (raw.items ?? []).map((item) => {
    const productId = typeof item.productId === "string" ? item.productId : item.productId?._id;
    const slug = typeof item.productId === "object" && item.productId ? item.productId.slug ?? "" : "";
    return {
      id: item._id,
      productId,
      variantId: item.variantId ?? "",
      slug,
      name: item.name,
      image: item.image,
      size: item.size ?? "",
      color: item.color ?? "",
      price: item.price,
      currency: CURRENCY,
      quantity: item.quantity,
    };
  });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = raw.subtotal ?? 0;
  const discount = raw.discount ?? 0;

  return {
    items,
    itemCount,
    subtotal,
    discount,
    total: raw.total ?? Math.max(0, subtotal - discount),
    couponCode: raw.couponCode,
    currency: CURRENCY,
  };
}

export function emptyCart() {
  return { items: [], itemCount: 0, subtotal: 0, discount: 0, total: 0, currency: CURRENCY };
}

/**
 * `config` is intentionally freeform on the backend (Mongoose Mixed) — the owner fills in
 * whatever fields the section's `type` needs via the admin section builder, matching the
 * specific section shape the renderer expects. There's no runtime validation against that
 * shape here; a malformed config just means SectionRenderer's per-field defaults kick in.
 */
export function adaptSectionConfig(raw) {
  return {
    id: raw._id,
    type: raw.type,
    name: raw.name,
    order: raw.order,
    isVisible: raw.isVisible,
    isBuiltIn: raw.isBuiltIn,
    ...raw.config,
  };
}

export function adaptOrder(raw) {
  const items = (raw.items ?? []).map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    name: item.name,
    price: item.price,
    image: item.image,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
  }));

  return {
    id: raw._id,
    orderNumber: raw.orderNumber,
    email: raw.email,
    items,
    shippingAddress: {
      fullName: raw.shippingAddress?.fullName,
      line1: raw.shippingAddress?.line1,
      line2: raw.shippingAddress?.line2,
      city: raw.shippingAddress?.city,
      state: raw.shippingAddress?.state ?? "",
      zip: raw.shippingAddress?.zip,
      country: raw.shippingAddress?.country,
      phone: raw.shippingAddress?.phone,
    },
    shippingMethod: raw.shippingMethod ?? "standard",
    subtotal: raw.subtotal,
    shippingCost: raw.shippingCost,
    discount: raw.discount,
    tax: raw.tax,
    total: raw.total,
    currency: CURRENCY,
    couponCode: raw.couponCode,
    paymentStatus: raw.paymentStatus,
    paymentIntentId: raw.paymentIntentId,
    status: raw.status,
    trackingNumber: raw.trackingNumber,
    trackingUrl: raw.trackingUrl,
    carrier: raw.carrier,
    timeline: raw.timeline ?? [],
    createdAt: raw.createdAt,
  };
}

export function adaptAddress(raw) {
  return {
    id: raw._id,
    label: raw.label,
    line1: raw.line1,
    line2: raw.line2,
    city: raw.city,
    state: raw.state ?? "",
    zip: raw.zip,
    country: raw.country,
    phone: raw.phone,
    isDefault: raw.isDefault ?? false,
  };
}

export function adaptUser(raw) {
  return {
    id: raw._id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    avatar: raw.avatar,
    createdAt: raw.createdAt,
  };
}
