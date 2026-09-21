"use client";

import * as React from "react";
import { toast } from "@/lib/toast";

function emptyCart() {
  return { items: [], itemCount: 0, subtotal: 0, discount: 0, total: 0, currency: "LKR" };
}

/** Recomputes derived totals after an optimistic, client-only edit to `items`. */
function recalcTotals(cart) {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - cart.discount);
  return { ...cart, itemCount, subtotal, total };
}

async function parseError(response, fallback) {
  const body = await response.json().catch(() => null);
  return body?.error?.message ?? fallback;
}

const CartContext = React.createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = React.useState(emptyCart());
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  /**
   * Bumped by every mutation (add/update/remove/clear/coupon/merge) the moment it
   * starts. The initial background GET below can resolve *after* a fast add-to-cart
   * click already updated the cart from its own POST response — without this guard
   * that stale GET would land last and clobber the correct cart back to empty.
   */
  const cartVersionRef = React.useRef(0);

  React.useEffect(() => {
    let cancelled = false;
    const versionAtStart = cartVersionRef.current;
    (async () => {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        if (!response.ok || cancelled) return;
        const data = await response.json();
        if (!cancelled && cartVersionRef.current === versionAtStart) setCart(data.cart);
      } catch {
        // A failed initial load just leaves the cart empty until the next mutation retries it.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openDrawer = React.useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = React.useCallback(() => setIsDrawerOpen(false), []);

  const addItem = React.useCallback(
    async (input, itemLabel) => {
      cartVersionRef.current += 1;
      const previousCart = cart;
      const existingIndex = cart.items.findIndex(
        (item) => item.productId === input.productId && item.variantId === input.variantId,
      );

      const optimisticItems =
        existingIndex > -1
          ? cart.items.map((item, index) =>
              index === existingIndex ? { ...item, quantity: item.quantity + input.quantity } : item,
            )
          : [
              ...cart.items,
              {
                id: `optimistic-${input.productId}-${input.variantId}`,
                productId: input.productId,
                variantId: input.variantId,
                slug: "",
                name: input.name,
                image: input.image,
                size: input.size,
                color: input.color,
                price: input.price,
                currency: cart.currency,
                quantity: input.quantity,
              },
            ];

      setCart(recalcTotals({ ...cart, items: optimisticItems }));

      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          throw new Error(await parseError(response, "Could not add this item to your bag."));
        }
        const data = await response.json();
        setCart(data.cart);
        toast.success(`${itemLabel} added to your bag`);
      } catch (error) {
        setCart(previousCart);
        const message = error instanceof Error ? error.message : "Could not add this item to your bag.";
        toast.error(message);
        throw error;
      }
    },
    [cart],
  );

  const updateQuantity = React.useCallback(
    async (itemId, quantity) => {
      cartVersionRef.current += 1;
      const previousCart = cart;
      setCart(
        recalcTotals({
          ...cart,
          items: cart.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        }),
      );

      try {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        if (!response.ok) {
          throw new Error(await parseError(response, "Could not update this item's quantity."));
        }
        const data = await response.json();
        setCart(data.cart);
      } catch (error) {
        setCart(previousCart);
        toast.error(error instanceof Error ? error.message : "Could not update this item's quantity.");
      }
    },
    [cart],
  );

  const removeItem = React.useCallback(
    async (itemId, itemLabel) => {
      cartVersionRef.current += 1;
      const previousCart = cart;
      setCart(recalcTotals({ ...cart, items: cart.items.filter((item) => item.id !== itemId) }));

      try {
        const response = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error(await parseError(response, "Could not remove this item."));
        }
        const data = await response.json();
        setCart(data.cart);
        toast.success(`${itemLabel} removed from your bag`);
      } catch (error) {
        setCart(previousCart);
        toast.error(error instanceof Error ? error.message : "Could not remove this item.");
      }
    },
    [cart],
  );

  const clearCart = React.useCallback(async () => {
    cartVersionRef.current += 1;
    const previousCart = cart;
    setCart(emptyCart());

    try {
      const response = await fetch("/api/cart/clear", { method: "DELETE" });
      if (!response.ok) {
        throw new Error(await parseError(response, "Could not clear your bag."));
      }
      const data = await response.json();
      setCart(data.cart);
      toast.success("Your bag has been cleared");
    } catch (error) {
      setCart(previousCart);
      toast.error(error instanceof Error ? error.message : "Could not clear your bag.");
    }
  }, [cart]);

  const applyCoupon = React.useCallback(async (code) => {
    cartVersionRef.current += 1;
    try {
      const response = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error(await parseError(response, "Could not apply that coupon."));
      }
      const data = await response.json();
      setCart(data.cart);
      toast.success(`Coupon ${code.toUpperCase()} applied`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not apply that coupon.");
      throw error;
    }
  }, []);

  const removeCoupon = React.useCallback(async () => {
    cartVersionRef.current += 1;
    try {
      const response = await fetch("/api/cart/coupon", { method: "DELETE" });
      if (!response.ok) {
        throw new Error(await parseError(response, "Could not remove the coupon."));
      }
      const data = await response.json();
      setCart(data.cart);
      toast.success("Coupon removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove the coupon.");
    }
  }, []);

  const mergeGuestCart = React.useCallback(async () => {
    cartVersionRef.current += 1;
    const previousItemCount = cart.itemCount;
    try {
      const response = await fetch("/api/cart/merge", { method: "POST" });
      if (!response.ok) return;
      const data = await response.json();
      setCart(data.cart);
      if (data.cart.itemCount > previousItemCount) {
        toast.success("We've added your saved items to your bag");
      }
    } catch {
      // Best-effort — the guest cart simply stays put until the next successful merge attempt.
    }
  }, [cart.itemCount]);

  const refresh = React.useCallback(async () => {
    cartVersionRef.current += 1;
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setCart(data.cart);
    } catch {
      // Best-effort — the cart just keeps whatever state it had before the refresh attempt.
    }
  }, []);

  const value = React.useMemo(
    () => ({
      cart,
      isLoading,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      mergeGuestCart,
      refresh,
    }),
    [
      cart,
      isLoading,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      mergeGuestCart,
      refresh,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
