import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { backendErrorMessage, fetchBackend } from "@/lib/backend/http";

/**
 * Registration alone doesn't sign the user in (the backend endpoint just creates the row) —
 * the client is expected to immediately follow up with POST /api/auth/login using the same
 * credentials for a seamless "register -> logged in" flow.
 */
export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not create your account.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const user = {
    id: raw.user._id,
    name: raw.user.name,
    email: raw.user.email,
    role: raw.user.role,
  };

  return NextResponse.json({ message: raw.message, user }, { status: 201 });
}
