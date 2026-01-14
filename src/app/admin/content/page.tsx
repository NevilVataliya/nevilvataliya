"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type LinkItem = { label: string; href: string };

type NavItem = { id: string; label: string };

type StatItem = { label: string; value: string };

type Thought = { id: string; text: string };

type QuickFact = { label: string; value: string };

type QuickFactsBlock = { title: string; items: QuickFact[] };

type HeroBlock = {
  name: string;
  headline: string;
  subheadline: string;
  metaLine: string;
  avatarAlt: string;
  githubUsername?: string;
  links: LinkItem[];
  stats: StatItem[];
};

type OverviewBlock = {
  title: string;
  paragraphs: string[];
  ctas: LinkItem[];
};

type ContactCardBlock = {
  title: string;
  items: { label: string; value: string }[];
};

type AboutMeBlock = {
  title: string;
  subtitle: string;
  strengthsTitle: string;
  strengths: string[];
  learningTitle: string;
  learning: string[];
};

type ContactSectionBlock = {
  title: string;
  subtitle: string;
  cardTitle?: string;
  primaryCta: LinkItem;
  secondaryCta?: LinkItem;
  resumeTitle: string;
  resumeBody: string;
  resumeCta: LinkItem;
};

type SimpleSectionBlock = { title: string; subtitle: string };

type TechSectionBlock = SimpleSectionBlock & {
  quickFacts?: QuickFactsBlock;
};

type NavbarBlock = {
  name: string;
  mobileSubtitle: string;
  desktopSubtitle: string;
  items: NavItem[];
};

type ConsoleHintBlock = {
  enabled: boolean;
  consoleTitle: string;
  commandsTitle: string;
  commands: string[];
  about: string;
  links: LinkItem[];
  stack: string[];
};

type FooterBlock = { rightText: string };

type ExperienceItem = {
  id: string;
  type: "work" | "leadership" | "project";
  title: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
  links?: LinkItem[];
};

type Achievement = {
  id: string;
  title: string;
  year: string;
  category: "competition" | "project" | "milestone";
  description: string;
};

