import { NextRequest, NextResponse } from "next/server";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Project } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const projects = await getProjects();
    return NextResponse.json(
      (projects as Project[]).map((p) => ({
        ...p,
        _id: p._id?.toString(),
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
      }))
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body?.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!body?.description || typeof body.description !== "string") {
      return NextResponse.json({ error: "description is required" }, { status: 400 });
    }
    if (!Array.isArray(body?.technologies)) {
      return NextResponse.json({ error: "technologies must be an array" }, { status: 400 });
    }

    if (body?.longDescription !== undefined && typeof body.longDescription !== "string") {
      return NextResponse.json({ error: "longDescription must be a string" }, { status: 400 });
    }
    if (body?.imageUrl !== undefined && typeof body.imageUrl !== "string") {
      return NextResponse.json({ error: "imageUrl must be a string" }, { status: 400 });
    }
    if (body?.role !== undefined && typeof body.role !== "string") {
      return NextResponse.json({ error: "role must be a string" }, { status: 400 });
    }
    if (body?.highlights !== undefined) {
      if (!Array.isArray(body.highlights) || body.highlights.some((h: unknown) => typeof h !== "string")) {
        return NextResponse.json({ error: "highlights must be an array of strings" }, { status: 400 });
      }
    }

    const payload = {
      title: body.title,
      description: body.description,
      technologies: body.technologies,
      demoUrl: typeof body.demoUrl === "string" && body.demoUrl ? body.demoUrl : undefined,
      githubUrl: typeof body.githubUrl === "string" && body.githubUrl ? body.githubUrl : undefined,
      imageUrl: typeof body.imageUrl === "string" && body.imageUrl ? body.imageUrl : undefined,
      longDescription: typeof body.longDescription === "string" && body.longDescription ? body.longDescription : undefined,
      role: typeof body.role === "string" && body.role ? body.role : undefined,
      highlights: Array.isArray(body.highlights) ? (body.highlights as string[]).map((h) => h.trim()).filter(Boolean) : undefined,
    };
    const result = await addProject(payload);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
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
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    if (body?.technologies !== undefined && (!Array.isArray(body.technologies) || body.technologies.some((t: unknown) => typeof t !== "string"))) {
      return NextResponse.json({ error: "technologies must be an array of strings" }, { status: 400 });
    }
    if (body?.highlights !== undefined && (!Array.isArray(body.highlights) || body.highlights.some((h: unknown) => typeof h !== "string"))) {
      return NextResponse.json({ error: "highlights must be an array of strings" }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (typeof body.title === "string") patch.title = body.title;
    if (typeof body.description === "string") patch.description = body.description;
    if (Array.isArray(body.technologies)) patch.technologies = body.technologies.map((t: string) => t.trim()).filter(Boolean);
    if (typeof body.demoUrl === "string") patch.demoUrl = body.demoUrl || undefined;
    if (typeof body.githubUrl === "string") patch.githubUrl = body.githubUrl || undefined;
    if (typeof body.imageUrl === "string") patch.imageUrl = body.imageUrl || undefined;
    if (typeof body.longDescription === "string") patch.longDescription = body.longDescription || undefined;
    if (typeof body.role === "string") patch.role = body.role || undefined;
    if (Array.isArray(body.highlights)) patch.highlights = body.highlights.map((h: string) => h.trim()).filter(Boolean);

    const result = await updateProject(id, patch);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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

    const result = await deleteProject(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
