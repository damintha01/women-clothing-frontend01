import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptProduct } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

function unauthorized() {
  return NextResponse.json({ error: { message: "Please sign in." } }, { status: 401 });
}

export async function GET(request, { params }) {
  const { id } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/products/${id}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load this product.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { product: { ...adaptProduct(raw), variants: (raw.variants ?? []).map((v) => ({ id: v._id, size: v.size, color: v.color, sku: v.sku, stock: v.stock })) } },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/products/${id}`, {
    method: "PATCH",
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
    const message = await backendErrorMessage(backendResponse, "Could not update this product.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json({ product: adaptProduct(raw) }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) return unauthorized();
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not delete this product.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  return NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
}
