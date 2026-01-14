import { Navbar } from "@/components/portfolio/Navbar";
import { ConsoleHint } from "@/components/portfolio/ConsoleHint";
import { Section } from "@/components/portfolio/Section";
import { ThoughtGenerator } from "@/components/portfolio/ThoughtGenerator";
import { ProjectsGrid, type ProjectCard } from "@/components/portfolio/ProjectsGrid";
import { ExperienceTimeline, type TimelineItem } from "@/components/portfolio/ExperienceTimeline";
import { TechMatrix, type TechKey } from "@/components/portfolio/TechMatrix";
import { Achievements, type Achievement } from "@/components/portfolio/Achievements";
import { GitHubCalendar } from "@/components/portfolio/GitHubCalendar";

import { getPortfolioContent, getProjects, getTechStacks, getExperiences } from "@/lib/db";
import type { Project, TechStack, Experience } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPortfolioContent().catch(() => null);
  const dbProjectsRaw = await getProjects().catch(() => []);
  const dbTechStacksRaw = await getTechStacks().catch(() => []);
  const dbExperiencesRaw = await getExperiences().catch(() => []);

  const dbProjects: ProjectCard[] = (dbProjectsRaw as Project[]).map((p) => ({
    id: p._id?.toString() ?? p.title,
    title: p.title,
    description: p.description,
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    demoUrl: p.demoUrl,
    githubUrl: p.githubUrl,
    imageUrl: p.imageUrl,
    role: p.role,
  }));

  const techByCategory: Record<TechKey, string[]> = {
    languages: [],
    backend: [],
    frontend: [],
    tools: [],
    concepts: [],
  };

  const dbTechStacks = (dbTechStacksRaw as TechStack[]).map((t) => ({
    name: t.name,
    category: t.category as TechKey,
  }));

  for (const t of dbTechStacks) techByCategory[t.category].push(t.name);

  // Map database experiences to timeline items
  const timeline: TimelineItem[] = (dbExperiencesRaw as Experience[]).map((exp) => ({
    type: exp.type,
    title: exp.title,
    org: exp.org,
    period: exp.period,
    summary: exp.summary,
    highlights: exp.highlights || [],
    tags: exp.tags || [],
    links: exp.links,
  }));

  const achievements: Achievement[] = (content?.achievements?.items ?? []) as Achievement[];

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white">
        <ConsoleHint />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_circle_at_30%_0%,rgba(56,189,248,0.14),transparent_45%),radial-gradient(700px_circle_at_80%_10%,rgba(99,102,241,0.12),transparent_45%)]" />
        <Navbar />

        <main className="relative mx-auto max-w-6xl px-6 pb-24 md:pl-64">
          <section id="home" className="pt-10 md:pt-14">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <h1 className="text-2xl font-bold tracking-tight">Portfolio content not set yet</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Login to admin and click “Seed Default Data” to import the current template content into MongoDB.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/admin/login"
                  className="rounded-full bg-linear-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  Go to Admin
                </a>
                <a
                  href="/api/content"
                  className="rounded-full border border-white/10 bg-black/20 px-5 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                >
                  View content JSON
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ConsoleHint config={content.consoleHint} />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_circle_at_30%_0%,rgba(56,189,248,0.14),transparent_45%),radial-gradient(700px_circle_at_80%_10%,rgba(99,102,241,0.12),transparent_45%)]" />
      <Navbar
        brand={content.navbar}
        items={content.navbar?.items}
      />

      <main className="relative mx-auto max-w-6xl px-6 pb-24 md:pl-64">
        {/* HERO */}
        <section id="home" className="pt-10 md:pt-14">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/8 via-white/5 to-transparent p-6 sm:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_10%_0%,rgba(56,189,248,0.16),transparent_50%),radial-gradient(800px_circle_at_90%_20%,rgba(99,102,241,0.14),transparent_55%)]" />

            <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <p className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
                  {content.hero.metaLine}
                </p>

                <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  {content.hero.headline}
                </h1>
                <p className="mt-3 max-w-2xl text-base text-zinc-300 sm:text-lg">
                  {content.hero.subheadline}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {content.hero.links.map((l) => (
                    <a
                      key={`${l.label}-${l.href}`}
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={
                        l.href.includes("mailto")
                          ? "rounded-full bg-linear-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
                          : "rounded-full border border-white/10 bg-black/25 px-5 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                      }
                    >
                      {l.label}
                    </a>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {content.hero.stats.slice(0, 3).map((s) => (
                    <div key={`${s.label}-${s.value}`} className="rounded-2xl border border-white/10 bg-black/25 p-5">
                      <p className="text-2xl font-bold text-white">{s.value}</p>
                      <p className="mt-1 text-sm text-zinc-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-4">
                <div className="mx-auto w-full max-w-70">
                  <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_80px_-35px_rgba(56,189,248,0.35)]">
                    {/* Photo shown once (hero only). Put your photo at /public/profile.jpg. */}
                    <picture>
                      <source srcSet="/profile.webp" />
                      <img src="/profile.webp" alt={content.hero.avatarAlt} className="h-full w-full object-cover" />
                    </picture>
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0" />
                  </div>
                  <p className="mt-3 text-center text-xs text-zinc-500">{content.hero.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold text-white">{content.overview.title}</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
                  {content.overview.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {content.overview.ctas.map((cta) => (
                    <a
                      key={`${cta.label}-${cta.href}`}
                      href={cta.href}
                      className={
                        cta.href.startsWith("#")
                          ? "rounded-full bg-linear-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
                          : "rounded-full border border-white/10 bg-black/20 px-5 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                      }
                    >
                      {cta.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold text-white">{content.contactCard.title}</p>
                <div className="mt-4 space-y-2 text-sm text-zinc-300">
                  {content.contactCard.items.map((it) => (
                    <p key={`${it.label}-${it.value}`}>
                      <span className="text-zinc-500">{it.label}:</span> {it.value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {content.hero.githubUsername ? <GitHubCalendar username={content.hero.githubUsername} /> : null}
          </div>

          <div className="mt-6">
            <ThoughtGenerator
              title={content.thoughts?.title ?? "Thought Generator"}
              subtitle={content.thoughts?.subtitle ?? "Deep thoughts to keep building momentum."}
              items={content.thoughts?.items ?? []}
              shareAttribution={content.thoughts?.shareAttribution}
            />
          </div>
        </section>

        <div className="mt-16 space-y-16">
          <Section
            id="projects"
            title={content.projectsSection.title}
            subtitle={content.projectsSection.subtitle}
          >
            {dbProjects.length ? (
              <ProjectsGrid projects={dbProjects} />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
                No projects yet. Add some in Admin, or use “Seed Default Data”.
              </div>
            )}
          </Section>

          <Section
            id="experience"
            title={content.experience.title}
            subtitle={content.experience.subtitle}
          >
            {timeline.length ? (
              <ExperienceTimeline items={timeline} />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
                No experience items yet.
              </div>
            )}
          </Section>

          <Section
            id="tech"
            title={content.techSection.title}
            subtitle={content.techSection.subtitle}
          >
            {Object.values(techByCategory).some((arr) => arr.length) ? (
              <TechMatrix data={techByCategory} quickFacts={content.techSection.quickFacts} />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
                No tech stacks yet.
              </div>
            )}
          </Section>

          <Section
            id="about"
            title={content.achievements.title}
            subtitle={content.achievements.subtitle}
          >
            {achievements.length ? (
              <Achievements items={achievements} />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
                No achievements yet.
              </div>
            )}
          </Section>

          <Section
            id="about-me"
            title={content.aboutMe.title}
            subtitle={content.aboutMe.subtitle}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold text-white">{content.aboutMe.strengthsTitle}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-400">
                  {content.aboutMe.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold text-white">{content.aboutMe.learningTitle}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-400">
                  {content.aboutMe.learning.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section
            id="contact"
            title={content.contactSection.title}
            subtitle={content.contactSection.subtitle}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold text-white">{content.contactSection.cardTitle ?? content.contactSection.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={content.contactSection.primaryCta.href}
                    className="rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                  >
                    {content.contactSection.primaryCta.label}
                  </a>
                  {content.contactSection.secondaryCta ? (
                    <a
                      href={content.contactSection.secondaryCta.href}
                      target={content.contactSection.secondaryCta.href.startsWith("http") ? "_blank" : undefined}
                      rel={content.contactSection.secondaryCta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                    >
                      {content.contactSection.secondaryCta.label}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold text-white">{content.contactSection.resumeTitle}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {content.contactSection.resumeBody}
                </p>
                <a
                  href={content.contactSection.resumeCta.href}
                  className="mt-5 inline-flex rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  {content.contactSection.resumeCta.label}
                </a>
              </div>
            </div>
          </Section>

          <footer className="border-t border-white/5 pt-5 text-sm text-zinc-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} {content.hero.name}</p>
              <p className="text-zinc-600">{content.footer.rightText}</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
