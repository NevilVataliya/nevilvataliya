import { NextRequest, NextResponse } from "next/server";
import { getExperiences, addExperience, updateExperience, deleteExperience } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Experience } from "@/lib/db";

export async function GET() {
  try {
    const experiences = await getExperiences();
    return NextResponse.json(
      (experiences as Experience[]).map((e) => ({
        ...e,
        _id: e._id?.toString(),
        createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : undefined,
        updatedAt: e.updatedAt ? new Date(e.updatedAt).toISOString() : undefined,
      }))
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body?.type || !["work", "leadership", "project"].includes(body.type)) {
      return NextResponse.json({ error: "type must be 'work', 'leadership', or 'project'" }, { status: 400 });
    }
    if (!body?.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!body?.org || typeof body.org !== "string") {
      return NextResponse.json({ error: "org is required" }, { status: 400 });
    }
    if (!body?.period || typeof body.period !== "string") {
      return NextResponse.json({ error: "period is required" }, { status: 400 });
    }
    if (!body?.summary || typeof body.summary !== "string") {
      return NextResponse.json({ error: "summary is required" }, { status: 400 });
    }
    if (!Array.isArray(body?.highlights)) {
      return NextResponse.json({ error: "highlights must be an array" }, { status: 400 });
    }
    if (!Array.isArray(body?.tags)) {
      return NextResponse.json({ error: "tags must be an array" }, { status: 400 });
    }

    const payload = {
      type: body.type,
      title: body.title,
      org: body.org,
      period: body.period,
      summary: body.summary,
      highlights: Array.isArray(body.highlights) ? (body.highlights as string[]).filter(Boolean) : [],
      tags: Array.isArray(body.tags) ? (body.tags as string[]).filter(Boolean) : [],
      links:
        Array.isArray(body.links) && body.links.length
          ? (body.links as Array<{ label: string; href: string }>)
              .filter((l) => l.label && l.href)
              .map((l) => ({ label: l.label.trim(), href: l.href.trim() }))
          : undefined,
    };

    const result = await addExperience(payload);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to add experience" }, { status: 500 });
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

    // Validation of optional updates
    if (body?.highlights !== undefined && (!Array.isArray(body.highlights) || body.highlights.some((h: unknown) => typeof h !== "string"))) {
      return NextResponse.json({ error: "highlights must be an array of strings" }, { status: 400 });
    }
    if (body?.tags !== undefined && (!Array.isArray(body.tags) || body.tags.some((t: unknown) => typeof t !== "string"))) {
      return NextResponse.json({ error: "tags must be an array of strings" }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (body?.type && ["work", "leadership", "project"].includes(body.type)) patch.type = body.type;
    if (typeof body.title === "string") patch.title = body.title;
    if (typeof body.org === "string") patch.org = body.org;
    if (typeof body.period === "string") patch.period = body.period;
    if (typeof body.summary === "string") patch.summary = body.summary;
    if (Array.isArray(body.highlights)) patch.highlights = body.highlights.map((h: string) => h.trim()).filter(Boolean);
    if (Array.isArray(body.tags)) patch.tags = body.tags.map((t: string) => t.trim()).filter(Boolean);
    if (Array.isArray(body.links)) {
      const links = (body.links as unknown[])
        .map((raw) => {
          if (!raw || typeof raw !== "object") return null;
          const rec = raw as Record<string, unknown>;
          const label = typeof rec.label === "string" ? rec.label.trim() : "";
          const href = typeof rec.href === "string" ? rec.href.trim() : "";
          if (!label || !href) return null;
          return { label, href };
        })
        .filter(Boolean) as Array<{ label: string; href: string }>;
      patch.links = links.length ? links : undefined;
    }

    const result = await updateExperience(id, patch);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
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

    const result = await deleteExperience(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
