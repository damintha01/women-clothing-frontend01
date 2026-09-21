import { Suspense } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { SearchView } from "@/components/shop/SearchView";

export const metadata = { title: "Search — Ceylon" };

export default function SearchPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-28">
        <Suspense fallback={<div className="px-5 py-40 text-center eyebrow">Loading…</div>}>
          <SearchView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
