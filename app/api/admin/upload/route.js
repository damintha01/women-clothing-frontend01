import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { backendErrorMessage, fetchBackend } from "@/lib/backend/http";

// Image uploads can legitimately take longer than the default timeout on a slow connection.
const UPLOAD_TIMEOUT_MS = 30_000;

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const { searchParams } = new URL(request.url);

  const incoming = await request.formData();
  const outgoing = new FormData();
  for (const [key, value] of incoming.entries()) {
    outgoing.append(key, value);
  }

  const url = new URL(`${BACKEND_URL}/api/upload`);
  const folder = searchParams.get("folder");
  if (folder) url.searchParams.set("folder", folder);

  const backendResponse = await fetchBackend(
    url,
    {
      method: "POST",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      body: outgoing,
      cache: "no-store",
    },
    UPLOAD_TIMEOUT_MS,
  );

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not upload this image.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(raw, { status: 201, headers: { "Cache-Control": "no-store" } });
}
