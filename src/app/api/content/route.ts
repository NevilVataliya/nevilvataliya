import { NextRequest, NextResponse } from "next/server";
import { getPortfolioContent, upsertPortfolioContent } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import type { PortfolioContent } from "@/lib/db";

function serializeContent(doc: PortfolioContent) {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
  };
}

export async function GET() {
  try {
    const content = await getPortfolioContent();
    if (!content) return NextResponse.json(null);
    return NextResponse.json(serializeContent(content));
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    // Enforce singleton key
    body.slug = "default";

    const result = await upsertPortfolioContent(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
