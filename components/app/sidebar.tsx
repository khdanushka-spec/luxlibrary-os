"use client";

import Link from "next/link";
import { LogoMark } from "@/components/home/logo-mark";
import { NavLinks } from "./nav-links";

export function AppSidebar({
  isSuperAdmin,
  communityUnreadCount = 0,
}: {
  isSuperAdmin: boolean;
  communityUnreadCount?: number;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 px-4 py-6 lg:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <LogoMark className="h-6 w-6" />
        <span className="font-display text-[1.05rem] tracking-tight text-foreground">
          Bring<span className="text-gold">Books</span>
        </span>
      </Link>

      <NavLinks isSuperAdmin={isSuperAdmin} communityUnreadCount={communityUnreadCount} />
    </aside>
  );
}
