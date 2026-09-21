const PAGE_SIZE = 12;

export function parseShopSearchParams(searchParams) {
  const get = (key) => searchParams.get(key) ?? undefined;
  return {
    search: get("q") ?? "",
    category: get("category") ?? "",
    tag: get("tag") ?? "",
    sizes: searchParams.getAll("size"),
    colors: searchParams.getAll("color"),
    minPrice: get("minPrice") ? Number(get("minPrice")) : null,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : null,
    inStock: get("inStock") === "true",
    sort: get("sort") ?? "newest",
    page: get("page") ? Number(get("page")) : 1,
  };
}

export function shopFiltersToQueryString(filters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  (filters.sizes ?? []).forEach((s) => params.append("size", s));
  (filters.colors ?? []).forEach((c) => params.append("color", c));
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.inStock) params.set("inStock", "true");
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

export function hasActiveShopFilters(filters) {
  return Boolean(
    filters.search ||
      filters.category ||
      filters.tag ||
      filters.sizes?.length ||
      filters.colors?.length ||
      filters.minPrice != null ||
      filters.maxPrice != null ||
      filters.inStock,
  );
}

export const SHOP_PAGE_SIZE = PAGE_SIZE;
