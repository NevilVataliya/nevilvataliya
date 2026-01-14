"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTechStack() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"languages" | "backend" | "frontend" | "tools" | "concepts">("languages");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/techstacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tech stack");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Failed to create tech stack");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">New Tech Stack</h1>
          <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
            Back
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as "languages" | "backend" | "frontend" | "tools" | "concepts")}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
              >
                <option value="languages">Languages</option>
                <option value="backend">Backend</option>
                <option value="frontend">Frontend</option>
                <option value="tools">Tools</option>
                <option value="concepts">Concepts</option>
              </select>
            </div>

            {error && <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create Tech Stack"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
