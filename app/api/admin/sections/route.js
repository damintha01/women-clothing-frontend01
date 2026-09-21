import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptSectionConfig } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/sections`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load sections.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json({ sections: raw.map(adaptSectionConfig) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) {
    return NextResponse.json({ error: { message: "Please sign in." } }, { status: 401 });
  }
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not create this section.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json(
    { section: adaptSectionConfig(raw) },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
  relayCookies(backendResponse, response);
  return response;
}
