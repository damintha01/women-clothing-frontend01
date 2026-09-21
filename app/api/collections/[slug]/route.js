import { NextResponse } from "next/server";
import { getBackendCollectionDetail } from "@/lib/backend/collections";

export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const result = await getBackendCollectionDetail(slug);
    if (!result) {
      return NextResponse.json(
        { error: { message: `No collection found for "${slug}".`, code: "NOT_FOUND" } },
        { status: 404 },
      );
    }
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load this collection.";
    return NextResponse.json({ error: { message } }, { status: 502 });
  }
}
