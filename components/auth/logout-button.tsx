"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth-actions";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await logout();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={
        className ??
        "inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
      }
    >
      <LogOut className="size-3.5" />
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
