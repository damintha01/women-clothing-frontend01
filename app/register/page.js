import { Suspense } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { RequireGuest } from "@/components/auth/RequireGuest";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Reveal } from "@/components/Reveal";

export const metadata = { title: "Create Account — Ceylon" };

export default function RegisterPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1600px] px-5 pt-40 pb-32 md:px-10">
        <Reveal className="mb-16 text-center">
          <p className="eyebrow text-rose">Join Ceylon</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4rem)]">Create Account</h1>
        </Reveal>
        <Suspense fallback={<p className="text-center eyebrow text-muted-foreground">Loading…</p>}>
          <RequireGuest>
            <Reveal delay={120}>
              <RegisterForm />
            </Reveal>
          </RequireGuest>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
