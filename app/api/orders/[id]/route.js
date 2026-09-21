import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptOrder } from "@/lib/backend/adapters";
import { backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

export async function GET(request, { params }) {
  const { id } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/orders/${id}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) {
    return NextResponse.json({ error: { message: "Please sign in." } }, { status: 401 });
  }
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load this order.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json({ order: adaptOrder(raw) }, { headers: { "Cache-Control": "no-store" } });
}
