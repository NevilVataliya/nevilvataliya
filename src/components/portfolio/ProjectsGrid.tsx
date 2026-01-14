import type { ReactNode } from "react";

export type ProjectCard = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  role?: string;
};

function hashToIndex(input: string, modulo: number) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h % modulo;
}

function GradientThumb({ title }: { title: string }) {
  const gradients = [
    "from-sky-500/25 via-indigo-500/15 to-transparent",
    "from-emerald-500/20 via-sky-500/10 to-transparent",
    "from-fuchsia-500/20 via-rose-500/10 to-transparent",
    "from-amber-500/20 via-orange-500/10 to-transparent",
  ];
  const idx = hashToIndex(title, gradients.length);
  const g = gradients[idx];

  return (
    <div className={`relative h-40 overflow-hidden rounded-xl border border-white/10 bg-linear-to-br ${g}`}>
      <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_30%_0%,rgba(255,255,255,0.12),transparent_40%)]" />
      <div className="absolute bottom-3 left-3">
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-200">
          Featured
        </span>
      </div>
    </div>
  );
}

function Thumb({ title, imageUrl }: { title: string; imageUrl?: string }) {
  if (!imageUrl) return <GradientThumb title={title} />;

  return (
    <div className="relative h-40 overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200">
          Featured
        </span>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
      {children}
    </span>
  );
}

export function ProjectsGrid({ projects }: { projects: ProjectCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <article
          key={p.id}
          className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:-translate-y-0.5 hover:border-white/15"
        >
          <Thumb title={p.title} imageUrl={p.imageUrl} />

          <div className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-white leading-snug">{p.title}</h3>
              {p.role ? (
                <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] text-zinc-300">
                  {p.role}
                </span>
              ) : null}
            </div>

            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{p.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {p.technologies.slice(0, 4).map((t) => (
                <Chip key={`${p.id}-${t}`}>{t}</Chip>
              ))}
              {p.technologies.length > 4 ? <Chip>+{p.technologies.length - 4}</Chip> : null}
            </div>

            <div className="mt-4 flex items-center gap-2">
              {p.githubUrl ? (
                <a
                  className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-white/10"
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Code
                </a>
              ) : null}
              {p.demoUrl ? (
                <a
                  className="rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
