import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptProduct } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

function unauthorized() {
  return NextResponse.json({ error: { message: "Please sign in." } }, { status: 401 });
}

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/users/me/wishlist`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) return unauthorized();
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load your wishlist.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { products: raw.map(adaptProduct) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/users/me/wishlist`, {
    method: "POST",
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
    const message = await backendErrorMessage(backendResponse, "Could not update your wishlist.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json(
    { products: raw.map(adaptProduct) },
    { headers: { "Cache-Control": "no-store" } },
  );
  relayCookies(backendResponse, response);
  return response;
}

export async function DELETE(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/users/me/wishlist`, {
    method: "DELETE",
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
    const message = await backendErrorMessage(backendResponse, "Could not update your wishlist.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { products: raw.map(adaptProduct) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
