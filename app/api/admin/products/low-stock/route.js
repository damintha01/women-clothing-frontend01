import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptProduct } from "@/lib/backend/adapters";
import { backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const { searchParams } = new URL(request.url);
  const threshold = searchParams.get("threshold");

  const url = new URL(`${BACKEND_URL}/api/products/low-stock`);
  if (threshold) url.searchParams.set("threshold", threshold);

  const backendResponse = await fetchBackend(url, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load low-stock products.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { count: raw.count, products: raw.products.map(adaptProduct) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
