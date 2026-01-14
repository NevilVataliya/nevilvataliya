"use client";

import { useEffect, useMemo, useState } from "react";

type Thought = { id: string; text: string };

type ThoughtGeneratorProps = {
  title?: string;
  subtitle?: string;
  items?: Thought[];
  shareAttribution?: string;
};

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-zinc-200 hover:bg-white/10 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function GenerateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12a9 9 0 0 0-15.3-6.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 5v6h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12a9 9 0 0 0 15.3 6.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 19v-6h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden
      className={filled ? "text-rose-400" : "text-zinc-200"}
    >
      <path
        d="M12 21s-7.5-4.7-9.6-9.1C.9 8.9 2.2 6 5.4 5.2c1.7-.4 3.6.2 4.6 1.6c1-1.4 2.9-2 4.6-1.6C17.8 6 19.1 8.9 21.6 11.9C19.5 16.3 12 21 12 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThoughtGenerator({
  title = "Thought Generator",
  subtitle = "Deep thoughts to keep building momentum.",
  items = [],
}: ThoughtGeneratorProps) {
  const thoughts: Thought[] = useMemo(() => (Array.isArray(items) ? items.filter((t) => !!t?.text) : []), [items]);

  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const current = thoughts.length ? thoughts[index] : null;

  useEffect(() => {
    if (!thoughts.length) return;
    setIndex((i) => Math.min(i, thoughts.length - 1));
  }, [thoughts.length]);

  const onGenerate = () => {
    if (!thoughts.length) return;
    if (thoughts.length === 1) return;
    setIndex((i) => {
      const next = Math.floor(Math.random() * thoughts.length);
      return next === i ? (next + 1) % thoughts.length : next;
    });
  };

  const onToggleLike = () => {
    if (!current) return;
    setLiked((prev) => ({ ...prev, [current.id]: !(prev[current.id] ?? false) }));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-linear-to-b from-white/7 to-white/3 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle ? <p className="mt-1 text-xs text-zinc-400">{subtitle}</p> : null}
        </div>

        <div className="flex items-center gap-2">
          <IconButton label="Generate" onClick={onGenerate} disabled={!thoughts.length}>
            <GenerateIcon />
          </IconButton>
          <IconButton label={current && liked[current.id] ? "Unlike" : "Like"} onClick={onToggleLike} disabled={!current}>
            <HeartIcon filled={!!(current && liked[current.id])} />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-5">
        {current ? (
          <p className="text-base leading-relaxed text-zinc-100">“{current.text}”</p>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-zinc-200">No thoughts yet.</p>
            <p className="mt-2 text-xs text-zinc-500">Add some in Admin → Site Content.</p>
          </>
        )}
      </div>
    </div>
  );
}
