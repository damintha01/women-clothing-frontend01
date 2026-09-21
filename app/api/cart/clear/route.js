import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptCart, emptyCart } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function DELETE(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/cart/clear`, {
    method: "DELETE",
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not clear your bag.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const response = NextResponse.json({ cart: emptyCart() }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}
