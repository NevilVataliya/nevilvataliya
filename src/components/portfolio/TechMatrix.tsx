import { createElement, type ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  SiC,
  SiCplusplus,
  SiCss3,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiGit,
  SiGithub,
  SiGnubash,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOwasp,
  SiPostman,
  SiPython,
  SiReact,
  SiSqlite,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";

export type TechKey = "languages" | "backend" | "frontend" | "tools" | "concepts";

export type QuickFact = {
  label: string;
  value: string;
};

export type QuickFactsBlock = {
  title: string;
  items: QuickFact[];
};

function normalizeTechName(name: string) {
  return name
    .toLowerCase()
    // Keep parenthetical content (e.g. "Web Security (OWASP)" -> "web security owasp")
    .replace(/\((.*?)\)/g, " $1 ")
    .replace(/[^a-z0-9+.#/ ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getTechIcon(name: string): IconType | null {
  const n = normalizeTechName(name);

  // Common aliasing
  if (n === "git/github") return SiGithub;

  // Languages
  if (n === "javascript" || n.startsWith("javascript ")) return SiJavascript;
  if (n === "python") return SiPython;
  if (n === "c++" || n === "cplusplus") return SiCplusplus;
  if (n === "c") return SiC;
  if (n === "bash") return SiGnubash;
  if (n === "html5" || n === "html") return SiHtml5;
  if (n === "css3" || n === "css") return SiCss3;
  if (n === "sql") return SiSqlite;

  // Backend / DB
  if (n === "node.js" || n === "nodejs") return SiNodedotjs;
  if (n === "express.js" || n === "express") return SiExpress;
  if (n.startsWith("mongodb")) return SiMongodb;
  if (n === "mysql") return SiMysql;
  if (n === "firebase") return SiFirebase;

  // Frontend
  if (n === "react" || n === "react.js" || n === "reactjs") return SiReact;
  if (n === "react native") return SiReact;
  if (n === "next.js" || n === "nextjs" || n === "next") return SiNextdotjs;
  if (n === "tailwind css" || n === "tailwind") return SiTailwindcss;

  // Tools
  if (n === "linux") return SiLinux;
  if (n.startsWith("git/")) return SiGit;
  if (n === "git") return SiGit;
  if (n === "github") return SiGithub;
  if (n === "docker") return SiDocker;
  if (n === "postman") return SiPostman;
  if (n === "vercel") return SiVercel;

  // Concepts
  if (n.includes("owasp")) return SiOwasp;

  return null;
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-zinc-200">
      {children}
    </span>
  );
}

function TechChip({ name }: { name: string }) {
  const IconComponent = getTechIcon(name);
  const fallback = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 3);

  return (
    <Chip>
      <span className="inline-flex items-center gap-2">
        <span className="inline-flex h-4 w-4 items-center justify-center text-zinc-200">
          {IconComponent
            ? createElement(IconComponent, { className: "h-4 w-4", "aria-hidden": true })
            : <span className="text-[10px]">{fallback}</span>}
        </span>
        <span>{name}</span>
      </span>
    </Chip>
  );
}

export function TechMatrix({
  data,
  quickFacts,
}: {
  data: Record<TechKey, string[]>;
  quickFacts?: QuickFactsBlock;
}) {
  const qfTitle = quickFacts?.title ?? "Quick facts";
  const qfItems = Array.isArray(quickFacts?.items) ? quickFacts.items.filter((it) => !!it?.label || !!it?.value) : [];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card title="Programming Languages">
        <div className="flex flex-wrap gap-2">
          {data.languages.map((t) => (
            <TechChip key={t} name={t} />
          ))}
        </div>
      </Card>

      <Card title="Backend & Databases">
        <div className="flex flex-wrap gap-2">
          {data.backend.map((t) => (
            <TechChip key={t} name={t} />
          ))}
        </div>
      </Card>

      <Card title="Frontend & App">
        <div className="flex flex-wrap gap-2">
          {data.frontend.map((t) => (
            <TechChip key={t} name={t} />
          ))}
        </div>
      </Card>

      <Card title="Tools & Platforms">
        <div className="flex flex-wrap gap-2">
          {data.tools.map((t) => (
            <TechChip key={t} name={t} />
          ))}
        </div>
      </Card>

      <Card title="Core Concepts">
        <div className="flex flex-wrap gap-2">
          {data.concepts.map((t) => (
            <TechChip key={t} name={t} />
          ))}
        </div>
      </Card>

      {qfItems.length ? (
        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-sky-500/10 via-indigo-500/10 to-transparent p-6">
          <h3 className="text-sm font-semibold text-white">{qfTitle}</h3>
          <div className="mt-4 space-y-2 text-sm text-zinc-300">
            {qfItems.map((it) => (
              <p key={`${it.label}-${it.value}`}>
                <span className="text-zinc-400">{it.label}:</span> {it.value}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
