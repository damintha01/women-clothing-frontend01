import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  if (!input.orderId) {
    return NextResponse.json({ error: { message: "Missing order id." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/payments/payhere/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({ orderId: input.orderId }),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not start payment.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const data = await backendResponse.json();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
