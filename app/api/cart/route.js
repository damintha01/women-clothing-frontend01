import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptCart, emptyCart } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/cart`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Failed to load your bag.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const cart = "items" in raw ? adaptCart(raw) : emptyCart();

  const response = NextResponse.json({ cart }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not add this item to your bag.");
    const response = NextResponse.json({ error: { message } }, { status: backendResponse.status });
    relayCookies(backendResponse, response);
    return response;
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json(
    { cart: adaptCart(raw) },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
  relayCookies(backendResponse, response);
  return response;
}
