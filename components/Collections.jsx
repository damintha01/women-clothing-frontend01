import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

function SectionHead({ eyebrow, title, link }) {
  return (
    <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="eyebrow text-rose">{eyebrow}</p>
        <h2 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)]">{title}</h2>
      </div>
      {link && (
        <Link href="/collections" className="eyebrow line-link inline-flex items-center gap-2">
          {link} <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

export function Collections() {
  return (
    <section id="collections" className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <SectionHead eyebrow="The Edits" title="Collections" link="View all" />
      </Reveal>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <Link href="/collections" className="zoom-media group relative block">
            <img src="/assets/collection-1.jpg" alt="Weekend Resort" loading="lazy" width={1024} height={1400} className="aspect-[3/4] w-full object-cover" />
            <div className="absolute inset-0 bg-charcoal/15 transition-colors duration-700 group-hover:bg-charcoal/35" />
            <div className="absolute bottom-8 left-8 text-cream transition-transform duration-700 group-hover:-translate-y-2">
              <p className="eyebrow">Vol. 01</p>
              <h3 className="display mt-2 text-5xl">Weekend Resort</h3>
            </div>
            <ArrowUpRight className="absolute bottom-8 right-8 size-7 text-cream opacity-0 transition-all duration-700 group-hover:opacity-100" strokeWidth={1} />
          </Link>
        </Reveal>

        <div className="grid gap-6 md:col-span-7">
          <Reveal delay={120}>
            <Link href="/collections" className="zoom-media group relative block">
              <img src="/assets/collection-2.jpg" alt="Evening Edit" loading="lazy" width={1400} height={1000} className="aspect-[16/10] w-full object-cover" />
              <div className="absolute inset-0 bg-charcoal/25 transition-colors duration-700 group-hover:bg-charcoal/45" />
              <div className="absolute bottom-8 left-8 text-cream transition-transform duration-700 group-hover:-translate-y-2">
                <p className="eyebrow">Vol. 02</p>
                <h3 className="display mt-2 text-5xl">Evening Edit</h3>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={220}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1.2fr_1fr]">
              <Link href="/collections" className="zoom-media group relative block">
                <img src="/assets/collection-3.jpg" alt="Daily Essentials" loading="lazy" width={1024} height={1400} className="aspect-[4/5] w-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/15 transition-colors duration-700 group-hover:bg-charcoal/35" />
                <div className="absolute bottom-8 left-8 text-cream">
                  <p className="eyebrow">Vol. 03</p>
                  <h3 className="display mt-2 text-4xl">Daily Essentials</h3>
                </div>
              </Link>
              <div className="flex flex-col justify-between bg-blush/40 p-8">
                <p className="font-serif text-3xl leading-tight">
                  Limited drops, released monthly from our Colombo studio.
                </p>
                <Link href="/shop?tag=limited" className="eyebrow line-link mt-10 inline-flex items-center gap-2">
                  Statement pieces <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
