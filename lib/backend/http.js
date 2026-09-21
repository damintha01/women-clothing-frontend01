const DEFAULT_BACKEND_TIMEOUT_MS = 10_000;

/**
 * Wraps `fetch` with a hard timeout. Without this, a misconfigured or unreachable backend
 * (e.g. a broken MongoDB connection string) hangs for as long as the backend's own driver
 * takes to give up — which can be minutes — freezing whatever page or action triggered it.
 *
 * On timeout or network failure this resolves to a synthetic 503 `Response` shaped like the
 * backend's own `{ error: "message" }` convention, rather than throwing — every existing call
 * site already does `if (!response.ok) { ...backendErrorMessage(response, fallback) }`, so it
 * degrades to a fast, clean error through that same path with no other code changes needed.
 */
export async function fetchBackend(url, options = {}, timeoutMs = DEFAULT_BACKEND_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "The backend took too long to respond."
        : "Could not reach the backend.";
    return new Response(JSON.stringify({ error: message }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * The backend identifies guest carts via an httpOnly `guestId` cookie it sets
 * itself. Since the browser only ever talks to this frontend, we relay that
 * cookie through on every request so the backend keeps recognizing the same
 * session.
 */
export function relayCookies(backendResponse, ourResponse) {
  const cookies = backendResponse.headers.getSetCookie?.() ?? [];
  for (const cookie of cookies) {
    ourResponse.headers.append("set-cookie", cookie);
  }
}

export async function backendErrorMessage(response, fallback) {
  const body = await response.json().catch(() => null);
  return body?.error ?? fallback;
}

/**
 * Extracts just the `name=value` pairs from a response's Set-Cookie headers, suitable for
 * reuse as a `Cookie` request header on a *follow-up* server-to-server fetch — e.g. NextAuth's
 * credentials sign-in needs its CSRF cookie (set by `GET /api/auth/csrf`) presented back on the
 * subsequent `POST /api/auth/callback/credentials` call. `fetch` never persists cookies between
 * calls itself, so this manual chaining stands in for what a browser would normally do.
 */
export function extractCookiePairs(response) {
  const cookies = response.headers.getSetCookie?.() ?? [];
  return cookies.map((cookie) => cookie.split(";")[0]).join("; ");
}

/**
 * The backend gates `/api/users/me/*` with `next-auth/middleware`'s `withAuth`, which — for an
 * unauthenticated request — 307-redirects to `/api/auth/signin` rather than letting the route
 * handler return its own clean `401`. That target doesn't even resolve to a page on this
 * API-only backend, and `fetch()` follows redirects by default, so an expired/missing session
 * would otherwise surface as a confusing 404 instead of "please sign in." Callers must pass
 * `redirect: "manual"` on the backend fetch and check this before doing anything else with the
 * response.
 */
export function isAuthRedirect(response) {
  if (response.status !== 307 && response.status !== 302) return false;
  const location = response.headers.get("location") ?? "";
  return location.includes("/api/auth/signin");
}
