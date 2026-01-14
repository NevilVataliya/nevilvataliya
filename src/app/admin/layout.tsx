import type { ReactNode } from "react";
import { ConsoleHint } from "@/components/portfolio/ConsoleHint";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ConsoleHint
        config={{
          enabled: true,
          logToConsole: false,
          uiConsole: { enabled: true },
          consoleTitle: "admin --help",
          about: "Admin console",
          stack: ["Next.js", "MongoDB"],
          links: [
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Content", href: "/admin/content" },
          ],
        }}
      />
      {children}
    </>
  );
}
