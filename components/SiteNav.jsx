"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { useAuth } from "@/lib/auth/auth-context";

const NAV = [
  { label: "New In", href: "/shop?sort=newest" },
  { label: "Clothing", href: "/shop" },
  { label: "Dresses", href: "/shop?category=dresses" },
  { label: "Tops", href: "/shop?category=tops" },
  { label: "Bottoms", href: "/shop?category=bottoms" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/shop?tag=sale" },
];
const CATEGORY_LINKS = ["Dresses", "Tops", "Bottoms", "Sets", "Outerwear"];
const POPULAR = ["Dresses", "New Arrivals", "Linen", "Party Wear", "Tops", "Bestsellers"];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [search, setSearch] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { cart, openDrawer } = useCart();
  const { ids } = useWishlist();
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    function onClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [accountOpen]);

  const tone = scrolled || mega ? "text-foreground" : "text-cream";

  function submitSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearch(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function handleLogout() {
    setAccountOpen(false);
    setMobile(false);
    await logout();
    router.push("/");
  }

  return (
    <>
      <header
        onMouseLeave={() => setMega(false)}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${scrolled || mega
          ? "bg-cream/85 backdrop-blur-xl border-b border-border/70"
          : "bg-transparent"
          }`}
      >
        <div className={`mx-auto flex max-w-[1600px] items-center gap-6 px-5 md:px-10 ${scrolled ? "py-4" : "py-6"} transition-all duration-700 ${tone}`}>
          <button
            aria-label="Open menu"
            className="lg:hidden"
            onClick={() => setMobile(true)}
          >
            <Menu className="size-5" strokeWidth={1.2} />
          </button>

          <Link href="/" className="display text-2xl tracking-[0.14em] md:text-[1.7rem]">
            <span className="text-rose">.</span>CEYLON
          </Link>

          <nav className="ml-auto hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setMega(item.label === "Clothing")}
                className={`eyebrow line-link ${item.label === "Sale" ? "text-burgundy" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-5 lg:ml-8">
            <button aria-label="Search" onClick={() => setSearch(true)} className="transition-transform duration-500 hover:-translate-y-0.5">
              <Search className="size-[18px]" strokeWidth={1.2} />
            </button>
            {user ? (
              <div ref={accountRef} className="relative hidden sm:block">
                <button
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((v) => !v)}
                  className="transition-transform duration-500 hover:-translate-y-0.5"
                >
                  <User className="size-[18px]" strokeWidth={1.2} />
                </button>
                <div
                  className={`absolute right-0 top-full mt-4 w-56 border border-border bg-cream text-foreground shadow-[var(--shadow-lux)] transition-all duration-300 ${accountOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                    }`}
                >
                  <div className="border-b border-border px-5 py-4">
                    <p className="eyebrow text-muted-foreground">Signed in as</p>
                    <p className="mt-1 truncate font-serif text-lg">{user.name || user.email}</p>
                  </div>
                  <nav className="flex flex-col py-2 text-sm">
                    <Link href="/account/orders" onClick={() => setAccountOpen(false)} className="px-5 py-2.5 transition-colors duration-300 hover:bg-secondary">
                      My Orders
                    </Link>
                    <Link href="/cart" onClick={() => setAccountOpen(false)} className="px-5 py-2.5 transition-colors duration-300 hover:bg-secondary">
                      My Cart
                    </Link>
                    <Link href="/account/profile" onClick={() => setAccountOpen(false)} className="px-5 py-2.5 transition-colors duration-300 hover:bg-secondary">
                      Profile Settings
                    </Link>
                    <button onClick={handleLogout} className="px-5 py-2.5 text-left text-burgundy transition-colors duration-300 hover:bg-secondary">
                      Log Out
                    </button>
                  </nav>
                </div>
              </div>
            ) : (
              <Link href="/login" className="eyebrow hidden transition-transform duration-500 hover:-translate-y-0.5 sm:block">
                Sign In
              </Link>
            )}
            <Link href="/account/wishlist" aria-label="Wishlist" className="relative transition-transform duration-500 hover:-translate-y-0.5">
              <Heart className="size-[18px]" strokeWidth={1.2} />
              {ids.length > 0 && (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-rose text-[9px] text-cream">
                  {ids.length}
                </span>
              )}
            </Link>
            <button aria-label="Shopping bag" onClick={openDrawer} className="relative transition-transform duration-500 hover:-translate-y-0.5">
              <ShoppingBag className="size-[18px]" strokeWidth={1.2} />
              {cart.itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-burgundy text-[9px] text-cream">
                  {cart.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <div
          className={`hidden overflow-hidden border-t border-border/60 bg-cream transition-[max-height,opacity] duration-700 lg:block ${mega ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0"
            }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        >
          <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_1fr_360px] gap-12 px-10 py-12">
            <div>
              <p className="eyebrow mb-6 text-muted-foreground">Categories</p>
              <ul className="grid grid-cols-2 gap-x-10 gap-y-3 font-serif text-2xl">
                {CATEGORY_LINKS.map((c) => (
                  <li key={c}>
                    <Link href={`/shop?category=${c.toLowerCase()}`} className="line-link">
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="eyebrow line-link mt-8 inline-flex items-center gap-2 text-burgundy">
                Shop all <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div>
              <p className="eyebrow mb-6 text-muted-foreground">Edits</p>
              <ul className="space-y-3 font-serif text-2xl">
                {["Statement Pieces", "Weekend Collection", "Vacation Collection", "Limited Drops"].map((c) => (
                  <li key={c}>
                    <Link href="/collections" className="line-link">
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/collections" className="zoom-media group relative block">
              <img src="/assets/menu.jpg" alt="Featured collection" loading="lazy" width={900} height={1100} className="h-[300px] w-full object-cover" />
              <span className="eyebrow absolute bottom-5 left-5 text-cream">The Champagne Hour</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-cream transition-all duration-700 ${search ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
      >
        <div className="mx-auto flex h-full max-w-4xl flex-col justify-center px-6">
          <button aria-label="Close search" onClick={() => setSearch(false)} className="absolute right-6 top-7">
            <X className="size-6" strokeWidth={1.2} />
          </button>
          <h2 className="display text-[clamp(2.5rem,7vw,5.5rem)]">What are you looking for?</h2>
          <form onSubmit={submitSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dresses, silk, linen…"
              className="mt-10 w-full border-b border-foreground/30 bg-transparent pb-4 font-serif text-2xl outline-none placeholder:text-muted-foreground focus:border-rose"
            />
          </form>
          <p className="eyebrow mt-10 text-muted-foreground">Popular searches</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {POPULAR.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setSearch(false);
                  router.push(`/search?q=${encodeURIComponent(p)}`);
                }}
                className="border border-border px-4 py-2 text-xs tracking-widest uppercase transition-colors duration-500 hover:bg-foreground hover:text-cream"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] bg-charcoal text-cream transition-transform duration-700 lg:hidden ${mobile ? "translate-y-0" : "-translate-y-full"
          }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <span className="display text-xl tracking-[0.14em]">CEYLON</span>
          <button aria-label="Close menu" onClick={() => setMobile(false)}>
            <X className="size-6" strokeWidth={1.2} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 px-5 pt-6">
          {[
            { label: "New In", href: "/shop?sort=newest" },
            { label: "Shop", href: "/shop" },
            { label: "Collections", href: "/collections" },
            { label: "Sale", href: "/shop?tag=sale" },
            ...(user
              ? [
                  { label: "My Orders", href: "/account/orders" },
                  { label: "Profile Settings", href: "/account/profile" },
                ]
              : [{ label: "Sign In", href: "/login" }]),
          ].map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMobile(false)} className="display text-5xl">
              {item.label}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} className="display text-left text-5xl text-blush">
              Log Out
            </button>
          )}
        </nav>
        <div className="absolute inset-x-0 bottom-0 flex gap-6 border-t border-cream/15 px-5 py-6 eyebrow">
          <button onClick={() => { setMobile(false); setSearch(true); }}>Search</button>
          <Link href={user ? "/account/profile" : "/login"} onClick={() => setMobile(false)}>{user ? "Account" : "Sign In"}</Link>
          <Link href="/account/wishlist" onClick={() => setMobile(false)}>Wishlist</Link>
          <button onClick={() => { setMobile(false); openDrawer(); }}>Bag</button>
        </div>
      </div>
    </>
  );
}
