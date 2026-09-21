import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { fetchBackendCollections } from "@/lib/backend/collections";
import { adaptCollection } from "@/lib/backend/adapters";

export const metadata = { title: "Collections — Ceylon" };

export default async function CollectionsPage() {
  let collections = [];
  try {
    const raw = await fetchBackendCollections();
    collections = raw.map((c) => adaptCollection(c, 0));
  } catch {
    collections = [];
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1600px] px-5 pt-32 pb-28 md:px-10">
        <Reveal>
          <p className="eyebrow text-rose">The Edits</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">Collections</h1>
        </Reveal>

        {collections.length === 0 && (
          <p className="mt-16 font-serif text-2xl text-muted-foreground">No collections published yet.</p>
        )}

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal key={c.id} delay={i * 90}>
              <Link href={`/collections/${c.slug}`} className="zoom-media group relative block">
                <div className="aspect-4/5 w-full overflow-hidden bg-secondary">
                  {c.imageUrl && <img src={c.imageUrl} alt={c.label} className="h-full w-full object-cover" />}
                </div>
                <div className="absolute inset-0 bg-charcoal/20 transition-colors duration-700 group-hover:bg-charcoal/40" />
                <div className="absolute bottom-6 left-6 text-cream">
                  {c.tag && <p className="eyebrow">{c.tag}</p>}
                  <h2 className="display mt-2 text-3xl">{c.label}</h2>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
