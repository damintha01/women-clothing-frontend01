"use client";
import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    const onScroll = () => setOffset(window.scrollY * 0.18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-charcoal">
      {/* Loading curtain */}
      <div
        className={`fixed inset-0 z-[90] flex items-center justify-center bg-charcoal transition-opacity duration-1000 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
      >
        <span className="display anim-in text-cream text-[clamp(1.6rem,5vw,3rem)] tracking-[0.3em]">
          CEYLON
        </span>
      </div>

      <div className="grain absolute inset-0">
        <img
          src="/assets/hero.jpg"
          alt="Ceylon campaign"
          width={1600}
          height={1920}
          fetchPriority="high"
          className="anim-zoom h-full w-full object-cover object-[60%_center]"
          style={{ transform: `translate3d(0, ${offset}px, 0)` }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-charcoal/70 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-20 text-cream md:px-10 md:pb-28">
        <p
          className="eyebrow anim-in text-blush"
          style={{ animationDelay: "1.5s" }}
        >
          Colombo · Summer Collection
        </p>
        <h1
          className="display anim-in mt-6 max-w-[16ch] text-[clamp(3.2rem,11vw,10rem)]"
          style={{ animationDelay: "1.7s" }}
        >
          Own Your <em className="not-italic text-blush">Moment.</em>
        </h1>
        <p
          className="anim-in mt-8 max-w-md text-sm leading-relaxed text-cream/80"
          style={{ animationDelay: "2s" }}
        >
          Contemporary womenswear designed for confident everyday moments — cut, dyed and finished
          in Sri Lanka.
        </p>
        <div className="anim-in mt-10 flex flex-wrap gap-4" style={{ animationDelay: "2.2s" }}>
          <a href="#new-in" className="btn-lux bg-cream text-charcoal hover:bg-rose">
            Shop New Arrivals
          </a>
          <a href="#collections" className="btn-ghost-lux text-cream">
            <span>Explore Collection</span>
          </a>
        </div>
        <div
          className="anim-in mt-14 flex items-center gap-3 text-cream/60"
          style={{ animationDelay: "2.4s" }}
        >
          <ArrowDown className="size-4 animate-bounce" strokeWidth={1.2} />
          <span className="eyebrow">Scroll</span>
        </div>
      </div>
    </section>
  );
}
