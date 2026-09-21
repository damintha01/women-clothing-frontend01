"use client";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { Collections } from "@/components/Collections";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import {
  TheEdit,
  NewIn,
  LimitedDrop,
  EditorialStory,
  Lookbook,
  Trending,
  BrandStory,
  Reviews,
  SocialGrid,
  Newsletter,
  Footer,
} from "@/components/Sections";
import { QuickView } from "@/components/QuickView";

export function HomeClient({ products }) {
  const [quick, setQuick] = useState(null);

  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Collections />
        <CategoryShowcase />
        <TheEdit products={products} onQuickView={setQuick} />
        <NewIn products={products} onQuickView={setQuick} />
        <LimitedDrop />
        <EditorialStory />
        <Lookbook products={products} />
        <Trending products={products} onQuickView={setQuick} />
        <BrandStory />
        <Reviews />
        <SocialGrid />
        <Newsletter />
      </main>
      <Footer />
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}
