import type { ReactNode } from "react";

export function Section({
  id,
  title,
  subtitle,
  right,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
          {subtitle ? <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">{subtitle}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
