import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptCollection } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, fetchBackend } from "@/lib/backend/http";

export async function GET() {
  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/collections`, { cache: "no-store" });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load collections.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { collections: raw.map((c) => adaptCollection(c, 0)) },
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

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not create this collection.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json(
    { collection: adaptCollection(raw, 0) },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
  relayCookies(backendResponse, response);
  return response;
}
