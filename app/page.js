import { fetchBackendCatalog } from "@/lib/backend/catalog";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  let products = [];
  try {
    ({ products } = await fetchBackendCatalog());
  } catch {
    // The backend may be unreachable in dev — the homepage still renders its editorial sections.
    products = [];
  }

  return <HomeClient products={products} />;
}
