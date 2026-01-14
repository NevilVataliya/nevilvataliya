"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Experience {
  _id: string;
  type: "work" | "leadership" | "project";
  title: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
  links?: { label: string; href: string }[];
}

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/experiences", { cache: "no-store" });
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience item?")) return;

    try {
      setDeleting(id);
      const res = await fetch(`/api/experiences?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchExperiences();
      } else {
        alert("Failed to delete experience item");
      }
    } catch (err) {
      console.error("Error deleting experience:", err);
      alert("Failed to delete experience item");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-5xl text-zinc-200">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Experience Timeline</h1>
            <p className="mt-1 text-sm text-zinc-400">Manage experience items displayed on the homepage.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/experiences/new"
              className="rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Add Experience
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-zinc-400">
              No experience items yet. Create one to get started.
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp._id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold uppercase text-zinc-300">
                        {exp.type}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">
                      {exp.org} • {exp.period}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{exp.summary}</p>

                    {exp.highlights.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-zinc-300">Highlights:</p>
                        <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-zinc-400">
                          {exp.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {exp.links && exp.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {exp.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/experiences/${exp._id}`}
                      className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      disabled={deleting === exp._id}
                      className="rounded-lg bg-red-900/20 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-900/30 disabled:opacity-50"
                    >
                      {deleting === exp._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
