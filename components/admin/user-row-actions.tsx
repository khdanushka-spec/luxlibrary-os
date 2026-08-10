"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { approveUser, rejectUser } from "@/lib/admin-actions";

export function UserRowActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handle(action: (id: string) => Promise<{ ok: boolean }>) {
    startTransition(async () => {
      await action(userId);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handle(approveUser)}
        disabled={isPending}
        className="inline-flex h-8 items-center gap-1 rounded-full bg-gold px-3 text-xs font-medium text-gold-foreground disabled:opacity-60"
      >
        <Check className="size-3.5" />
        Approve
      </button>
      <button
        onClick={() => handle(rejectUser)}
        disabled={isPending}
        className="inline-flex h-8 items-center gap-1 rounded-full border border-border/70 px-3 text-xs text-muted-foreground transition-colors hover:text-rose-400 disabled:opacity-60"
      >
        <X className="size-3.5" />
        Reject
      </button>
    </div>
  );
}
