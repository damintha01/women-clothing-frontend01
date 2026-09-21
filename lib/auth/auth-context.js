"use client";

import * as React from "react";
import { useCart } from "@/lib/cart/cart-context";

const AuthContext = React.createContext(null);

async function parseError(response, fallback) {
  const body = await response.json().catch(() => null);
  return body?.error?.message ?? fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { mergeGuestCart } = useCart();

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok || cancelled) return;
        const data = await response.json();
        if (!cancelled) setUser(data.user);
      } catch {
        // A failed session check just leaves the visitor logged out until the next check.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = React.useCallback(
    async (input) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error(await parseError(response, "Invalid email or password."));
      }
      const data = await response.json();
      setUser(data.user);
      void mergeGuestCart();
      return data.user;
    },
    [mergeGuestCart],
  );

  const register = React.useCallback(
    async (input) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error(await parseError(response, "Could not create your account."));
      }
      // Registration alone doesn't establish a session server-side — chain an immediate
      // login with the same credentials so signing up feels like one continuous action.
      await login({ email: input.email, password: input.password });
    },
    [login],
  );

  const logout = React.useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best-effort — clearing local state below still logs the user out of this tab.
    }
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
