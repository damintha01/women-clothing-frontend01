import { NextResponse } from "next/server";
import { getBackendProductDetail } from "@/lib/backend/product-detail";

export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const product = await getBackendProductDetail(slug);

    if (!product) {
      return NextResponse.json(
        { error: { message: `No product found for "${slug}".`, code: "NOT_FOUND" } },
        { status: 404 },
      );
    }

    return NextResponse.json({ product }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load this product.";
    return NextResponse.json({ error: { message } }, { status: 502 });
  }
}
