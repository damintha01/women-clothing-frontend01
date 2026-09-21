import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { relayCookies, backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/payments/intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not start checkout.");
    const response = NextResponse.json({ error: { message } }, { status: backendResponse.status });
    relayCookies(backendResponse, response);
    return response;
  }

  const data = await backendResponse.json();
  const response = NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}
