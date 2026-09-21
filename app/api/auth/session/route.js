import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { relayCookies, fetchBackend } from "@/lib/backend/http";

function adaptSessionUser(raw) {
  if (!raw?.user?.id) return null;
  return {
    id: raw.user.id,
    name: raw.user.name ?? "",
    email: raw.user.email ?? "",
    role: raw.user.role ?? "customer",
  };
}

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/auth/session`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  const raw = await backendResponse.json().catch(() => null);
  const response = NextResponse.json(
    { user: adaptSessionUser(raw) },
    { headers: { "Cache-Control": "no-store" } },
  );
  relayCookies(backendResponse, response);
  return response;
}
