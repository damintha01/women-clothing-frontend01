"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Sections";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth/auth-context";
import { Reveal } from "@/components/Reveal";

const NAV = [
  { label: "Profile", href: "/account/profile" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Wishlist", href: "/account/wishlist" },
];

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      <SiteNav />
      <RequireAuth>
        <main className="mx-auto max-w-[1600px] px-5 pt-32 pb-28 md:px-10">
          <Reveal>
            <p className="eyebrow text-rose">My Account</p>
            <h1 className="display mt-4 text-[clamp(2.2rem,5vw,3.5rem)]">Ceylon Account</h1>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
            <nav className="flex gap-4 overflow-x-auto border-b border-border pb-4 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`eyebrow line-link whitespace-nowrap ${pathname === item.href ? "text-rose" : "text-muted-foreground"}`}
                >
                  {item.label}
                </Link>
              ))}
              <button onClick={logout} className="eyebrow line-link whitespace-nowrap text-left text-muted-foreground">
                Sign Out
              </button>
            </nav>
            <Reveal delay={120}>{children}</Reveal>
          </div>
        </main>
      </RequireAuth>
      <Footer />
    </>
  );
}
