import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptOrder } from "@/lib/backend/adapters";
import { backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const { searchParams } = new URL(request.url);

  const url = new URL(`${BACKEND_URL}/api/orders`);
  for (const key of ["status", "page", "limit"]) {
    const value = searchParams.get(key);
    if (value) url.searchParams.set(key, value);
  }

  const backendResponse = await fetchBackend(url, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load orders.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { orders: raw.orders.map(adaptOrder), pagination: raw.pagination },
    { headers: { "Cache-Control": "no-store" } },
  );
}
