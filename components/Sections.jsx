"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Plus, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { ProductCard } from "./ProductCard";
import { LKR, reviews, lookItems } from "@/lib/shop-data";
import { useCart } from "@/lib/cart/cart-context";
import { fetchDefaultVariant, toCartInput } from "@/lib/cart/quick-add";
import { toast } from "@/lib/toast";

function SectionHead({ eyebrow, title, link, href = "/shop" }) {
  return (
    <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="eyebrow text-rose">{eyebrow}</p>
        <h2 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">{title}</h2>
      </div>
      {link && (
        <Link href={href} className="eyebrow line-link inline-flex items-center gap-2">
          {link} <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

export function TheEdit({ products = [], onQuickView }) {
  return (
    <section id="shop" className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <SectionHead eyebrow="Most wanted" title="The Edit" link="Shop all" />
      </Reveal>
      <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <ProductCard product={p} onQuickView={onQuickView} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function NewIn({ products = [], onQuickView }) {
  const carousel = [...products, ...products];
  return (
    <section id="new-in" className="bg-cream py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <SectionHead eyebrow="Just landed" title="New In" link={null} />
        </Reveal>
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:px-10">
        {carousel.map((p, i) => (
          <div key={`${p.id}-${i}`} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[26vw]">
            <ProductCard product={p} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function LimitedDrop() {
  const [t, setT] = useState({ d: 2, h: 14, m: 36, s: 18 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((prev) => {
        let { d, h, m, s } = prev;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d = Math.max(0, d - 1);
        }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section id="drop" className="relative overflow-hidden bg-burgundy py-28 text-cream md:py-40">
      <div className="anim-drift absolute -left-40 top-0 size-[560px] rounded-full bg-rose/25 blur-3xl" />
      <div className="anim-drift absolute -right-32 bottom-0 size-[420px] rounded-full bg-champagne/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1600px] px-5 text-center md:px-10">
        <Reveal>
          <p className="eyebrow text-blush">Limited drop</p>
          <h2 className="display mx-auto mt-6 max-w-[14ch] text-[clamp(3rem,9vw,8rem)]">
            Once it&apos;s gone, it&apos;s gone.
          </h2>
          <div className="mt-12 flex items-end justify-center gap-6 md:gap-12">
            {[
              [pad(t.d), "Days"],
              [pad(t.h), "Hours"],
              [pad(t.m), "Mins"],
              [pad(t.s), "Secs"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="display text-[clamp(2.5rem,7vw,5rem)] tabular-nums">{v}</p>
                <p className="eyebrow mt-2 text-cream/60">{l}</p>
              </div>
            ))}
          </div>
          <Link href="/shop?tag=limited" className="btn-lux mt-14 bg-cream text-charcoal hover:bg-blush hover:text-charcoal">
            Shop the drop
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function EditorialStory() {
  return (
    <section id="editorial" className="relative">
      <div className="grain relative h-[80vh] overflow-hidden">
        <img src="/assets/editorial.jpg" alt="The New Femininity campaign" loading="lazy" width={1920} height={1088} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/25" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
            <Reveal>
              <p className="eyebrow text-cream/80">Editorial 01</p>
              <h2 className="display mt-5 max-w-[12ch] text-[clamp(2.5rem,10vw,9rem)] text-cream">
                The New Femininity
              </h2>
            </Reveal>
          </div>
        </div>
      </div>
      <div className="mx-auto -mt-16 max-w-[1600px] px-5 md:px-10">
        <Reveal delay={100}>
          <div className="max-w-xl bg-cream p-10 md:p-14">
            <p className="font-serif text-3xl leading-tight">Soft silhouettes. Strong energy.</p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              A study in contrast — liquid satin against structured tailoring, island light against
              deep shadow. Photographed between Colombo&apos;s colonial arcades and the coast road
              south.
            </p>
            <Link href="/collections" className="eyebrow line-link mt-8 inline-flex items-center gap-2">
              Read the story <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Lookbook({ products = [] }) {
  const { addItem } = useCart();
  const looks = products.slice(0, 3);

  async function addOne(product) {
    const match = await fetchDefaultVariant(product.slug);
    if (!match) return;
    await addItem(toCartInput(match.detail, match.variant), match.detail.name);
  }

  async function addCompleteLook() {
    for (const p of looks) {
      // Sequential on purpose — the cart's optimistic update reads/writes the same `cart` state.
      await addOne(p);
    }
  }

  return (
    <section id="lookbook" className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <SectionHead eyebrow="Lookbook" title="Shop the look" link="Shop all" />
      </Reveal>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <div className="relative">
            <img src="/assets/look.jpg" alt="Complete look — blazer, satin skirt and chain necklace" loading="lazy" width={1200} height={1500} className="w-full object-cover" />
            {lookItems.map((item) => (
              <div key={item.name} className="group absolute" style={{ top: item.top, left: item.left }}>
                <span className="block size-3 rounded-full bg-cream ring-4 ring-cream/30 transition-transform duration-500 group-hover:scale-125" />
                {/* Hover-only, so it is dead weight on touch — and at 224px wide it pushed
                    the whole document past the viewport on phones. The same three pieces are
                    listed with names and prices in the column below. */}
                <div className="pointer-events-none absolute left-6 top-1/2 hidden w-56 -translate-y-1/2 bg-cream p-4 opacity-0 shadow-[var(--shadow-lux)] transition-opacity duration-500 group-hover:opacity-100 lg:block">
                  <p className="font-serif text-lg leading-tight">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{LKR(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="flex flex-col justify-center">
          <p className="eyebrow text-rose">Look 04 — Office Edit</p>
          <h3 className="display mt-5 text-4xl md:text-5xl">Tailoring, undone</h3>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {looks.map((p) => (
              <li key={p.id} className="flex items-center gap-5 py-5">
                <img src={p.images?.[0]?.url ?? p.image} alt={p.name} loading="lazy" width={900} height={1200} className="size-20 object-cover" />
                <div className="flex-1">
                  <p className="font-serif text-xl leading-tight">{p.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{LKR(p.price)}</p>
                </div>
                <button aria-label={`Add ${p.name}`} onClick={() => addOne(p)} className="grid size-9 place-items-center border border-border transition-colors duration-500 hover:bg-foreground hover:text-cream">
                  <Plus className="size-4" strokeWidth={1.2} />
                </button>
              </li>
            ))}
          </ul>
          <button className="btn-lux mt-8 self-start" onClick={addCompleteLook} disabled={looks.length === 0}>
            Add complete look
          </button>
        </Reveal>
      </div>
    </section>
  );
}

export function Trending({ products = [], onQuickView }) {
  return (
    <section className="bg-charcoal py-28 text-cream md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <div className="mb-14">
            <p className="eyebrow text-blush">Loved right now</p>
            <h2 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">Trending Now</h2>
          </div>
        </Reveal>
      </div>
      <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto px-5 md:px-10">
        {[...products].reverse().map((p) => (
          <div key={p.id} className="w-[70vw] shrink-0 snap-start sm:w-[40vw] lg:w-[24vw]">
            <ProductCard product={p} onQuickView={onQuickView} className="[&_h3]:text-cream" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <img src="/assets/story.jpg" alt="Ceylon atelier detail" loading="lazy" width={1200} height={1500} className="w-full object-cover" />
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow text-rose">Our story</p>
          <h2 className="display mt-5 text-[clamp(2.2rem,7vw,6rem)]">More than clothes.</h2>
          <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Ceylon began in a small Colombo studio with a single idea: that the clothes a woman
            wears every day should feel as considered as the ones she saves for occasions. We cut in
            small runs, we finish by hand, and we design for the woman who dresses for herself first.
          </p>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Sri Lankan at heart. International in appearance.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {[
              ["Small-batch", "Made in Colombo"],
              ["Natural fibres", "Linen, silk, cotton"],
              ["Island-wide", "Delivery in 2 days"],
            ].map(([a, b]) => (
              <div key={a}>
                <p className="font-serif text-xl">{a}</p>
                <p className="mt-1 text-xs text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % reviews.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-blush/30 py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
        <Reveal>
          <div className="flex justify-center gap-1 text-champagne">
            {Array.from({ length: 5 }).map((_, n) => (
              <Star key={n} className="size-4 fill-current" strokeWidth={0} />
            ))}
          </div>
          <blockquote key={i} className="anim-in display mt-10 text-[clamp(1.8rem,4vw,3.2rem)]">
            &ldquo;{reviews[i].quote}&rdquo;
          </blockquote>
          <p className="eyebrow mt-8 text-muted-foreground">
            {reviews[i].name} · Verified customer
          </p>
          <div className="mt-10 flex justify-center gap-2">
            {reviews.map((r, n) => (
              <button
                key={r.name}
                aria-label={`Review ${n + 1}`}
                onClick={() => setI(n)}
                className={`h-px w-10 transition-colors duration-500 ${n === i ? "bg-foreground" : "bg-foreground/25"}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SocialGrid() {
  const feed = ["/assets/collection-1.jpg", "/assets/look.jpg", "/assets/editorial.jpg", "/assets/collection-3.jpg", "/assets/story.jpg", "/assets/collection-2.jpg"];
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <div className="mb-14 text-center">
          <p className="eyebrow text-rose">@ceylon</p>
          <h2 className="display mt-4 text-[clamp(2.4rem,6vw,5rem)]">Follow the  girl</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {feed.map((src, i) => (
          <Reveal key={i} delay={i * 70}>
            <a href="#top" className="zoom-media group relative block">
              <img src={src} alt="Ceylon community style" loading="lazy" width={900} height={1200} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/0 text-cream opacity-0 transition-all duration-700 group-hover:bg-charcoal/45 group-hover:opacity-100">
                <Heart className="size-4" strokeWidth={1.2} />
                <span className="eyebrow">View</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
      toast.success("You're on the list.");
    } catch {
      setStatus("idle");
      toast.error("Could not subscribe right now.");
    }
  }

  return (
    <section className="bg-cream py-28 md:py-40">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-5 md:px-10 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-rose">The list</p>
          <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5rem)]">Join the  list</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Be the first to discover new drops, exclusive pieces and special offers.
          </p>
          <form className="mt-10 flex max-w-md items-center gap-4 border-b border-foreground/30 pb-3" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-transparent font-serif text-xl outline-none placeholder:text-muted-foreground"
            />
            <button className="eyebrow line-link" disabled={status === "loading"}>
              {status === "loading" ? "…" : "Join"}
            </button>
          </form>
        </Reveal>

        <Reveal delay={120}>
          <div className="border border-champagne/60 bg-ivory p-10 md:p-14">
            <p className="eyebrow text-champagne">Membership</p>
            <h3 className="display mt-4 text-5xl"> Privé</h3>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              {[
                "Early access to every drop",
                "Exclusive members-only pieces",
                "Private offers",
                "Birthday rewards",
                "Personal styling recommendations",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-2 block size-1 bg-champagne" />
                  {b}
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn-lux mt-10 inline-flex">Join  Privé</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8.5H16l.5-3.5h-3V7.8c0-1 .3-1.8 1.8-1.8H16.5V3.1C16.2 3 15.2 2.9 14 2.9c-2.5 0-4.2 1.5-4.2 4.3V10H7v3.5h2.8V22h3.7z" />
    </svg>
  );
}

function TiktokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.3 2 1.7 3.5 3.7 3.8v3.1c-1.4 0-2.7-.4-3.7-1.2v6.6c0 3.3-2.7 5.7-5.9 5.4-2.8-.3-5-2.6-5.1-5.4-.2-3.4 2.5-6.2 5.8-6.2.4 0 .7 0 1 .1v3.2c-.3-.1-.6-.2-1-.2-1.5 0-2.7 1.3-2.6 2.9.1 1.4 1.3 2.5 2.7 2.5 1.5 0 2.7-1.2 2.7-2.7V3h2.4z" />
    </svg>
  );
}

function PinterestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.5 2 3 5.7 3 10.1c0 2.4 1.3 4.3 3.4 5-.1-.4-.3-1.1 0-1.9l1.1-4.4s-.3-.6-.3-1.4c0-1.3.8-2.3 1.8-2.3.8 0 1.2.6 1.2 1.4 0 .8-.5 2.1-.8 3.2-.2.9.5 1.7 1.4 1.7 1.7 0 2.9-2.2 2.9-4.7 0-2-1.3-3.4-3.7-3.4-2.7 0-4.4 2-4.4 4.2 0 .8.2 1.3.6 1.8.2.2.2.3.1.5l-.2 1c-.1.3-.3.4-.5.3-1.4-.6-2-2.1-2-3.8 0-2.8 2.4-6.2 7.1-6.2 3.8 0 6.3 2.7 6.3 5.7 0 3.9-2.1 6.8-5.3 6.8-1 0-2-.6-2.4-1.2l-.7 2.6c-.2.9-.7 1.9-1.1 2.6.9.3 1.9.4 2.9.4 5.5 0 9.9-4.5 9.9-10S17.5 2 12 2z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://instagram.com/ceylon", Icon: InstagramIcon },
  { name: "Facebook", href: "https://facebook.com/ceylon", Icon: FacebookIcon },
  { name: "TikTok", href: "https://tiktok.com/@ceylon", Icon: TiktokIcon },
  { name: "Pinterest", href: "https://pinterest.com/ceylon", Icon: PinterestIcon },
];

export function Footer() {
  const cols = [
    ["Shop", [["New In", "/shop?sort=newest"], ["Dresses", "/shop?category=dresses"], ["Tops", "/shop?category=tops"], ["Bottoms", "/shop?category=bottoms"], ["Collections", "/collections"], ["Sale", "/shop?tag=sale"]]],
    ["Help", [["Contact", "/#"], ["Shipping", "/#"], ["Returns", "/#"], ["Size Guide", "/#"], ["FAQs", "/#"]]],
    ["About", [["Our Story", "/#"], [" Privé", "/register"], ["Careers", "/#"], ["Journal", "/#"]]],
  ];

  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <p className="display text-2xl tracking-[0.14em]">
              <span className="text-rose">.</span>CEYLON
            </p>
            <p className="mt-4 text-xs leading-relaxed text-cream/60">
              Contemporary womenswear.
              <br />
              Colombo, Sri Lanka.
            </p>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <p className="eyebrow text-cream/50">{title}</p>
              <ul className="mt-6 space-y-3 text-sm text-cream/85">
                {links.map(([l, href]) => (
                  <li key={l}>
                    <Link href={href} className="line-link">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow text-cream/50">Follow</p>
            <div className="mt-6 flex gap-4">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="text-cream/85 transition-colors duration-500 hover:text-rose"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-cream/15 pt-8 text-[11px] tracking-widest uppercase text-cream/50">
          <p>© {new Date().getFullYear()} Ceylon · Sri Lanka</p>
          <p>Visa · Mastercard · Amex · KOKO · Cash on delivery</p>
        </div>
        <div className="mt-6 text-center text-[11px] tracking-widest uppercase text-cream/40">
          <p>
            Design &amp; Developed by{" "}
            <a
              href="https://www.accionix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="line-link text-cream/70"
            >
              AccioniX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
