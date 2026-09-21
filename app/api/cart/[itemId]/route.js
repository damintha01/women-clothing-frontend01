import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptCart } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function PATCH(request, { params }) {
  const { itemId } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/cart/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not update this item's quantity.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json({ cart: adaptCart(raw) }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}

export async function DELETE(request, { params }) {
  const { itemId } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/cart/${itemId}`, {
    method: "DELETE",
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not remove this item.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json({ cart: adaptCart(raw) }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}
