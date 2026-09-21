import { Suspense } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata = { title: "Order Confirmed — Ceylon" };

export default function CheckoutSuccessPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1600px] px-5 pt-32 pb-28 md:px-10">
        <Suspense fallback={<p className="py-40 text-center eyebrow">Loading…</p>}>
          <OrderConfirmation />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
