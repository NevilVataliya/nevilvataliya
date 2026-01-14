import type { ReactNode } from "react";

export type TimelineItem = {
  type: "work" | "leadership" | "project";
  title: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
  links?: { label: string; href: string }[];
};

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
      {children}
    </span>
  );
}

export function ExperienceTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-0 h-full w-px bg-white/10 md:left-4" />

      <div className="grid gap-4">
        {items.map((it, idx) => (
          <div key={`${it.title}-${idx}`} className="relative pl-10 md:pl-12">
            <div className="absolute left-1.5 top-6 h-4 w-4 rounded-full border border-white/15 bg-linear-to-br from-sky-500/40 to-indigo-500/10 md:left-2" />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">{it.type}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{it.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{it.org} • {it.period}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{it.summary}</p>

              {it.highlights.length ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-zinc-200">Key impact</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-400">
                    {it.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {it.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {it.tags.map((t) => (
                    <Chip key={`${it.title}-${t}`}>{t}</Chip>
                  ))}
                </div>
              ) : null}

              {it.links?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {it.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-white/10"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
