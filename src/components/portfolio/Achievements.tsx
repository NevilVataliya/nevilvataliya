export type Achievement = {
  title: string;
  year: string;
  category: "competition" | "project" | "milestone";
  description: string;
};

export function Achievements({ items }: { items: Achievement[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => (
        <div
          key={`${a.title}-${a.year}`}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/15 transition-colors"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-zinc-500">{a.category}</p>
            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] text-zinc-300">
              {a.year}
            </span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-white">{a.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{a.description}</p>
        </div>
      ))}
    </div>
  );
}
