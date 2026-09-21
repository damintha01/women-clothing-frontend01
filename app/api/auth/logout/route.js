import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { relayCookies, extractCookiePairs, fetchBackend } from "@/lib/backend/http";

/** Mirrors the login route's approach: drives NextAuth's real CSRF-protected signout endpoint. */
export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const csrfResponse = await fetchBackend(`${BACKEND_URL}/api/auth/csrf`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });
  const csrfCookie = extractCookiePairs(csrfResponse);
  const csrfData = await csrfResponse.json().catch(() => null);

  if (!csrfData?.csrfToken) {
    return NextResponse.json({ ok: true });
  }

  const combinedCookie = [cookieHeader, csrfCookie].filter(Boolean).join("; ");

  const signoutResponse = await fetchBackend(`${BACKEND_URL}/api/auth/signout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      cookie: combinedCookie,
    },
    body: new URLSearchParams({ csrfToken: csrfData.csrfToken, json: "true" }).toString(),
    cache: "no-store",
  });

  const response = NextResponse.json({ ok: true });
  relayCookies(signoutResponse, response);
  return response;
}
