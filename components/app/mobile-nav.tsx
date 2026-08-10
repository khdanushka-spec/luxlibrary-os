"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/home/logo-mark";
import { NavLinks } from "./nav-links";

export function MobileNav({
  isSuperAdmin,
  communityUnreadCount = 0,
}: {
  isSuperAdmin: boolean;
  communityUnreadCount?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {open &&
        createPortal(
          // Portalled to <body>: the topbar header uses backdrop-blur,
          // which makes it a containing block for fixed descendants, so a
          // "fixed inset-0" overlay nested inside it only fills the
          // header's own height instead of the viewport.
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto border-r border-border/60 bg-background px-4 py-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between px-2">
                <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                  <LogoMark className="h-6 w-6" />
                  <span className="font-display text-[1.05rem] tracking-tight text-foreground">
                    Bring<span className="text-gold">Books</span>
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              <NavLinks
                isSuperAdmin={isSuperAdmin}
                communityUnreadCount={communityUnreadCount}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
