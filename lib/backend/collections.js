import { BACKEND_URL } from "./config";
import { adaptCollection, adaptProduct } from "./adapters";
import { fetchBackend } from "./http";

export async function fetchBackendCollections() {
  const response = await fetchBackend(`${BACKEND_URL}/api/collections`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Backend responded with ${response.status} while fetching collections.`);
  }
  const raw = await response.json();
  return raw;
}

/** Backend only supports collection lookup by Mongo `_id` — resolve a pretty slug first. */
export async function getBackendCollectionDetail(slug) {
  const collections = await fetchBackendCollections();
  const match = collections.find((c) => c.slug === slug);
  if (!match) return null;

  const response = await fetchBackend(`${BACKEND_URL}/api/collections/${match._id}`, { cache: "no-store" });
  if (!response.ok) return null;

  const body = await response.json();
  return {
    collection: adaptCollection(body.collection, body.products?.length ?? 0),
    products: (body.products ?? []).map(adaptProduct),
  };
}
