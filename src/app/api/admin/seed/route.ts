import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { DEFAULT_PORTFOLIO_CONTENT, DEFAULT_PROJECTS, DEFAULT_TECHSTACKS, DEFAULT_EXPERIENCES } from "@/lib/seed";
import type { PortfolioContent, Project, TechStack, Experience } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let force = false;
    try {
      const body = await request.json();
      force = Boolean(body?.force);
    } catch {
      // body optional
    }

    const { searchParams } = new URL(request.url);
    if (searchParams.get("force") === "1") force = true;

    const db = await getDatabase();

    const contentCol = db.collection<PortfolioContent>("portfolioContent");
    const projectsCol = db.collection<Project>("projects");
    const techCol = db.collection<TechStack>("techStacks");
    const expCol = db.collection<Experience>("experiences");

    const existingContent = await contentCol.findOne({ slug: "default" });
    const projectsCount = await projectsCol.countDocuments();
    const techCount = await techCol.countDocuments();
    const expCount = await expCol.countDocuments();

    if (!force && (existingContent || projectsCount > 0 || techCount > 0 || expCount > 0)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Seed skipped because data already exists. Pass force=true (or ?force=1) to overwrite/insert anyway.",
          existing: {
            portfolioContent: Boolean(existingContent),
            projectsCount,
            techStacksCount: techCount,
            experiencesCount: expCount,
          },
        },
        { status: 409 }
      );
    }

    const now = new Date();

    // Content (upsert)
    await contentCol.updateOne(
      { slug: "default" },
      {
        $set: {
          ...DEFAULT_PORTFOLIO_CONTENT,
          slug: "default",
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    // Projects (insert if empty; if force then replace)
    let projectsInserted = 0;
    if (force) {
      await projectsCol.deleteMany({});
    }

    if (force || projectsCount === 0) {
      const docs = DEFAULT_PROJECTS.map((p) => ({ ...p, createdAt: now, updatedAt: now }));
      const res = await projectsCol.insertMany(docs, { ordered: false });
      projectsInserted = res.insertedCount;
    }

    // Tech stacks (insert if empty; if force then replace)
    let techStacksInserted = 0;
    if (force) {
      await techCol.deleteMany({});
    }

    if (force || techCount === 0) {
      const docs = DEFAULT_TECHSTACKS.map((t) => ({ ...t, createdAt: now }));
      const res = await techCol.insertMany(docs, { ordered: false });
      techStacksInserted = res.insertedCount;
    }

    // Experiences (insert if empty; if force then replace)
    let experiencesInserted = 0;
    if (force) {
      await expCol.deleteMany({});
    }

    if (force || expCount === 0) {
      const docs = DEFAULT_EXPERIENCES.map((e) => ({ ...e, createdAt: now, updatedAt: now }));
      const res = await expCol.insertMany(docs, { ordered: false });
      experiencesInserted = res.insertedCount;
    }

    return NextResponse.json({
      ok: true,
      seededAt: now.toISOString(),
      inserted: {
        portfolioContent: true,
        projects: projectsInserted,
        techStacks: techStacksInserted,
        experiences: experiencesInserted,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
