import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { getBackendCollectionDetail } from "@/lib/backend/collections";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getBackendCollectionDetail(slug).catch(() => null);
  if (!result) return { title: "Collection not found — Ceylon" };
  return { title: `${result.collection.label} — Ceylon` };
}

export default async function CollectionDetailPage({ params }) {
  const { slug } = await params;
  const result = await getBackendCollectionDetail(slug).catch(() => null);

  if (!result) notFound();
  const { collection, products } = result;

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1600px] px-5 pt-32 pb-28 md:px-10">
        <Reveal>
          {collection.tag && <p className="eyebrow text-rose">{collection.tag}</p>}
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">{collection.label}</h1>
          {collection.description && (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">{collection.description}</p>
          )}
        </Reveal>

        <div className="mt-16">
          <ProductGrid products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
