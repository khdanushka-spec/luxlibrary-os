import type { ReactNode } from "react";
import { LegalHeader } from "./legal-header";
import { SiteFooter } from "@/components/home/site-footer";

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <LegalHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-display text-4xl text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated {lastUpdated}</p>
          <div className="legal-prose mt-10">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
