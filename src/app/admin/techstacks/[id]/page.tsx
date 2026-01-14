"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type TechCategory = "languages" | "backend" | "frontend" | "tools" | "concepts";

type TechStack = {
  _id: string;
  name: string;
  category: TechCategory;
};

const CATEGORIES: Array<{ value: TechCategory; label: string }> = [
  { value: "languages", label: "Languages" },
  { value: "backend", label: "Backend" },
  { value: "frontend", label: "Frontend" },
  { value: "tools", label: "Tools" },
  { value: "concepts", label: "Concepts" },
];

export default function EditTechStackPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [tech, setTech] = useState<TechStack | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/techstacks", { cache: "no-store" });
        const all = (await res.json()) as unknown;
        const list = Array.isArray(all) ? (all as TechStack[]) : [];
        const found = list.find((t) => t._id === id) ?? null;
        setTech(found);
      } catch (err) {
        console.error(err);
        setError("Failed to load tech stack");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tech) return;

    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/techstacks?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tech.name, category: tech.category }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const maybeError = (data as { error?: string } | null)?.error;
        setError(maybeError ?? "Failed to update tech stack");
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to update tech stack");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-2xl text-zinc-200">Loading…</div>
      </div>
    );
  }

  if (!tech) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-200">
          <p className="font-semibold text-white">Tech stack not found</p>
          <Link href="/admin/dashboard" className="mt-3 inline-flex text-sm text-zinc-300 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Tech Stack</h1>
            <p className="mt-1 text-sm text-zinc-400">Update the name/category used in the Tech Matrix.</p>
          </div>
          <Link href="/admin/dashboard" className="text-sm text-zinc-300 hover:text-white">
            Back
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
              <input
                value={tech.name}
                onChange={(e) => setTech({ ...tech, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
              <select
                value={tech.category}
                onChange={(e) => setTech({ ...tech, category: e.target.value as TechCategory })}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-300">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
