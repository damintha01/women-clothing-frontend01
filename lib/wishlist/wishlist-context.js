"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/lib/toast";

const STORAGE_KEY = "ceylon:wishlist";
const WishlistContext = React.createContext(null);

function readLocalIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalIds(ids) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Best-effort only — a full/blocked localStorage just means the heart resets on reload.
  }
}

/**
 * The backend only supports wishlist for signed-in users (no guest concept, unlike cart).
 * Guests still get a working heart button, backed by localStorage; once signed in the same
 * hook switches to the backend-synced list so /account/wishlist stays the source of truth.
 */
export function WishlistProvider({ children }) {
  const { user, isLoading: authLoading } = useAuth();
  const [ids, setIds] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    if (!user) {
      setIds(readLocalIds());
      setProducts([]);
      setIsLoading(false);
      return;
    }

    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users/me/wishlist", { cache: "no-store" });
        if (!response.ok || cancelled) return;
        const data = await response.json();
        if (cancelled) return;
        setProducts(data.products);
        setIds(data.products.map((p) => p.id));
      } catch {
        // Leave the list empty until the next toggle retries it.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const toggle = React.useCallback(
    async (product) => {
      const wished = ids.includes(product.id);

      if (!user) {
        const next = wished ? ids.filter((id) => id !== product.id) : [...ids, product.id];
        setIds(next);
        writeLocalIds(next);
        return;
      }

      const previousIds = ids;
      const previousProducts = products;
      setIds(wished ? ids.filter((id) => id !== product.id) : [...ids, product.id]);
      setProducts(wished ? products.filter((p) => p.id !== product.id) : [...products, product]);

      try {
        const response = await fetch("/api/users/me/wishlist", {
          method: wished ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (!response.ok) throw new Error("Could not update your wishlist.");
        const data = await response.json();
        setProducts(data.products);
        setIds(data.products.map((p) => p.id));
      } catch {
        setIds(previousIds);
        setProducts(previousProducts);
        toast.error("Could not update your wishlist.");
      }
    },
    [ids, products, user],
  );

  const value = React.useMemo(
    () => ({ ids, products, isLoading, toggle, isWished: (id) => ids.includes(id) }),
    [ids, products, isLoading, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
