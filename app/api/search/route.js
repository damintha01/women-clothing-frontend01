import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptProduct } from "@/lib/backend/adapters";
import { backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = new URL(`${BACKEND_URL}/api/search`);
  for (const key of ["q", "minPrice", "maxPrice", "tag", "collection", "sort", "page", "limit"]) {
    const value = searchParams.get(key);
    if (value) url.searchParams.set(key, value);
  }

  const backendResponse = await fetchBackend(url, { cache: "no-store" });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Search failed.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    {
      products: raw.products.map(adaptProduct),
      query: raw.query,
      pagination: raw.pagination,
      filters: raw.filters,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
