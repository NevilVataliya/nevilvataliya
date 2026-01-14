"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type NavItem = { id: string; label: string };

type NavbarBrand = {
  name: string;
  mobileSubtitle: string;
  desktopSubtitle: string;
};

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.05, 0.15, 0.25] }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Navbar({
  brand,
  items,
}: {
  brand?: Partial<NavbarBrand>;
  items?: NavItem[];
}) {
  return <NavbarInner brand={brand} items={items} />;
}

function NavbarInner({
  brand,
  items,
}: {
  brand?: Partial<NavbarBrand>;
  items?: NavItem[];
}) {
  const resolvedBrand: NavbarBrand = {
    name: brand?.name ?? "Nevil",
    mobileSubtitle: brand?.mobileSubtitle ?? "nevil.codes",
    desktopSubtitle: brand?.desktopSubtitle ?? "SVNIT • CSE",
  };

  const resolvedItems: NavItem[] = useMemo(
    () =>
      Array.isArray(items) && items.length
        ? items
        : [
            { id: "home", label: "Home" },
            { id: "projects", label: "Projects" },
            { id: "experience", label: "Experience" },
            { id: "tech", label: "Tech Stack" },
            { id: "about", label: "About" },
            { id: "contact", label: "Contact" },
          ],
    [items]
  );

  const active = useActiveSection(resolvedItems.map((i) => i.id));

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-zinc-900 to-black">
              <Image
                src="/profile.webp"
                alt="Profile photo"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">{resolvedBrand.name}</p>
              <p className="text-[11px] text-zinc-400">{resolvedBrand.mobileSubtitle}</p>
            </div>
          </div>
          {/* <Link
            href="/admin/login"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
          >
            Admin
          </Link> */}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-white/5 bg-black/40 backdrop-blur-xl md:block">
        <div className="flex h-full flex-col px-5 py-8">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-zinc-900 to-black">
              <Image
                src="/profile.webp"
                alt="Profile photo"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">{resolvedBrand.name}</p>
              <p className="text-[11px] text-zinc-400">{resolvedBrand.desktopSubtitle}</p>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            {resolvedItems.map((it) => {
              const isActive = active === it.id;
              return (
                <a
                  key={it.id}
                  href={`#${it.id}`}
                  className={
                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors " +
                    (isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200")
                  }
                >
                  <span>{it.label}</span>
                  {isActive ? <span className="text-xs text-zinc-400">•</span> : null}
                </a>
              );
            })}
          </nav>

          {/* <div className="mt-auto pt-6">
            <Link
              href="/admin/login"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Admin Login
            </Link>
          </div> */}
        </div>
      </aside>
    </>
  );
}
