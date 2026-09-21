"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { Reveal } from "@/components/Reveal";

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1600px] px-5 pt-32 pb-28 md:px-10">
        <Reveal>
          <p className="eyebrow text-rose">Almost there</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">Checkout</h1>
        </Reveal>

        {!isLoading && cart.items.length === 0 ? (
          <Reveal className="mt-20 text-center">
            <p className="font-serif text-2xl text-muted-foreground">Your bag is empty.</p>
            <Link href="/shop" className="btn-lux mt-10 inline-flex">
              Continue Shopping
            </Link>
          </Reveal>
        ) : (
          <div className="mt-16">
            <CheckoutFlow />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
