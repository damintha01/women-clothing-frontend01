import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";

export default function ProductNotFound() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-5 pt-48 pb-32 text-center">
        <Reveal className="flex flex-col items-center">
          <p className="eyebrow text-rose">Piece not found</p>
          <h1 className="display mt-6 text-5xl">This one has sold its last thread.</h1>
          <p className="mt-6 text-sm text-muted-foreground">
            The piece you&apos;re looking for isn&apos;t available anymore.
          </p>
          <Link href="/shop" className="btn-lux mt-10">
            Back to Shop
          </Link>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
