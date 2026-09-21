import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptProduct } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

function unauthorized() {
  return NextResponse.json({ error: { message: "Please sign in." } }, { status: 401 });
}

async function proxy(request, { params }, method) {
  const { id } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/products/${id}/variants`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) return unauthorized();
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not update variants.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json({ product: adaptProduct(raw) }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}

export function POST(request, ctx) {
  return proxy(request, ctx, "POST");
}
export function PATCH(request, ctx) {
  return proxy(request, ctx, "PATCH");
}
export function DELETE(request, ctx) {
  return proxy(request, ctx, "DELETE");
}
