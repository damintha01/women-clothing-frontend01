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

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/upload/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not delete this image.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  return NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
}
