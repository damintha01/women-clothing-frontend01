import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { adaptReviews } from "@/lib/backend/adapters";
import { resolveProductId } from "@/lib/backend/product-detail";
import { backendErrorMessage, isAuthRedirect, fetchBackend } from "@/lib/backend/http";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const productId = await resolveProductId(slug);
  if (!productId) {
    return NextResponse.json({ error: { message: "Product not found." } }, { status: 404 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/products/${productId}/reviews`, {
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not load reviews.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  const { rating, reviews } = adaptReviews(raw);
  return NextResponse.json({ rating, reviews }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request, { params }) {
  const { slug } = await params;
  const cookieHeader = request.headers.get("cookie") ?? "";

  const productId = await resolveProductId(slug);
  if (!productId) {
    return NextResponse.json({ error: { message: "Product not found." } }, { status: 404 });
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const backendResponse = await fetchBackend(`${BACKEND_URL}/api/products/${productId}/reviews`, {
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
    return NextResponse.json({ error: { message: "Please sign in to leave a review." } }, { status: 401 });
  }
  if (!backendResponse.ok) {
    const message = await backendErrorMessage(backendResponse, "Could not submit your review.");
    return NextResponse.json({ error: { message } }, { status: backendResponse.status });
  }

  const raw = await backendResponse.json();
  return NextResponse.json(
    { review: { id: raw._id, author: raw.name, rating: raw.rating, content: raw.comment, createdAt: raw.createdAt } },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
