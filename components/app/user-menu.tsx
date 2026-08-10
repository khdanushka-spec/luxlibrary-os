"use client";

import { useEffect, useRef, useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

export function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/70"
      >
        {initial}
      </button>

      {open && (
        <div className="glass absolute right-0 top-11 z-40 w-56 rounded-xl border border-border/70 p-3 shadow-2xl">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          <div className="mt-3">
            <LogoutButton className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full border border-border/70 text-xs text-muted-foreground transition-colors hover:text-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
