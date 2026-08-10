"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/home/logo-mark";
import { NAV_FOOTER_ITEMS, NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function AppSidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 px-4 py-6 lg:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <LogoMark className="h-6 w-6" />
        <span className="font-display text-[1.05rem] tracking-tight text-foreground">
          LuxLibrary <span className="text-gold">OS</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="mb-2 px-2 text-[0.68rem] font-medium tracking-[0.14em] text-muted-foreground/70">
              {group.label.toUpperCase()}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-gold/10 text-gold"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
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
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                pathname.startsWith("/master-library")
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Library className="size-4" />
              Master Library
            </Link>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <ShieldCheck className="size-4" />
              Admin
            </Link>
          </>
        )}
        {NAV_FOOTER_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
