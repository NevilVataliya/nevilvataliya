"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TechStack {
  _id: string;
  name: string;
  category: "languages" | "backend" | "frontend" | "tools" | "concepts";
}

interface Project {
  _id: string;
  title: string;
  description: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "techstacks">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchTechStacks();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchTechStacks = async () => {
    try {
      const res = await fetch("/api/techstacks");
      const data = await res.json();
      setTechStacks(data);
    } catch (err) {
      console.error("Error fetching tech stacks:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleSeed = async () => {
    if (seedLoading) return;

    try {
      setSeedLoading(true);
      setSeedMessage(null);

      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: false }),
      });

      if (res.status === 401) {
        setSeedMessage("Unauthorized. Please login again.");
        router.push("/admin/login");
        return;
      }

      const data = await res.json().catch(() => null);

      if (res.status === 409) {
        const ok = confirm(
          "Seed skipped because data already exists.\n\nDo you want to FORCE seed? This will replace projects + tech stacks with the default data."
        );
        if (!ok) {
          setSeedMessage(data?.message ?? "Seed skipped (data already exists).");
          return;
        }

        const forceRes = await fetch("/api/admin/seed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ force: true }),
        });

        const forceData = await forceRes.json().catch(() => null);
        if (!forceRes.ok) {
          setSeedMessage(forceData?.error ?? "Force seed failed.");
          return;
        }

        setSeedMessage(
          `Seeded. Inserted projects: ${forceData?.inserted?.projects ?? 0}, tech stacks: ${forceData?.inserted?.techStacks ?? 0}, experiences: ${
            forceData?.inserted?.experiences ?? 0
          }.`
        );
        fetchProjects();
        fetchTechStacks();
        return;
      }

      if (!res.ok) {
        setSeedMessage(data?.error ?? "Seed failed.");
        return;
      }

      setSeedMessage(
        `Seeded. Inserted projects: ${data?.inserted?.projects ?? 0}, tech stacks: ${data?.inserted?.techStacks ?? 0}, experiences: ${
          data?.inserted?.experiences ?? 0
        }.`
      );
      fetchProjects();
      fetchTechStacks();
    } catch (err) {
      console.error("Error seeding:", err);
      setSeedMessage("Seed failed. Check server logs.");
    } finally {
      setSeedLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTechStack = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tech stack?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/techstacks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTechStacks();
      }
    } catch (err) {
      console.error("Error deleting tech stack:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <Link
              href="/admin/content"
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg transition-colors"
              title="Edit MongoDB-backed portfolio sections (thoughts, achievements, etc.)"
            >
              Site Content
            </Link>
            <Link
              href="/admin/experiences"
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg transition-colors"
              title="Manage experience timeline items"
            >
              Experiences
            </Link>
            <button
              onClick={handleSeed}
              disabled={seedLoading}
              className="px-3 py-2 bg-emerald-900/20 hover:bg-emerald-900/30 disabled:opacity-50 text-emerald-300 font-medium rounded-lg transition-colors"
              title="One-click import of the current default site content into MongoDB"
            >
              {seedLoading ? "Seeding…" : "Seed Default Data"}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 font-medium rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {seedMessage ? (
          <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-200">
            {seedMessage}
          </div>
        ) : null}
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "projects"
                ? "text-white border-b-2 border-zinc-400 -mb-0.5"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("techstacks")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "techstacks"
                ? "text-white border-b-2 border-zinc-400 -mb-0.5"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Tech Stacks
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Projects</h2>
              <Link
                href="/admin/projects/new"
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
              >
                Add Project
              </Link>
            </div>

            <div className="grid gap-4">
              {projects.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No projects yet</div>
              ) : (
                projects.map((project) => (
                  <div key={project._id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className="px-3 py-1 bg-blue-900/20 hover:bg-blue-900/30 text-blue-400 text-sm font-medium rounded transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-900/20 hover:bg-red-900/30 disabled:opacity-50 text-red-400 text-sm font-medium rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tech Stacks Tab */}
        {activeTab === "techstacks" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Tech Stacks</h2>
              <Link
                href="/admin/techstacks/new"
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
              >
                Add Tech Stack
              </Link>
            </div>

            <div className="grid gap-4">
              {techStacks.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No tech stacks yet</div>
              ) : (
                techStacks.map((tech) => (
                  <div key={tech._id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{tech.name}</h3>
                      <p className="text-gray-400 text-sm mt-1 capitalize">{tech.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/techstacks/${tech._id}`}
                        className="px-3 py-1 bg-blue-900/20 hover:bg-blue-900/30 text-blue-400 text-sm font-medium rounded transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteTechStack(tech._id)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-900/20 hover:bg-red-900/30 disabled:opacity-50 text-red-400 text-sm font-medium rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
