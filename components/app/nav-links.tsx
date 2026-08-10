"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, ShieldCheck } from "lucide-react";
import { NAV_FOOTER_ITEMS, NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Shared nav content rendered by both the desktop sidebar and the mobile drawer. */
export function NavLinks({
  isSuperAdmin,
  communityUnreadCount = 0,
  onNavigate,
}: {
  isSuperAdmin: boolean;
  communityUnreadCount?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
      active ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
    );

  return (
    <>
      <nav className="flex-1 space-y-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="mb-2 px-2 text-[0.68rem] font-medium tracking-[0.14em] text-muted-foreground/70">
              {group.label.toUpperCase()}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const unread = item.href === "/community" ? communityUnreadCount : 0;
                return (
                  <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(active)}>
                    <item.icon className="size-4" />
                    <span className="flex-1">{item.label}</span>
                    {unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[0.68rem] font-semibold text-gold-foreground">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 space-y-0.5 border-t border-border/60 pt-4">
        {isSuperAdmin && (
          <>
            <Link
              href="/master-library"
              onClick={onNavigate}
              className={linkClass(pathname.startsWith("/master-library"))}
            >
              <Library className="size-4" />
              Master Library
            </Link>
            <Link href="/admin" onClick={onNavigate} className={linkClass(pathname.startsWith("/admin"))}>
              <ShieldCheck className="size-4" />
              Admin
            </Link>
          </>
        )}
        {NAV_FOOTER_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(pathname.startsWith(item.href))}>
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
