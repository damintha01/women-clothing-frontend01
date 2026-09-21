"use client";
import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/lib/toast";
import { Reveal } from "@/components/Reveal";

function Stars({ value, size = "size-4" }) {
  return (
    <div className="flex gap-0.5 text-champagne">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size} ${i < Math.round(value) ? "fill-current" : ""}`} strokeWidth={1} />
      ))}
    </div>
  );
}

export function ReviewsSection({ slug, rating, reviews: initialReviews }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not submit your review.");
      setReviews((prev) => [data.review, ...prev]);
      setSubmitted(true);
      toast.success("Thanks for your review.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="mx-auto max-w-4xl px-5 py-24 md:px-10">
      <Reveal>
        <h2 className="display text-4xl">Reviews</h2>
        <div className="mt-8 flex flex-wrap items-center gap-8 border-y border-border py-8">
          <div>
            <p className="font-serif text-5xl">{rating.average.toFixed(1)}</p>
            <Stars value={rating.average} />
            <p className="mt-1 text-xs text-muted-foreground">{rating.count} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {rating.distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="w-10">{d.stars} star</span>
                <div className="h-1 flex-1 bg-border">
                  <div
                    className="h-1 bg-champagne"
                    style={{ width: rating.count ? `${(d.count / rating.count) * 100}%` : "0%" }}
                  />
                </div>
                <span className="w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-10 space-y-8">
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-border pb-8">
            <Stars value={r.rating} size="size-3.5" />
            <p className="mt-3 text-sm leading-relaxed">{r.content}</p>
            <p className="mt-2 text-xs tracking-widest uppercase text-muted-foreground">{r.author}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet — be the first.</p>}
      </div>

      <div className="mt-10 border-t border-border pt-10">
        {!user && (
          <p className="text-sm text-muted-foreground">
            <Link href={`/login?redirect=/shop/${slug}`} className="line-link text-foreground">
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        )}
        {user && submitted && <p className="text-sm text-muted-foreground">Your review has been submitted.</p>}
        {user && !submitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, rating: n }))}>
                  <Star className={`size-6 text-champagne ${n <= form.rating ? "fill-current" : ""}`} strokeWidth={1} />
                </button>
              ))}
            </div>
            <textarea
              required
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Share your thoughts on this piece…"
              rows={4}
              className="w-full border border-border bg-transparent p-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="btn-lux" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
