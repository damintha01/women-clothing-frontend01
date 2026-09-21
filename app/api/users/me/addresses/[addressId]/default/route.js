import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptAddress } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

export async function POST(request, { params }) {
  const { addressId } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/users/me/addresses/${addressId}/default`, {
    method: "POST",
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) {
    return NextResponse.json({ error: { message: "Please sign in." } }, { status: 401 });
  }
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not set this as your default address.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json({ addresses: raw.map(adaptAddress) }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}
