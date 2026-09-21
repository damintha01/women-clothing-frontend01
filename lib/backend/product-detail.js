import { BACKEND_URL } from "./config";
import { adaptProductDetail } from "./adapters";
import { fetchBackendCatalog } from "./catalog";
import { fetchBackend } from "./http";

const RELATED_PRODUCTS_LIMIT = 4;

export async function getBackendProductDetail(slug) {
  const { products, raw } = await fetchBackendCatalog();
  const match = raw.find((product) => product.slug === slug);
  if (!match) return null;

  const reviewsResponse = await fetchBackend(`${BACKEND_URL}/api/products/${match._id}/reviews`, {
    cache: "no-store",
  });
  const reviewsBody = reviewsResponse.ok
    ? await reviewsResponse.json()
    : { reviews: [], average: 0, total: 0 };

  const productCategory = products.find((p) => p.id === match._id)?.category;
  const relatedProducts = products
    .filter((p) => p.category === productCategory && p.id !== match._id)
    .slice(0, RELATED_PRODUCTS_LIMIT);

  return adaptProductDetail(match, reviewsBody, relatedProducts);
}

/** Resolves a product slug to its real backend Mongo `_id`, for endpoints that only accept ids. */
export async function resolveProductId(slug) {
  const { raw } = await fetchBackendCatalog();
  const match = raw.find((product) => product.slug === slug);
  return match?._id ?? null;
}
