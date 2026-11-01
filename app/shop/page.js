import { Suspense } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { ShopView } from "@/components/shop/ShopView";

export const metadata = { title: "Shop - Ceylon" };

export default function ShopPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-28">
        <Suspense fallback={<div className="px-5 py-40 text-center eyebrow">Loading…</div>}>
          <ShopView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
