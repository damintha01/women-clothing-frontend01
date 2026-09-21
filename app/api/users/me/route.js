import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptUser } from "@/lib/backend/adapters";
import { relayCookies, backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

function unauthorized() {
  return NextResponse.json({ error: { message: "Please sign in." } }, { status: 401 });
}

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/users/me`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) return unauthorized();
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load your profile.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json({ profile: adaptUser(raw) }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(input),
    redirect: "manual",
    cache: "no-store",
  });

  if (isAuthRedirect(backendResponse)) return unauthorized();
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not update your profile.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const response = NextResponse.json({ profile: adaptUser(raw) }, { headers: { "Cache-Control": "no-store" } });
  relayCookies(backendResponse, response);
  return response;
}
