import { notFound } from "next/navigation";
import { getBackendProductDetail } from "@/lib/backend/product-detail";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getBackendProductDetail(slug).catch(() => null);
  if (!product) return { title: "Product not found — Ceylon" };
  return { title: `${product.name} — Ceylon`, description: product.description };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getBackendProductDetail(slug).catch(() => null);

  if (!product) notFound();

  return (
    <>
      <SiteNav />
      <main>
        <ProductDetailView product={product} />
      </main>
      <Footer />
    </>
  );
}
