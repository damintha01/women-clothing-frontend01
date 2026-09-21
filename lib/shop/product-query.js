export function filterProducts(products, filters) {
  return products.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    if (filters.category && p.category !== filters.category) return false;
    if (filters.tag && !p.badges.includes(filters.tag)) return false;
    if (filters.sizes?.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
    if (filters.colors?.length && !p.colors.some((c) => filters.colors.includes(c.name))) return false;
    if (filters.minPrice != null && p.price < filters.minPrice) return false;
    if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
    if (filters.inStock && !p.inStock) return false;
    return true;
  });
}

export function sortProducts(products, sort) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "best-selling":
      return sorted.sort((a, b) => b.salesRank - a.salesRank);
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export function paginateProducts(products, page, pageSize) {
  const start = (page - 1) * pageSize;
  return products.slice(start, start + pageSize);
}

export function buildProductFacets(allProducts) {
  const categories = new Map();
  const sizes = new Set();
  const colors = new Map();
  let min = Infinity;
  let max = 0;

  for (const p of allProducts) {
    if (p.category) categories.set(p.category, (categories.get(p.category) ?? { slug: p.category, label: p.categoryLabel, count: 0 }));
    if (categories.has(p.category)) categories.get(p.category).count += 1;
    p.sizes.forEach((s) => sizes.add(s));
    p.colors.forEach((c) => colors.set(c.name, c));
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
  }

  return {
    categories: Array.from(categories.values()),
    sizes: Array.from(sizes),
    colors: Array.from(colors.values()),
    priceRange: { min: Number.isFinite(min) ? min : 0, max },
  };
}
