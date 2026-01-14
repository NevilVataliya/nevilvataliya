"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  description: string;
  role?: string;
  longDescription?: string;
  technologies: string[];
  highlights?: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch("/api/projects");
      const projects = await res.json();
      const found = projects.find((p: Project) => p._id === id);
      setProject(found || null);
    } catch (err) {
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          role: project.role || "",
          imageUrl: project.imageUrl || "",
          longDescription: project.longDescription || "",
          highlights: Array.isArray(project.highlights) ? project.highlights : [],
          technologies: project.technologies,
          demoUrl: project.demoUrl || undefined,
          githubUrl: project.githubUrl || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-4">Project not found</h1>
          <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Project</h1>
          <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
            Back
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role (optional)</label>
              <input
                type="text"
                value={project.role || ""}
                onChange={(e) => setProject({ ...project, role: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="Solo / Team Lead / Backend"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma separated)</label>
              <input
                type="text"
                value={project.technologies.join(", ")}
                onChange={(e) => setProject({ ...project, technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Highlights (comma separated, optional)</label>
              <input
                type="text"
                value={(project.highlights || []).join(", ")}
                onChange={(e) => setProject({ ...project, highlights: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="Faster APIs, Better UX, Security fixes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (optional)</label>
              <input
                type="url"
                value={project.imageUrl || ""}
                onChange={(e) => setProject({ ...project, imageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Long description (optional)</label>
              <textarea
                value={project.longDescription || ""}
                onChange={(e) => setProject({ ...project, longDescription: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="More detail about the project, architecture, tradeoffs, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Demo URL (optional)</label>
              <input
                type="url"
                value={project.demoUrl || ""}
                onChange={(e) => setProject({ ...project, demoUrl: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL (optional)</label>
              <input
                type="url"
                value={project.githubUrl || ""}
                onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
              />
            </div>

            {error && <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