type ContentDoc = {
  _id?: string;
  slug: "default";

  navbar?: NavbarBlock;
  consoleHint?: ConsoleHintBlock;

  hero?: HeroBlock;
  overview?: OverviewBlock;
  contactCard?: ContactCardBlock;

  thoughts?: { title: string; subtitle: string; items: Thought[]; shareAttribution?: string };
  experience?: { title: string; subtitle: string; items: ExperienceItem[] };
  projectsSection?: SimpleSectionBlock;
  techSection?: TechSectionBlock;
  achievements?: { title: string; subtitle: string; items: Achievement[] };

  aboutMe?: AboutMeBlock;
  contactSection?: ContactSectionBlock;
  footer?: FooterBlock;

  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

const DEFAULT_HERO: HeroBlock = {
  name: "",
  headline: "",
  subheadline: "",
  metaLine: "",
  avatarAlt: "",
  githubUsername: "",
  links: [],
  stats: [],
};

const DEFAULT_OVERVIEW: OverviewBlock = {
  title: "Overview",
  paragraphs: [],
  ctas: [],
};

const DEFAULT_CONTACT_CARD: ContactCardBlock = {
  title: "Contact info",
  items: [],
};

const DEFAULT_SIMPLE_SECTION: SimpleSectionBlock = { title: "", subtitle: "" };

const DEFAULT_ABOUT_ME: AboutMeBlock = {
  title: "",
  subtitle: "",
  strengthsTitle: "",
  strengths: [],
  learningTitle: "",
  learning: [],
};

const DEFAULT_CONTACT_SECTION: ContactSectionBlock = {
  title: "Contact",
  subtitle: "",
  cardTitle: "Contact",
  primaryCta: { label: "Email me", href: "" },
  secondaryCta: undefined,
  resumeTitle: "Resume",
  resumeBody: "",
  resumeCta: { label: "Request resume", href: "" },
};

const DEFAULT_FOOTER: FooterBlock = { rightText: "" };

const DEFAULT_NAVBAR: NavbarBlock = {
  name: "Nevil",
  mobileSubtitle: "nevil.codes",
  desktopSubtitle: "SVNIT • CSE",
  items: [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "tech", label: "Tech Stack" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ],
};

const DEFAULT_CONSOLE_HINT: ConsoleHintBlock = {
  enabled: true,
  consoleTitle: "n e v i l --help",
  commandsTitle: "Commands:",
  commands: ["- about: quick summary", "- links: social links", "- stack: current stack"],
  about: "CSE @ SVNIT • backend-first • security • ML",
  links: [
    { label: "github", href: "" },
    { label: "linkedin", href: "" },
    { label: "email", href: "" },
  ],
  stack: ["Next.js", "TypeScript", "Tailwind", "MongoDB"],
};

const DEFAULT_TECH_SECTION: TechSectionBlock = {
  title: "",
  subtitle: "",
  quickFacts: { title: "Quick facts", items: [] },
};

function uid(prefix: string) {
  const uuid = (globalThis.crypto as unknown as { randomUUID?: () => string } | undefined)?.randomUUID?.();
  return `${prefix}-${uuid ?? Date.now().toString(36)}`;
}

function normalizeContent(doc: ContentDoc): ContentDoc {
  const next: ContentDoc = { ...doc, slug: "default" };

  const hero = (next.hero ?? {}) as Partial<HeroBlock>;
  next.hero = {
    ...DEFAULT_HERO,
    ...hero,
    links: Array.isArray(hero.links) ? (hero.links as LinkItem[]).filter((l) => !!l?.label || !!l?.href) : [],
    stats: Array.isArray(hero.stats) ? (hero.stats as StatItem[]).filter((s) => !!s?.label || !!s?.value) : [],
  };

  const overview = (next.overview ?? {}) as Partial<OverviewBlock>;
  next.overview = {
    ...DEFAULT_OVERVIEW,
    ...overview,
    paragraphs: Array.isArray(overview.paragraphs) ? (overview.paragraphs as string[]).filter(Boolean) : [],
    ctas: Array.isArray(overview.ctas) ? (overview.ctas as LinkItem[]).filter((l) => !!l?.label || !!l?.href) : [],
  };

  const contactCard = (next.contactCard ?? {}) as Partial<ContactCardBlock>;
  next.contactCard = {
    ...DEFAULT_CONTACT_CARD,
    ...contactCard,
    items: Array.isArray(contactCard.items)
      ? (contactCard.items as { label: string; value: string }[]).filter((it) => !!it?.label || !!it?.value)
      : [],
  };

  if (next.thoughts) {
    const items = Array.isArray(next.thoughts.items) ? next.thoughts.items : [];
    next.thoughts = {
      title: next.thoughts.title ?? "Thought Generator",
      subtitle: next.thoughts.subtitle ?? "",
      shareAttribution:
        typeof (next.thoughts as { shareAttribution?: unknown }).shareAttribution === "string"
          ? ((next.thoughts as { shareAttribution?: string }).shareAttribution ?? "")
          : "",
      items: items
        .map((it) => {
          if (!it) return null;
          const maybe = it as Partial<Thought>;
          const text = typeof maybe.text === "string" ? maybe.text : "";
          const id = typeof maybe.id === "string" && maybe.id ? maybe.id : uid("t");
          return { id, text } satisfies Thought;
        })
        .filter(Boolean) as Thought[],
    };
  }

  const projectsSection = (next.projectsSection ?? {}) as Partial<SimpleSectionBlock>;
  next.projectsSection = {
    ...DEFAULT_SIMPLE_SECTION,
    ...projectsSection,
    title: projectsSection.title ?? next.projectsSection?.title ?? "Projects",
    subtitle: projectsSection.subtitle ?? next.projectsSection?.subtitle ?? "",
  };

  const techSection = (next.techSection ?? {}) as Partial<TechSectionBlock>;
  const quickFactsRaw = (techSection.quickFacts ?? (next.techSection as TechSectionBlock | undefined)?.quickFacts ?? {}) as Partial<QuickFactsBlock>;
  next.techSection = {
    ...DEFAULT_TECH_SECTION,
    ...techSection,
    title: techSection.title ?? (next.techSection as TechSectionBlock | undefined)?.title ?? "Tech",
    subtitle: techSection.subtitle ?? (next.techSection as TechSectionBlock | undefined)?.subtitle ?? "",
    quickFacts: {
      title: typeof quickFactsRaw.title === "string" && quickFactsRaw.title ? quickFactsRaw.title : "Quick facts",
      items: Array.isArray(quickFactsRaw.items)
        ? (quickFactsRaw.items as QuickFact[])
            .map((it) => ({
              label: typeof it?.label === "string" ? it.label : "",
              value: typeof it?.value === "string" ? it.value : "",
            }))
            .filter((it) => !!it.label || !!it.value)
        : [],
    },
  };

  if (next.experience) {
    const items = Array.isArray(next.experience.items) ? next.experience.items : [];
    next.experience = {
      title: next.experience.title ?? "Experience",
      subtitle: next.experience.subtitle ?? "",
      items: items
        .map((raw) => {
          const it = (raw ?? {}) as Partial<ExperienceItem>;
          const id = typeof it.id === "string" && it.id ? it.id : uid("exp");
          const highlights = Array.isArray(it.highlights) ? (it.highlights as string[]).filter(Boolean) : [];
          const tags = Array.isArray(it.tags) ? (it.tags as string[]).filter(Boolean) : [];
          const links = Array.isArray(it.links)
            ? (it.links as LinkItem[])
                .map((l) => ({
                  label: typeof l?.label === "string" ? l.label : "",
                  href: typeof l?.href === "string" ? l.href : "",
                }))
                .filter((l) => !!l.label || !!l.href)
            : [];

          return {
            id,
            type: it.type ?? "work",
            title: it.title ?? "",
            org: it.org ?? "",
            period: it.period ?? "",
            summary: it.summary ?? "",
            highlights,
            tags,
            links,
          } satisfies ExperienceItem;
        })
        .filter(Boolean) as ExperienceItem[],
    };
  }

  if (next.achievements) {
    const items = Array.isArray(next.achievements.items) ? next.achievements.items : [];
    next.achievements = {
      title: next.achievements.title ?? "About",
      subtitle: next.achievements.subtitle ?? "",
      items: items.map((it) => ({
        ...it,
        id: (it as Partial<Achievement>)?.id ? (it as Achievement).id : uid("ach"),
      })) as Achievement[],
    };
  }

  const aboutMe = (next.aboutMe ?? {}) as Partial<AboutMeBlock>;
  next.aboutMe = {
    ...DEFAULT_ABOUT_ME,
    ...aboutMe,
    strengths: Array.isArray(aboutMe.strengths) ? (aboutMe.strengths as string[]).filter(Boolean) : [],
    learning: Array.isArray(aboutMe.learning) ? (aboutMe.learning as string[]).filter(Boolean) : [],
  };

  const contactSection = (next.contactSection ?? {}) as Partial<ContactSectionBlock>;
  const primaryCta = (contactSection.primaryCta ?? {}) as Partial<LinkItem>;
  const resumeCta = (contactSection.resumeCta ?? {}) as Partial<LinkItem>;
  const secondaryCta = contactSection.secondaryCta ? ((contactSection.secondaryCta ?? {}) as Partial<LinkItem>) : undefined;
  next.contactSection = {
    ...DEFAULT_CONTACT_SECTION,
    ...contactSection,
    cardTitle: typeof contactSection.cardTitle === "string"
      ? contactSection.cardTitle
      : (contactSection.title ?? DEFAULT_CONTACT_SECTION.title),
    primaryCta: {
      label: typeof primaryCta.label === "string" ? primaryCta.label : DEFAULT_CONTACT_SECTION.primaryCta.label,
      href: typeof primaryCta.href === "string" ? primaryCta.href : DEFAULT_CONTACT_SECTION.primaryCta.href,
    },
    secondaryCta:
      secondaryCta && (typeof secondaryCta.label === "string" || typeof secondaryCta.href === "string")
        ? {
            label: typeof secondaryCta.label === "string" ? secondaryCta.label : "",
            href: typeof secondaryCta.href === "string" ? secondaryCta.href : "",
          }
        : undefined,
    resumeCta: {
      label: typeof resumeCta.label === "string" ? resumeCta.label : DEFAULT_CONTACT_SECTION.resumeCta.label,
      href: typeof resumeCta.href === "string" ? resumeCta.href : DEFAULT_CONTACT_SECTION.resumeCta.href,
    },
  };

  const navbar = (next.navbar ?? {}) as Partial<NavbarBlock>;
  next.navbar = {
    ...DEFAULT_NAVBAR,
    ...navbar,
    items: Array.isArray(navbar.items)
      ? (navbar.items as NavItem[])
          .map((it) => ({
            id: typeof it?.id === "string" ? it.id : "",
            label: typeof it?.label === "string" ? it.label : "",
          }))
          .filter((it) => !!it.id && !!it.label)
      : DEFAULT_NAVBAR.items,
  };

  const consoleHint = (next.consoleHint ?? {}) as Partial<ConsoleHintBlock>;
  next.consoleHint = {
    ...DEFAULT_CONSOLE_HINT,
    ...consoleHint,
    enabled: typeof consoleHint.enabled === "boolean" ? consoleHint.enabled : DEFAULT_CONSOLE_HINT.enabled,
    commands: Array.isArray(consoleHint.commands) ? (consoleHint.commands as string[]).filter(Boolean) : DEFAULT_CONSOLE_HINT.commands,
    links: Array.isArray(consoleHint.links)
      ? (consoleHint.links as LinkItem[])
          .map((l) => ({
            label: typeof l?.label === "string" ? l.label : "",
            href: typeof l?.href === "string" ? l.href : "",
          }))
          .filter((l) => !!l.label || !!l.href)
      : DEFAULT_CONSOLE_HINT.links,
    stack: Array.isArray(consoleHint.stack) ? (consoleHint.stack as string[]).filter(Boolean) : DEFAULT_CONSOLE_HINT.stack,
  };

  const footer = (next.footer ?? {}) as Partial<FooterBlock>;
  next.footer = { ...DEFAULT_FOOTER, ...footer };

  return next;
}

export default function AdminContentPage() {
  const router = useRouter();
  const [content, setContent] = useState<ContentDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const thoughts = useMemo(() => content?.thoughts?.items ?? [], [content]);
  const achievements = useMemo(() => content?.achievements?.items ?? [], [content]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setMessage(null);
        const res = await fetch("/api/content", { cache: "no-store" });
        const data = (await res.json()) as ContentDoc | null;
        setContent(data ? normalizeContent(data) : null);
      } catch (e) {
        console.error(e);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const seedNow = async () => {
    if (seeding) return;
    try {
      setSeeding(true);
      setError(null);
      setMessage(null);

      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: false }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json().catch(() => null);

      if (res.status === 409) {
        setMessage(data?.message ?? "Seed skipped (data already exists). Use Admin Dashboard to force seed if needed.");
        return;
      }

      if (!res.ok) {
        setError(data?.error ?? "Seed failed.");
        return;
      }

      setMessage("Seeded default data. Reloading content…");
      const reload = await fetch("/api/content", { cache: "no-store" });
      const newContent = (await reload.json()) as ContentDoc | null;
      setContent(newContent ? normalizeContent(newContent) : null);
    } catch (e) {
      console.error(e);
      setError("Seed failed.");
    } finally {
      setSeeding(false);
    }
  };

  const save = async () => {
    if (!content || saving) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      // Strip server-managed fields
      const rest: ContentDoc = { ...content };
      delete rest._id;
      delete rest.createdAt;
      delete rest.updatedAt;

      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, slug: "default" }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Save failed.");
        return;
      }

      setMessage("Saved.");
    } catch (e) {
      console.error(e);
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-5xl text-zinc-200">Loading…</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Site Content</h1>
              <p className="mt-2 text-sm text-zinc-400">No content document found in MongoDB yet.</p>
            </div>
            <Link href="/admin/dashboard" className="text-sm text-zinc-300 hover:text-white">
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={seedNow}
              disabled={seeding}
              className="rounded-lg bg-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-900/30 disabled:opacity-50"
            >
              {seeding ? "Seeding…" : "Seed Default Data"}
            </button>
            <a
              href="/api/content"
              className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
              target="_blank"
              rel="noreferrer"
            >
              View /api/content
            </a>
          </div>

          {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Site Content</h1>
            <p className="mt-1 text-sm text-zinc-400">Edits save into MongoDB and render on “/”.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-sm text-zinc-300 hover:text-white">
              Back
            </Link>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {message ? (
          <div className="mb-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">{message}</div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-lg border border-red-900/40 bg-red-900/20 px-4 py-3 text-sm text-red-300">{error}</div>
        ) : null}

        {/* Hero */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Hero</h2>
              <p className="mt-1 text-sm text-zinc-400">Top section content (headline, links, stats).</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                    hero.links = [...(hero.links ?? []), { label: "", href: "" }];
                    return { ...prev, hero };
                  });
                }}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                Add Link
              </button>
              <button
                onClick={() => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                    hero.stats = [...(hero.stats ?? []), { label: "", value: "" }];
                    return { ...prev, hero };
                  });
                }}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                Add Stat
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Name</label>
              <input
                value={content.hero?.name ?? ""}
                onChange={(e) => {
                  const name = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                    return { ...prev, hero: { ...hero, name } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Meta line</label>
              <input
                value={content.hero?.metaLine ?? ""}
                onChange={(e) => {
                  const metaLine = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                    return { ...prev, hero: { ...hero, metaLine } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Headline</label>
              <input
                value={content.hero?.headline ?? ""}
                onChange={(e) => {
                  const headline = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                    return { ...prev, hero: { ...hero, headline } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Subheadline</label>
              <input
                value={content.hero?.subheadline ?? ""}
                onChange={(e) => {
                  const subheadline = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                    return { ...prev, hero: { ...hero, subheadline } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Avatar alt</label>
              <input
                value={content.hero?.avatarAlt ?? ""}
                onChange={(e) => {
                  const avatarAlt = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                    return { ...prev, hero: { ...hero, avatarAlt } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">GitHub username</label>
              <input
                value={content.hero?.githubUsername ?? ""}
                onChange={(e) => {
                  const githubUsername = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                    return { ...prev, hero: { ...hero, githubUsername } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                placeholder="nevilvataliya"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">Links</p>
              <div className="mt-3 grid gap-3">
                {(content.hero?.links ?? []).length ? (
                  (content.hero?.links ?? []).map((l, idx) => (
                    <div key={`${l.label}-${l.href}-${idx}`} className="grid gap-2 rounded-lg border border-white/10 bg-black/30 p-3">
                      <div className="grid gap-2 md:grid-cols-2">
                        <input
                          value={l.label}
                          onChange={(e) => {
                            const label = e.target.value;
                            setContent((prev) => {
                              if (!prev) return prev;
                              const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                              const links = (hero.links ?? []).map((x, i) => (i === idx ? { ...x, label } : x));
                              return { ...prev, hero: { ...hero, links } };
                            });
                          }}
                          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                          placeholder="Label"
                        />
                        <input
                          value={l.href}
                          onChange={(e) => {
                            const href = e.target.value;
                            setContent((prev) => {
                              if (!prev) return prev;
                              const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                              const links = (hero.links ?? []).map((x, i) => (i === idx ? { ...x, href } : x));
                              return { ...prev, hero: { ...hero, links } };
                            });
                          }}
                          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                          placeholder="https://…"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setContent((prev) => {
                            if (!prev) return prev;
                            const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                            const links = (hero.links ?? []).filter((_, i) => i !== idx);
                            return { ...prev, hero: { ...hero, links } };
                          });
                        }}
                        className="w-fit rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">No links yet.</div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">Stats</p>
              <div className="mt-3 grid gap-3">
                {(content.hero?.stats ?? []).length ? (
                  (content.hero?.stats ?? []).map((s, idx) => (
                    <div key={`${s.label}-${s.value}-${idx}`} className="grid gap-2 rounded-lg border border-white/10 bg-black/30 p-3">
                      <div className="grid gap-2 md:grid-cols-2">
                        <input
                          value={s.label}
                          onChange={(e) => {
                            const label = e.target.value;
                            setContent((prev) => {
                              if (!prev) return prev;
                              const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                              const stats = (hero.stats ?? []).map((x, i) => (i === idx ? { ...x, label } : x));
                              return { ...prev, hero: { ...hero, stats } };
                            });
                          }}
                          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                          placeholder="Label"
                        />
                        <input
                          value={s.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            setContent((prev) => {
                              if (!prev) return prev;
                              const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                              const stats = (hero.stats ?? []).map((x, i) => (i === idx ? { ...x, value } : x));
                              return { ...prev, hero: { ...hero, stats } };
                            });
                          }}
                          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                          placeholder="Value"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setContent((prev) => {
                            if (!prev) return prev;
                            const hero = prev.hero ?? structuredClone(DEFAULT_HERO);
                            const stats = (hero.stats ?? []).filter((_, i) => i !== idx);
                            return { ...prev, hero: { ...hero, stats } };
                          });
                        }}
                        className="w-fit rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">No stats yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Overview</h2>
              <p className="mt-1 text-sm text-zinc-400">Intro paragraphs + call-to-action buttons.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const overview = prev.overview ?? structuredClone(DEFAULT_OVERVIEW);
                    overview.paragraphs = [...(overview.paragraphs ?? []), ""];
                    return { ...prev, overview };
                  });
                }}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                Add Paragraph
              </button>
              <button
                onClick={() => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const overview = prev.overview ?? structuredClone(DEFAULT_OVERVIEW);
                    overview.ctas = [...(overview.ctas ?? []), { label: "", href: "" }];
                    return { ...prev, overview };
                  });
                }}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                Add CTA
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Title</label>
              <input
                value={content.overview?.title ?? ""}
                onChange={(e) => {
                  const title = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const overview = prev.overview ?? structuredClone(DEFAULT_OVERVIEW);
                    return { ...prev, overview: { ...overview, title } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <p className="text-sm font-semibold text-white">Paragraphs</p>
            {(content.overview?.paragraphs ?? []).length ? (
              (content.overview?.paragraphs ?? []).map((p, idx) => (
                <div key={idx} className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
                  <textarea
                    value={p}
                    onChange={(e) => {
                      const val = e.target.value;
                      setContent((prev) => {
                        if (!prev) return prev;
                        const overview = prev.overview ?? structuredClone(DEFAULT_OVERVIEW);
                        const paragraphs = (overview.paragraphs ?? []).map((x, i) => (i === idx ? val : x));
                        return { ...prev, overview: { ...overview, paragraphs } };
                      });
                    }}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                    placeholder="Write a paragraph…"
                  />
                  <button
                    onClick={() => {
                      setContent((prev) => {
                        if (!prev) return prev;
                        const overview = prev.overview ?? structuredClone(DEFAULT_OVERVIEW);
                        const paragraphs = (overview.paragraphs ?? []).filter((_, i) => i !== idx);
                        return { ...prev, overview: { ...overview, paragraphs } };
                      });
                    }}
                    className="w-fit rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">No paragraphs yet.</div>
            )}
          </div>

          <div className="mt-4 grid gap-3">
            <p className="text-sm font-semibold text-white">CTAs</p>
            {(content.overview?.ctas ?? []).length ? (
              (content.overview?.ctas ?? []).map((cta, idx) => (
                <div key={`${cta.label}-${cta.href}-${idx}`} className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      value={cta.label}
                      onChange={(e) => {
                        const label = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const overview = prev.overview ?? structuredClone(DEFAULT_OVERVIEW);
                          const ctas = (overview.ctas ?? []).map((x, i) => (i === idx ? { ...x, label } : x));
                          return { ...prev, overview: { ...overview, ctas } };
                        });
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      placeholder="Label"
                    />
                    <input
                      value={cta.href}
                      onChange={(e) => {
                        const href = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const overview = prev.overview ?? structuredClone(DEFAULT_OVERVIEW);
                          const ctas = (overview.ctas ?? []).map((x, i) => (i === idx ? { ...x, href } : x));
                          return { ...prev, overview: { ...overview, ctas } };
                        });
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      placeholder="#projects or https://…"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setContent((prev) => {
                        if (!prev) return prev;
                        const overview = prev.overview ?? structuredClone(DEFAULT_OVERVIEW);
                        const ctas = (overview.ctas ?? []).filter((_, i) => i !== idx);
                        return { ...prev, overview: { ...overview, ctas } };
                      });
                    }}
                    className="w-fit rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">No CTAs yet.</div>
            )}
          </div>
        </div>

        {/* Contact Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Contact Card</h2>
              <p className="mt-1 text-sm text-zinc-400">Small info card beside the overview.</p>
            </div>
            <button
              onClick={() => {
                setContent((prev) => {
                  if (!prev) return prev;
                  const contactCard = prev.contactCard ?? structuredClone(DEFAULT_CONTACT_CARD);
                  contactCard.items = [...(contactCard.items ?? []), { label: "", value: "" }];
                  return { ...prev, contactCard };
                });
              }}
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Add Item
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Title</label>
              <input
                value={content.contactCard?.title ?? ""}
                onChange={(e) => {
                  const title = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const contactCard = prev.contactCard ?? structuredClone(DEFAULT_CONTACT_CARD);
                    return { ...prev, contactCard: { ...contactCard, title } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {(content.contactCard?.items ?? []).length ? (
              (content.contactCard?.items ?? []).map((it, idx) => (
                <div key={`${it.label}-${it.value}-${idx}`} className="grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      value={it.label}
                      onChange={(e) => {
                        const label = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const contactCard = prev.contactCard ?? structuredClone(DEFAULT_CONTACT_CARD);
                          const items = (contactCard.items ?? []).map((x, i) => (i === idx ? { ...x, label } : x));
                          return { ...prev, contactCard: { ...contactCard, items } };
                        });
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      placeholder="Label"
                    />
                    <input
                      value={it.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const contactCard = prev.contactCard ?? structuredClone(DEFAULT_CONTACT_CARD);
                          const items = (contactCard.items ?? []).map((x, i) => (i === idx ? { ...x, value } : x));
                          return { ...prev, contactCard: { ...contactCard, items } };
                        });
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      placeholder="Value"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setContent((prev) => {
                        if (!prev) return prev;
                        const contactCard = prev.contactCard ?? structuredClone(DEFAULT_CONTACT_CARD);
                        const items = (contactCard.items ?? []).filter((_, i) => i !== idx);
                        return { ...prev, contactCard: { ...contactCard, items } };
                      });
                    }}
                    className="w-fit rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">No items yet.</div>
            )}
          </div>
        </div>

        {/* Thoughts */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Thought Generator</h2>
              <p className="mt-1 text-sm text-zinc-400">This powers the Thought Generator block on the homepage.</p>
            </div>
            <button
              onClick={() => {
                setContent((prev) => {
                  if (!prev) return prev;
                  const next = structuredClone(prev);
                  const block = (next.thoughts ?? {
                    title: "Thought Generator",
                    subtitle: "",
                    items: [],
                  }) as NonNullable<ContentDoc["thoughts"]>;
                  block.items = [...(block.items ?? []), { id: uid("t"), text: "" }];
                  next.thoughts = block;
                  return next;
                });
              }}
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Add Thought
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Title</label>
                <input
                  value={content.thoughts?.title ?? ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, thoughts: { title: e.target.value, subtitle: prev.thoughts?.subtitle ?? "", items: prev.thoughts?.items ?? [] } } : prev))
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Subtitle</label>
                <input
                  value={content.thoughts?.subtitle ?? ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, thoughts: { title: prev.thoughts?.title ?? "", subtitle: e.target.value, items: prev.thoughts?.items ?? [] } } : prev))
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                />
              </div>
            </div>

            {thoughts.length ? (
              thoughts.map((t, idx) => (
                <div key={t.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="mt-2 text-xs text-zinc-500">#{idx + 1}</div>
                  <textarea
                    value={t.text}
                    onChange={(e) => {
                      const text = e.target.value;
                      setContent((prev) => {
                        if (!prev) return prev;
                        const items = (prev.thoughts?.items ?? []).map((it) => (it.id === t.id ? { ...it, text } : it));
                        return {
                          ...prev,
                          thoughts: {
                            title: prev.thoughts?.title ?? "Thought Generator",
                            subtitle: prev.thoughts?.subtitle ?? "",
                            items,
                          },
                        };
                      });
                    }}
                    rows={2}
                    className="min-h-11 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                    placeholder="Write a thought…"
                  />
                  <button
                    onClick={() => {
                      setContent((prev) => {
                        if (!prev) return prev;
                        const items = (prev.thoughts?.items ?? []).filter((it) => it.id !== t.id);
                        return {
                          ...prev,
                          thoughts: {
                            title: prev.thoughts?.title ?? "Thought Generator",
                            subtitle: prev.thoughts?.subtitle ?? "",
                            items,
                          },
                        };
                      });
                    }}
                    className="rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">No thoughts yet.</div>
            )}
          </div>
        </div>

        {/* Section titles */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Projects Section</h2>
            <p className="mt-1 text-sm text-zinc-400">Title/subtitle for the projects block.</p>
            <div className="mt-4 grid gap-3">
              <input
                value={content.projectsSection?.title ?? ""}
                onChange={(e) => {
                  const title = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const projectsSection = prev.projectsSection ?? structuredClone(DEFAULT_SIMPLE_SECTION);
                    return { ...prev, projectsSection: { ...projectsSection, title } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                placeholder="Title"
              />
              <input
                value={content.projectsSection?.subtitle ?? ""}
                onChange={(e) => {
                  const subtitle = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const projectsSection = prev.projectsSection ?? structuredClone(DEFAULT_SIMPLE_SECTION);
                    return { ...prev, projectsSection: { ...projectsSection, subtitle } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                placeholder="Subtitle"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Tech Section</h2>
            <p className="mt-1 text-sm text-zinc-400">Title/subtitle for the tech matrix block.</p>
            <div className="mt-4 grid gap-3">
              <input
                value={content.techSection?.title ?? ""}
                onChange={(e) => {
                  const title = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const techSection = prev.techSection ?? structuredClone(DEFAULT_SIMPLE_SECTION);
                    return { ...prev, techSection: { ...techSection, title } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                placeholder="Title"
              />
              <input
                value={content.techSection?.subtitle ?? ""}
                onChange={(e) => {
                  const subtitle = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const techSection = prev.techSection ?? structuredClone(DEFAULT_SIMPLE_SECTION);
                    return { ...prev, techSection: { ...techSection, subtitle } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                placeholder="Subtitle"
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Experience</h2>
              <p className="mt-1 text-sm text-zinc-400">Timeline items are managed separately.</p>
            </div>
            <Link
              href="/admin/experiences"
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Manage Experiences
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Experience items now live in the MongoDB <span className="text-zinc-200">experiences</span> collection and render on the homepage automatically.
          </p>
        </div>

        {/* Achievements */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Achievements</h2>
              <p className="mt-1 text-sm text-zinc-400">Cards displayed in the “About” section on the homepage.</p>
            </div>
            <button
              onClick={() => {
                setContent((prev) => {
                  if (!prev) return prev;
                  const next = structuredClone(prev);
                  const block = (next.achievements ?? {
                    title: "About",
                    subtitle: "",
                    items: [],
                  }) as NonNullable<ContentDoc["achievements"]>;
                  block.items = [
                    ...(block.items ?? []),
                    {
                      id: uid("ach"),
                      title: "",
                      year: "",
                      category: "milestone",
                      description: "",
                    },
                  ];
                  next.achievements = block;
                  return next;
                });
              }}
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Add Achievement
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Title</label>
                <input
                  value={content.achievements?.title ?? ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev
                        ? {
                            ...prev,
                            achievements: {
                              title: e.target.value,
                              subtitle: prev.achievements?.subtitle ?? "",
                              items: prev.achievements?.items ?? [],
                            },
                          }
                        : prev
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Subtitle</label>
                <input
                  value={content.achievements?.subtitle ?? ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev
                        ? {
                            ...prev,
                            achievements: {
                              title: prev.achievements?.title ?? "",
                              subtitle: e.target.value,
                              items: prev.achievements?.items ?? [],
                            },
                          }
                        : prev
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                />
              </div>
            </div>

            {achievements.length ? (
              achievements.map((a) => (
                <div key={a.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{a.title || "(Untitled)"}</p>
                    <button
                      onClick={() => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const items = (prev.achievements?.items ?? []).filter((x) => x.id !== a.id);
                          return {
                            ...prev,
                            achievements: {
                              title: prev.achievements?.title ?? "About",
                              subtitle: prev.achievements?.subtitle ?? "",
                              items,
                            },
                          };
                        });
                      }}
                      className="rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Title</label>
                      <input
                        value={a.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setContent((prev) => {
                            if (!prev) return prev;
                            const items = (prev.achievements?.items ?? []).map((x) => (x.id === a.id ? { ...x, title } : x));
                            return {
                              ...prev,
                              achievements: {
                                title: prev.achievements?.title ?? "About",
                                subtitle: prev.achievements?.subtitle ?? "",
                                items,
                              },
                            };
                          });
                        }}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Year</label>
                      <input
                        value={a.year}
                        onChange={(e) => {
                          const year = e.target.value;
                          setContent((prev) => {
                            if (!prev) return prev;
                            const items = (prev.achievements?.items ?? []).map((x) => (x.id === a.id ? { ...x, year } : x));
                            return {
                              ...prev,
                              achievements: {
                                title: prev.achievements?.title ?? "About",
                                subtitle: prev.achievements?.subtitle ?? "",
                                items,
                              },
                            };
                          });
                        }}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Category</label>
                      <select
                        value={a.category}
                        onChange={(e) => {
                          const category = e.target.value as Achievement["category"];
                          setContent((prev) => {
                            if (!prev) return prev;
                            const items = (prev.achievements?.items ?? []).map((x) => (x.id === a.id ? { ...x, category } : x));
                            return {
                              ...prev,
                              achievements: {
                                title: prev.achievements?.title ?? "About",
                                subtitle: prev.achievements?.subtitle ?? "",
                                items,
                              },
                            };
                          });
                        }}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      >
                        <option value="milestone">milestone</option>
                        <option value="project">project</option>
                        <option value="competition">competition</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Description</label>
                      <input
                        value={a.description}
                        onChange={(e) => {
                          const description = e.target.value;
                          setContent((prev) => {
                            if (!prev) return prev;
                            const items = (prev.achievements?.items ?? []).map((x) => (x.id === a.id ? { ...x, description } : x));
                            return {
                              ...prev,
                              achievements: {
                                title: prev.achievements?.title ?? "About",
                                subtitle: prev.achievements?.subtitle ?? "",
                                items,
                              },
                            };
                          });
                        }}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">No achievements yet.</div>
            )}
          </div>
        </div>

        {/* About Me */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">About Me</h2>
              <p className="mt-1 text-sm text-zinc-400">Two-column lists: strengths and currently learning.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                    aboutMe.strengths = [...(aboutMe.strengths ?? []), ""];
                    return { ...prev, aboutMe };
                  });
                }}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                Add Strength
              </button>
              <button
                onClick={() => {
                  setContent((prev) => {
                    if (!prev) return prev;
                    const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                    aboutMe.learning = [...(aboutMe.learning ?? []), ""];
                    return { ...prev, aboutMe };
                  });
                }}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                Add Learning
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Title</label>
              <input
                value={content.aboutMe?.title ?? ""}
                onChange={(e) => {
                  const title = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                    return { ...prev, aboutMe: { ...aboutMe, title } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Subtitle</label>
              <input
                value={content.aboutMe?.subtitle ?? ""}
                onChange={(e) => {
                  const subtitle = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                    return { ...prev, aboutMe: { ...aboutMe, subtitle } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <label className="mb-1 block text-xs text-zinc-400">Strengths Title</label>
              <input
                value={content.aboutMe?.strengthsTitle ?? ""}
                onChange={(e) => {
                  const strengthsTitle = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                    return { ...prev, aboutMe: { ...aboutMe, strengthsTitle } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
              <div className="mt-3 grid gap-2">
                {(content.aboutMe?.strengths ?? []).map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={s}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                          const strengths = (aboutMe.strengths ?? []).map((x, i) => (i === idx ? val : x));
                          return { ...prev, aboutMe: { ...aboutMe, strengths } };
                        });
                      }}
                      className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      placeholder="Strength"
                    />
                    <button
                      onClick={() => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                          const strengths = (aboutMe.strengths ?? []).filter((_, i) => i !== idx);
                          return { ...prev, aboutMe: { ...aboutMe, strengths } };
                        });
                      }}
                      className="rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <label className="mb-1 block text-xs text-zinc-400">Learning Title</label>
              <input
                value={content.aboutMe?.learningTitle ?? ""}
                onChange={(e) => {
                  const learningTitle = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                    return { ...prev, aboutMe: { ...aboutMe, learningTitle } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
              <div className="mt-3 grid gap-2">
                {(content.aboutMe?.learning ?? []).map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={s}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent((prev) => {
                          if (!prev) return prev;
                          const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                          const learning = (aboutMe.learning ?? []).map((x, i) => (i === idx ? val : x));
                          return { ...prev, aboutMe: { ...aboutMe, learning } };
                        });
                      }}
                      className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                      placeholder="Learning"
                    />
                    <button
                      onClick={() => {
                        setContent((prev) => {
                          if (!prev) return prev;
                          const aboutMe = prev.aboutMe ?? structuredClone(DEFAULT_ABOUT_ME);
                          const learning = (aboutMe.learning ?? []).filter((_, i) => i !== idx);
                          return { ...prev, aboutMe: { ...aboutMe, learning } };
                        });
                      }}
                      className="rounded-lg bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Contact Section</h2>
            <p className="mt-1 text-sm text-zinc-400">Bottom CTA section (email button + resume link).</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Title</label>
              <input
                value={content.contactSection?.title ?? ""}
                onChange={(e) => {
                  const title = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                    return { ...prev, contactSection: { ...contactSection, title } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Subtitle</label>
              <input
                value={content.contactSection?.subtitle ?? ""}
                onChange={(e) => {
                  const subtitle = e.target.value;
                  setContent((prev) => {
                    if (!prev) return prev;
                    const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                    return { ...prev, contactSection: { ...contactSection, subtitle } };
                  });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">Primary CTA</p>
              <div className="mt-3 grid gap-2">
                <input
                  value={content.contactSection?.primaryCta?.label ?? ""}
                  onChange={(e) => {
                    const label = e.target.value;
                    setContent((prev) => {
                      if (!prev) return prev;
                      const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                      return { ...prev, contactSection: { ...contactSection, primaryCta: { ...(contactSection.primaryCta ?? { label: "", href: "" }), label } } };
                    });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                  placeholder="Label"
                />
                <input
                  value={content.contactSection?.primaryCta?.href ?? ""}
                  onChange={(e) => {
                    const href = e.target.value;
                    setContent((prev) => {
                      if (!prev) return prev;
                      const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                      return { ...prev, contactSection: { ...contactSection, primaryCta: { ...(contactSection.primaryCta ?? { label: "", href: "" }), href } } };
                    });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                  placeholder="mailto:... or https://..."
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Secondary CTA</p>
                <button
                  onClick={() => {
                    setContent((prev) => {
                      if (!prev) return prev;
                      const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                      const nextSecondary = contactSection.secondaryCta ? undefined : { label: "", href: "" };
                      return { ...prev, contactSection: { ...contactSection, secondaryCta: nextSecondary } };
                    });
                  }}
                  className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"
                >
                  {content.contactSection?.secondaryCta ? "Remove" : "Add"}
                </button>
              </div>

              {content.contactSection?.secondaryCta ? (
                <div className="mt-3 grid gap-2">
                  <input
                    value={content.contactSection.secondaryCta.label}
                    onChange={(e) => {
                      const label = e.target.value;
                      setContent((prev) => {
                        if (!prev) return prev;
                        const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                        return {
                          ...prev,
                          contactSection: {
                            ...contactSection,
                            secondaryCta: { ...(contactSection.secondaryCta ?? { label: "", href: "" }), label },
                          },
                        };
                      });
                    }}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                    placeholder="Label"
                  />
                  <input
                    value={content.contactSection.secondaryCta.href}
                    onChange={(e) => {
                      const href = e.target.value;
                      setContent((prev) => {
                        if (!prev) return prev;
                        const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                        return {
                          ...prev,
                          contactSection: {
                            ...contactSection,
                            secondaryCta: { ...(contactSection.secondaryCta ?? { label: "", href: "" }), href },
                          },
                        };
                      });
                    }}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                    placeholder="https://..."
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm text-zinc-400">Optional.</p>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Resume block</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Resume title</label>
                <input
                  value={content.contactSection?.resumeTitle ?? ""}
                  onChange={(e) => {
                    const resumeTitle = e.target.value;
                    setContent((prev) => {
                      if (!prev) return prev;
                      const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                      return { ...prev, contactSection: { ...contactSection, resumeTitle } };
                    });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Resume CTA label</label>
                <input
                  value={content.contactSection?.resumeCta?.label ?? ""}
                  onChange={(e) => {
                    const label = e.target.value;
                    setContent((prev) => {
                      if (!prev) return prev;
                      const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                      return { ...prev, contactSection: { ...contactSection, resumeCta: { ...(contactSection.resumeCta ?? { label: "", href: "" }), label } } };
                    });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                />
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Resume CTA href</label>
                <input
                  value={content.contactSection?.resumeCta?.href ?? ""}
                  onChange={(e) => {
                    const href = e.target.value;
                    setContent((prev) => {
                      if (!prev) return prev;
                      const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                      return { ...prev, contactSection: { ...contactSection, resumeCta: { ...(contactSection.resumeCta ?? { label: "", href: "" }), href } } };
                    });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                  placeholder="mailto:... or https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Resume body</label>
                <input
                  value={content.contactSection?.resumeBody ?? ""}
                  onChange={(e) => {
                    const resumeBody = e.target.value;
                    setContent((prev) => {
                      if (!prev) return prev;
                      const contactSection = prev.contactSection ?? structuredClone(DEFAULT_CONTACT_SECTION);
                      return { ...prev, contactSection: { ...contactSection, resumeBody } };
                    });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Footer</h2>
          <p className="mt-1 text-sm text-zinc-400">Small footer line shown on the homepage.</p>
          <div className="mt-4">
            <label className="mb-1 block text-xs text-zinc-400">Right text</label>
            <input
              value={content.footer?.rightText ?? ""}
              onChange={(e) => {
                const rightText = e.target.value;
                setContent((prev) => {
                  if (!prev) return prev;
                  const footer = prev.footer ?? structuredClone(DEFAULT_FOOTER);
                  return { ...prev, footer: { ...footer, rightText } };
                });
              }}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
            />
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Tip: after saving, refresh “/” to see changes.
        </div>
      </div>
    </div>
  );
}
