import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { relayCookies, extractCookiePairs, fetchBackend } from "@/lib/backend/http";

/**
 * The backend's login IS NextAuth's own credentials flow — there's no separate plain REST
 * login endpoint. Rather than reimplementing NextAuth's JWT/JWE cookie encoding ourselves
 * (fragile, version-specific), we drive its real REST protocol server-to-server:
 *   1. GET /api/auth/csrf       -> csrfToken + a CSRF cookie
 *   2. POST /api/auth/callback/credentials (form-encoded, carrying that CSRF cookie + token)
 *      -> on success, sets the real `next-auth.session-token` cookie; on failure, returns a
 *         `{ url }` whose querystring carries `?error=CredentialsSignin` (NextAuth v4 quirk —
 *         it responds 200 either way, so failure must be read out of that url, not the status).
 * This guarantees the cookie we hand back to the browser is byte-identical to what a "real"
 * NextAuth login would produce.
 */
export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const csrfResponse = await fetchBackend(`${BACKEND_URL}/api/auth/csrf`, { cache: "no-store" });
  const csrfCookie = extractCookiePairs(csrfResponse);
  const csrfData = await csrfResponse.json().catch(() => null);

  if (!csrfData?.csrfToken) {
    return NextResponse.json(
      { error: { message: "Could not start sign-in. Please try again." } },
      { status: 502 },
    );
  }

  const callbackResponse = await fetchBackend(`${BACKEND_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(csrfCookie ? { cookie: csrfCookie } : {}),
    },
    body: new URLSearchParams({
      email: input.email,
      password: input.password,
      csrfToken: csrfData.csrfToken,
      json: "true",
    }).toString(),
    redirect: "manual",
    cache: "no-store",
  });

  let resultUrl = null;
  if (callbackResponse.status >= 300 && callbackResponse.status < 400) {
    resultUrl = callbackResponse.headers.get("location");
  } else {
    const data = await callbackResponse.json().catch(() => null);
    resultUrl = data?.url ?? null;
  }

  let errorCode = "Unknown";
  if (resultUrl) {
    try {
      errorCode = new URL(resultUrl).searchParams.get("error");
    } catch {
      errorCode = "Unknown";
    }
  }
  const sessionCookie = extractCookiePairs(callbackResponse);

  if (errorCode || !sessionCookie) {
    const message =
      errorCode === "CredentialsSignin" ? "Invalid email or password." : "Could not sign in. Please try again.";
    return NextResponse.json({ error: { message } }, { status: 401 });
  }

  const sessionResponse = await fetchBackend(`${BACKEND_URL}/api/auth/session`, {
    headers: { cookie: sessionCookie },
    cache: "no-store",
  });
  const sessionData = await sessionResponse.json().catch(() => null);

  if (!sessionData?.user?.id) {
    return NextResponse.json(
      { error: { message: "Could not sign in. Please try again." } },
      { status: 502 },
    );
  }

  const user = {
    id: sessionData.user.id,
    name: sessionData.user.name ?? "",
    email: sessionData.user.email ?? "",
    role: sessionData.user.role ?? "customer",
  };

  const response = NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(callbackResponse, response);
  return response;
}
