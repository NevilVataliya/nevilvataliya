import { NextRequest, NextResponse } from "next/server";
import { getTechStacks, addTechStack, deleteTechStack, updateTechStack } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import type { TechStack } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const techStacks = await getTechStacks();
    return NextResponse.json(
      (techStacks as TechStack[]).map((t) => ({
        ...t,
        _id: t._id?.toString(),
        createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : undefined,
        updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString() : undefined,
      }))
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch tech stacks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body?.name || typeof body.name !== "string") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!body?.category || typeof body.category !== "string") {
      return NextResponse.json({ error: "category is required" }, { status: 400 });
    }
    const result = await addTechStack(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to add tech stack" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await deleteTechStack(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to delete tech stack" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const patch: Partial<Pick<TechStack, "name" | "category">> = {};

    if ("name" in (body as Record<string, unknown>)) {
      if (!body?.name || typeof body.name !== "string") {
        return NextResponse.json({ error: "name must be a string" }, { status: 400 });
      }
      patch.name = body.name;
    }

    if ("category" in (body as Record<string, unknown>)) {
      if (!body?.category || typeof body.category !== "string") {
        return NextResponse.json({ error: "category must be a string" }, { status: 400 });
      }
      const cat = body.category as TechStack["category"];
      const allowed: TechStack["category"][] = ["languages", "backend", "frontend", "tools", "concepts"];
      if (!allowed.includes(cat)) {
        return NextResponse.json({ error: "category must be one of: languages, backend, frontend, tools, concepts" }, { status: 400 });
      }
      patch.category = cat;
    }

    if (!Object.keys(patch).length) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const result = await updateTechStack(id, patch);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update tech stack" }, { status: 500 });
  }
}
