"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type LinkItem = { label: string; href: string };

interface Experience {
  _id: string;
  type: "work" | "leadership" | "project";
  title: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
  links?: LinkItem[];
}

export default function EditExperience() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [exp, setExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch("/api/experiences", { cache: "no-store" });
        const experiences = await res.json();
        const found = experiences.find((e: Experience) => e._id === id);
        setExp(found || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load experience");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  const handleUpdateLink = (idx: number, field: "label" | "href", value: string) => {
    if (!exp) return;
    const newLinks = [...(exp.links || [])];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    setExp({ ...exp, links: newLinks });
  };

  const handleRemoveLink = (idx: number) => {
    if (!exp) return;
    setExp({ ...exp, links: (exp.links || []).filter((_, i) => i !== idx) });
  };

  const handleAddLink = () => {
    if (!exp) return;
    setExp({ ...exp, links: [...(exp.links || []), { label: "", href: "" }] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exp) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/experiences?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: exp.type,
          title: exp.title,
          org: exp.org,
          period: exp.period,
          summary: exp.summary,
          highlights: exp.highlights,
          tags: exp.tags,
          links: (exp.links || []).filter((l) => l.label && l.href),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update experience");
      }

      router.push("/admin/experiences");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update experience");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading…</div>;
  }

  if (!exp) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-4">Experience not found</h1>
          <Link href="/admin/experiences" className="text-zinc-300 hover:text-white">
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Experience</h1>
            <p className="mt-1 text-sm text-zinc-400">Update this experience item.</p>
          </div>
          <Link href="/admin/experiences" className="text-sm text-zinc-300 hover:text-white">
            Back
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Type</label>
                <select
                  value={exp.type}
                  onChange={(e) => setExp({ ...exp, type: e.target.value as "work" | "leadership" | "project" })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                >
                  <option value="work">Work</option>
                  <option value="leadership">Leadership</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Period</label>
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => setExp({ ...exp, period: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                  placeholder="Jan 2024 — Present"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Title</label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => setExp({ ...exp, title: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                  placeholder="e.g. Senior Backend Engineer"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Organization</label>
                <input
                  type="text"
                  value={exp.org}
                  onChange={(e) => setExp({ ...exp, org: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                  placeholder="e.g. Acme Inc."
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Summary</label>
              <textarea
                value={exp.summary}
                onChange={(e) => setExp({ ...exp, summary: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                placeholder="Describe your role and key responsibilities…"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Highlights (comma separated)</label>
                <input
                  type="text"
                  value={exp.highlights.join(", ")}
                  onChange={(e) => setExp({ ...exp, highlights: e.target.value.split(",").map((h) => h.trim()).filter(Boolean) })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                  placeholder="Built X, Improved Y, Led Z"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Tags (comma separated)</label>
                <input
                  type="text"
                  value={exp.tags.join(", ")}
                  onChange={(e) => setExp({ ...exp, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                  placeholder="Next.js, Security, Leadership"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="block text-sm font-semibold text-white">Links</label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="rounded-lg border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-300 hover:bg-white/10"
                >
                  Add Link
                </button>
              </div>

              {(exp.links || []).length > 0 ? (
                <div className="space-y-3">
                  {(exp.links || []).map((link, idx) => (
                    <div key={idx} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/20 p-4 md:flex-row md:gap-3">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateLink(idx, "label", e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                        placeholder="Label (e.g. Live, GitHub)"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => handleUpdateLink(idx, "href", e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                        placeholder="https://…"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {error && (
              <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-300">{error}</div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-3 font-semibold text-white hover:opacity-95 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
