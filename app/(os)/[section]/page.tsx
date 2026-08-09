import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { NAV_FOOTER_ITEMS, NAV_GROUPS } from "@/lib/nav";

const ALL_ITEMS = [...NAV_GROUPS.flatMap((g) => g.items), ...NAV_FOOTER_ITEMS];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = ALL_ITEMS.find((i) => i.href === `/${section}`);
  return { title: item ? `${item.label} — LuxLibrary OS` : "LuxLibrary OS" };
}

export default async function SectionPlaceholderPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = ALL_ITEMS.find((i) => i.href === `/${section}`);
  if (!item) notFound();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
        <item.icon className="size-6" />
      </div>
      <h1 className="font-display text-3xl text-foreground">{item.label}</h1>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Sparkles className="size-3.5 text-gold" />
        This module hasn&apos;t been built yet — Home Dashboard came first.
      </p>
    </div>
  );
}
