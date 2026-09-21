import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptCart, emptyCart } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, fetchBackend } from "@/lib/backend/http";

/**
 * Called once right after a guest signs in. The backend's merge endpoint
 * folds the guest cart into the user's cart but only returns a status
 * message, so we fetch the resulting cart in a second call to hand callers
 * something they can render immediately.
 */
export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const mergeResponse = await fetchBackend(`${BACKEND_URL}/api/cart/merge`, {
    method: "POST",
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!mergeResponse.ok) {
    const message = await backendErrorMessage(mergeResponse, "Could not merge your bag.");
    const response = NextResponse.json({ error: { message } }, { status: mergeResponse.status });
    relayCookies(mergeResponse, response);
    return response;
  }

  const cartResponse = await fetchBackend(`${BACKEND_URL}/api/cart`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  const raw = cartResponse.ok ? await cartResponse.json() : null;
  const cart = raw && "items" in raw ? adaptCart(raw) : emptyCart();

  const response = NextResponse.json({ cart }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(mergeResponse, response);
  relayCookies(cartResponse, response);
  return response;
}
