import { BACKEND_URL } from "./config";
import { adaptProduct } from "./adapters";
import { fetchBackend } from "./http";

// The backend's list endpoint defaults to 20/page; we pull the whole (modest)
// catalog in one call so shop-page filter/sort/paginate/facet logic can run
// over it like it was a fully loaded dataset.
const CATALOG_FETCH_LIMIT = 200;

export async function fetchBackendCatalog() {
  const response = await fetchBackend(`${BACKEND_URL}/api/products?limit=${CATALOG_FETCH_LIMIT}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Backend responded with ${response.status} while fetching products.`);
  }

  const body = await response.json();
  return { products: body.products.map(adaptProduct), raw: body.products };
}
