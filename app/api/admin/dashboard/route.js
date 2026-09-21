import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptOrder } from "@/lib/backend/adapters";
import { backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/dashboard/stats`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load dashboard stats.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { ...raw, recentOrders: raw.recentOrders.map(adaptOrder) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
