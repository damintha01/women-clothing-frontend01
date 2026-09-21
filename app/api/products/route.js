import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptProduct } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = new URL(`${BACKEND_URL}/api/products`);
  for (const key of ["search", "tag", "featured", "page", "limit"]) {
    const value = searchParams.get(key);
    if (value) url.searchParams.set(key, value);
  }

  const backendResponse = await fetchBackend(url, { cache: "no-store" });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load products.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { products: raw.products.map(adaptProduct), pagination: raw.pagination },
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

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) {
    return NextResponse.json({ error: { message: "Please sign in." } }, { status: 401 });
  }
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not create this product.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json(
    { product: adaptProduct(raw) },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
  relayCookies(backendResponse, response);
  return response;
}
