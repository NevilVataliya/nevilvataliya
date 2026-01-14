"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ConsoleLink = { label: string; href: string };

export type ConsoleHintConfig = {
  enabled?: boolean;
  consoleTitle?: string;
  commandsTitle?: string;
  commands?: string[];
  about?: string;
  links?: ConsoleLink[];
  stack?: string[];
  logToConsole?: boolean;
  uiConsole?: {
    enabled?: boolean;
    defaultOpen?: boolean;
  };
};

type ConsoleLine =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string }
  | { kind: "output"; links: Array<{ label: string; href: string }> };

function defaultCommands(): string[] {
  return ["help", "about", "links", "stack", "clear"];
}

function normalizeCmd(raw: string) {
  return raw.trim().replace(/^[-$>]\s*/, "").toLowerCase();
}

export function ConsoleHint({ config }: { config?: ConsoleHintConfig }) {
  const enabled = config?.enabled !== false;
  const uiEnabled = enabled && (config?.uiConsole?.enabled ?? true);

  const title = config?.consoleTitle ?? "n e v i l --help";
  const commandsTitle = config?.commandsTitle ?? "Commands:";
  const commands = Array.isArray(config?.commands) && config?.commands.length ? config.commands : defaultCommands().map((c) => `- ${c}`);

  const about = config?.about ?? "CSE @ SVNIT • backend-first • security • ML";
  const links = Array.isArray(config?.links) ? config.links.filter((l) => !!l?.label && !!l?.href) : [];
  const stack = Array.isArray(config?.stack) ? config.stack.filter(Boolean) : ["Next.js", "TypeScript", "Tailwind", "MongoDB"];

  const [open, setOpen] = useState<boolean>(() => {
    if (!uiEnabled) return false;
    if (config?.uiConsole?.defaultOpen) return true;
    try {
      return localStorage.getItem("cmdOpen") === "1";
    } catch {
      return false;
    }
  });
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<ConsoleLine[]>(() => {
    const initial: ConsoleLine[] = [{ kind: "output", text: `${title}` }, { kind: "output", text: `${commandsTitle} ${defaultCommands().join(" • ")}` }];
    return initial;
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (config?.logToConsole) {
      const msg = `\n%c${title}\n%c${commandsTitle}\n${commands.join("\n")}\n`;
      console.log(
        msg,
        "color:#fff;background:#111;padding:6px 10px;border-radius:10px;font-weight:700;",
        "color:#9ca3af;"
      );
    }

    window.nevil = {
      help() {
        const linksObj = Object.fromEntries(
          links
            .map((l) => [l.label, l.href])
        );
        return {
          about,
          links: linksObj,
          stack,
        };
      },
    };
  }, [about, commands, commandsTitle, config?.logToConsole, enabled, links, stack, title]);

  useEffect(() => {
    if (!uiEnabled) return;
    try {
      localStorage.setItem("cmdOpen", open ? "1" : "0");
    } catch {
      // ignore
    }
  }, [open, uiEnabled]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  const run = (raw: string) => {
    const cmd = normalizeCmd(raw);
    if (!cmd) return;

    setLines((prev) => {
      const next: ConsoleLine[] = [...prev, { kind: "input", text: raw.trim() }];

      if (cmd === "help") {
        next.push({ kind: "output", text: `${defaultCommands().join(" • ")}` });
        return next;
      }

      if (cmd === "about") {
        next.push({ kind: "output", text: about });
        return next;
      }

      if (cmd === "stack") {
        next.push({ kind: "output", text: stack.join(", ") });
        return next;
      }

      if (cmd === "links") {
        if (!links.length) {
          next.push({ kind: "output", text: "No links configured." });
          return next;
        }
        next.push({ kind: "output", links: links.map((l) => ({ label: l.label, href: l.href })) });
        return next;
      }

      if (cmd === "clear") {
        return [{ kind: "output", text: `${title}` }, { kind: "output", text: `${commandsTitle} ${defaultCommands().join(" • ")}` }];
      }

      next.push({ kind: "output", text: `Unknown command: ${cmd}. Try: help` });
      return next;
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input;
    setInput("");
    run(value);
  };

  const show = useMemo(() => uiEnabled, [uiEnabled]);
  if (!show) return null;

  const close = () => setOpen(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold text-zinc-200 backdrop-blur hover:bg-white/10"
        >
          cmd
        </button>
      ) : (
        <div className="w-[min(92vw,520px)] overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-end border-b border-white/10 px-4 py-3">
            {/* <p className="font-mono text-xs font-semibold text-white">{title}</p> */}
            {/* <p> </p> */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLines([{ kind: "output", text: `${title}` }, { kind: "output", text: `${commandsTitle} ${defaultCommands().join(" • ")}` }])}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200 hover:bg-white/10"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200 hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>

          <div className="max-h-[46vh] space-y-2 overflow-auto px-4 py-3 font-mono text-xs">
            {lines.map((l, idx) => {
              if (l.kind === "input") {
                return (
                  <p key={idx} className="text-zinc-300">
                    <span className="text-zinc-500">$</span> {l.text}
                  </p>
                );
              }
              if ("links" in l) {
                return (
                  <div key={idx} className="flex flex-wrap gap-2">
                    {l.links.map((lnk) => (
                      <a
                        key={`${lnk.label}-${lnk.href}`}
                        href={lnk.href}
                        target={lnk.href.startsWith("http") ? "_blank" : undefined}
                        rel={lnk.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200 hover:bg-white/10"
                      >
                        {lnk.label}
                      </a>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} className="whitespace-pre-wrap text-zinc-200">
                  {l.text}
                </p>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="border-t border-white/10 px-4 py-3" onKeyDown={onKeyDown}>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <span className="font-mono text-xs text-zinc-500">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type: help"
                className="w-full bg-transparent font-mono text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
              />
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">{commandsTitle} {defaultCommands().join(" • ")}</p>
          </form>
        </div>
      )}
    </div>
  );
}
