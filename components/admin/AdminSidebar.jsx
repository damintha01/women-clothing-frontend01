"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Sections", href: "/admin/sections" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="border-b border-border pb-6 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:pb-0">
      <div className="flex h-full flex-col p-6">
        <div>
          <p className="text-lg font-semibold tracking-tight">Ceylon Admin</p>
          <p className="mt-1 text-xs text-muted-foreground">{user?.name}</p>
        </div>
        <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded px-3 py-2 text-sm transition-colors ${
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-8">
          <Link href="/" target="_blank" className="text-xs text-muted-foreground hover:text-foreground">
            View storefront ↗
          </Link>
          <button onClick={logout} className="text-left text-xs text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
