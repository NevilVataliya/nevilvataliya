"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GitHubCalendar as GitHubCalendarComponent } from "react-github-calendar";

type CalendarProps = React.ComponentProps<typeof GitHubCalendarComponent>;

const Calendar = dynamic<CalendarProps>(
  async () => {
    const mod = await import("react-github-calendar");
    return mod.GitHubCalendar;
  },
  { ssr: false }
);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function GitHubCalendar({ username }: { username: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(Math.floor(entry.contentRect.width));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { blockSize, blockMargin, fontSize } = useMemo(() => {
    // Calendar is roughly ~53 weeks wide. Compute a block size that fits without overflow.
    const weeks = 53;
    const margin = containerWidth && containerWidth < 560 ? 2 : 3;
    const safeWidth = Math.max(0, containerWidth - 24); // account for padding/labels
    const size = safeWidth ? Math.floor(safeWidth / weeks) - margin : 10;
    const bs = clamp(size, 6, 12);
    return {
      blockSize: bs,
      blockMargin: margin,
      fontSize: bs <= 7 ? 10 : 12,
    };
  }, [containerWidth]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">GitHub</p>
          <p className="mt-1 text-xs text-zinc-400">Recent contributions</p>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-white/10"
        >
          @{username}
        </a>
      </div>

      <div ref={containerRef} className="mt-5 w-full overflow-hidden">
        <Calendar
          username={username}
          blockRadius={4}
          blockSize={blockSize}
          blockMargin={blockMargin}
          fontSize={fontSize}
          colorScheme="dark"
          theme={{
            dark: ["#0b0b0c", "#1f2937", "#2563eb", "#22c55e", "#a3e635"],
          }}
        />
      </div>
    </div>
  );
}
