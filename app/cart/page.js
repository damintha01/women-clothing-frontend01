"use client";
import { useState } from "react";
import Link from "next/link";
import { LKR } from "@/lib/shop-data";
import { useCart } from "@/lib/cart/cart-context";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { Reveal } from "@/components/Reveal";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);

  async function handleApplyCoupon(e) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput("");
    } catch {
      // toast already shown by the cart context
    } finally {
      setApplying(false);
    }
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1600px] px-5 pt-32 pb-28 md:px-10">
        <Reveal>
          <p className="eyebrow text-rose">Your Selection</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">Shopping Bag</h1>
        </Reveal>

        {cart.items.length === 0 ? (
          <Reveal className="mt-20 text-center">
            <p className="font-serif text-2xl text-muted-foreground">Your bag is empty.</p>
            <Link href="/shop" className="btn-lux mt-10 inline-flex">
              Continue Shopping
            </Link>
          </Reveal>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_380px]">
            <Reveal className="divide-y divide-border border-y border-border">
              {cart.items.map((line) => (
                <div key={line.id} className="flex gap-6 py-8">
                  {line.image && (
                    <Link href={line.slug ? `/shop/${line.slug}` : "#"} className="shrink-0">
                      <img src={line.image} alt={line.name} className="h-40 w-28 object-cover" />
                    </Link>
                  )}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-serif text-2xl leading-tight">{line.name}</p>
                      <p className="mt-2 text-xs tracking-widest uppercase text-muted-foreground">
                        {[line.size, line.color].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-3 text-sm">{LKR(line.price)}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-6">
                      <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line.id, q)} />
                      <button
                        onClick={() => removeItem(line.id, line.name)}
                        className="eyebrow line-link text-muted-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-sm">{LKR(line.price * line.quantity)}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={120} className="h-fit border border-border p-8">
              <p className="eyebrow mb-6">Order Summary</p>

              <form onSubmit={handleApplyCoupon} className="mb-6 flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full border border-border bg-transparent px-3 py-2.5 text-xs uppercase tracking-widest outline-none"
                />
                <button className="border border-foreground px-4 text-xs uppercase tracking-widest" disabled={applying}>
                  Apply
                </button>
              </form>

              {cart.couponCode && (
                <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                  <span>Coupon {cart.couponCode}</span>
                  <button onClick={removeCoupon} className="line-link">
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-3 border-t border-border pt-6 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{LKR(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-rose">
                    <span>Discount</span>
                    <span>-{LKR(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-3 font-serif text-xl">
                  <span>Total</span>
                  <span>{LKR(cart.total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-lux mt-8 w-full justify-center">
                Proceed to Checkout
              </Link>
            </Reveal>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
