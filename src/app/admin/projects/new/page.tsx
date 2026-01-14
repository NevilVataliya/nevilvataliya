"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProject() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [highlights, setHighlights] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          role: role || undefined,
          technologies: technologies.split(",").map((t) => t.trim()).filter(Boolean),
          highlights: highlights.split(",").map((t) => t.trim()).filter(Boolean),
          imageUrl: imageUrl || undefined,
          longDescription: longDescription || undefined,
          demoUrl: demoUrl || undefined,
          githubUrl: githubUrl || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">New Project</h1>
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role (optional)</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="Solo / Team Lead / Backend"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma separated)</label>
              <input
                type="text"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="Next.js, MongoDB, Tailwind CSS"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Highlights (comma separated, optional)</label>
              <input
                type="text"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="Faster APIs, Better UX, Security fixes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (optional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="https://..."
              />
              <p className="mt-2 text-xs text-zinc-400">Tip: use a hosted image URL. If empty, a gradient thumbnail is used.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Long description (optional)</label>
              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                placeholder="More detail about the project, architecture, tradeoffs, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Demo URL (optional)</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL (optional)</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
              />
            </div>

            {error && <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
