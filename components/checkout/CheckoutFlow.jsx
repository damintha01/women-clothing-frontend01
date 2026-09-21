"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/lib/toast";
import { startPayHerePayment } from "@/lib/checkout/payhere-client";
import { Reveal } from "@/components/Reveal";
import { ContactStep } from "./steps/ContactStep";
import { ShippingAddressStep } from "./steps/ShippingAddressStep";
import { ShippingMethodStep } from "./steps/ShippingMethodStep";
import { ReviewStep } from "./steps/ReviewStep";
import { OrderSummaryPanel } from "./OrderSummaryPanel";

const STEPS = ["Contact", "Shipping Address", "Shipping Method", "Review"];

function StepShell({ index, current, title, summary, onEdit, children }) {
  const done = index < current;
  const active = index === current;
  return (
    <div className={`border-b border-border py-8 ${active ? "" : "opacity-60"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className={`grid size-7 place-items-center rounded-full border text-xs ${
              done ? "border-foreground bg-foreground text-cream" : "border-border"
            }`}
          >
            {done ? <Check className="size-3.5" /> : index + 1}
          </span>
          <p className="font-serif text-xl">{title}</p>
        </div>
        {done && (
          <button onClick={onEdit} className="eyebrow line-link text-muted-foreground">
            Edit
          </button>
        )}
      </div>
      {done && summary && <p className="mt-3 pl-11 text-sm text-muted-foreground">{summary}</p>}
      {active && <div className="mt-6 pl-11">{children}</div>}
    </div>
  );
}

export function CheckoutFlow() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ email: user?.email ?? "", phone: "" });
  const [address, setAddress] = useState({
    fullName: user?.name ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "Sri Lanka",
  });
  const [shippingMethodId, setShippingMethodId] = useState("standard");
  const [pricing, setPricing] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [placing, setPlacing] = useState(false);

  async function goToReview() {
    try {
      const res = await fetch("/api/checkout/pricing-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingMethodId }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) setPricing(data.pricing);
    } catch {
      // Review step falls back to cart-only totals if the preview call fails.
    }
    setStep(3);
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      const orderRes = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contact.email,
          shippingAddress: { ...address, phone: contact.phone },
          shippingMethodId,
        }),
      });
      const orderData = await orderRes.json().catch(() => null);
      if (!orderRes.ok) throw new Error(orderData?.error?.message ?? "Could not place your order.");

      const order = orderData.order;
      try {
        sessionStorage.setItem(`order:${order.id}`, JSON.stringify(order));
      } catch {
        // Best-effort — the success page falls back to fetching the order if this isn't set.
      }

      const payRes = await fetch("/api/checkout/payhere-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!payRes.ok) {
        // Payment gateway unavailable (e.g. not configured yet) — the order still exists as
        // pending payment; let the customer complete on delivery instead of a dead end.
        toast.error("Online payment isn't available right now. Your order is placed — pay on delivery.");
        await clearCart();
        router.push(`/checkout/success?order=${order.id}`);
        return;
      }

      const payload = await payRes.json();
      await startPayHerePayment(payload, {
        onCompleted: async () => {
          await clearCart();
          router.push(`/checkout/success?order=${order.id}`);
        },
        onDismissed: () => {
          toast.error("Payment was not completed. You can try again below.");
          setPlacing(false);
        },
        onError: (err) => {
          toast.error(err || "Payment failed. Please try again.");
          setPlacing(false);
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place your order.");
      setPlacing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_380px]">
      <Reveal>
        <StepShell index={0} current={step} title={STEPS[0]} summary={`${contact.email} · ${contact.phone}`}>
          <ContactStep value={contact} onChange={setContact} />
          <button
            className="btn-lux mt-6"
            disabled={!contact.email || !contact.phone}
            onClick={() => setStep(1)}
          >
            Continue to Shipping
          </button>
        </StepShell>

        <StepShell
          index={1}
          current={step}
          title={STEPS[1]}
          summary={`${address.line1}, ${address.city}, ${address.country}`}
          onEdit={() => setStep(1)}
        >
          <ShippingAddressStep value={address} onChange={setAddress} />
          <button
            className="btn-lux mt-6"
            disabled={!address.fullName || !address.line1 || !address.city || !address.zip}
            onClick={() => setStep(2)}
          >
            Continue to Shipping Method
          </button>
        </StepShell>

        <StepShell
          index={2}
          current={step}
          title={STEPS[2]}
          summary={shippingMethodId === "express" ? "Express Delivery" : "Standard Delivery"}
          onEdit={() => setStep(2)}
        >
          <ShippingMethodStep
            value={shippingMethodId}
            onChange={setShippingMethodId}
            subtotalAfterDiscount={cart.subtotal - cart.discount}
          />
          <button className="btn-lux mt-6" onClick={goToReview}>
            Continue to Review
          </button>
        </StepShell>

        <StepShell index={3} current={step} title={STEPS[3]}>
          <ReviewStep
            contact={contact}
            address={address}
            shippingMethodId={shippingMethodId}
            agreed={agreed}
            onAgreedChange={setAgreed}
            onPlaceOrder={handlePlaceOrder}
            placing={placing}
          />
        </StepShell>
      </Reveal>

      <Reveal delay={120}>
        <OrderSummaryPanel cart={cart} pricing={pricing} />
      </Reveal>
    </div>
  );
}
