"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, Trash2 } from "lucide-react";
import { deleteUser, disableUser, enableUser } from "@/lib/admin-actions";
import type { UserStatus } from "@/generated/prisma";

export function MemberRowActions({ userId, status }: { userId: string; status: UserStatus }) {
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await (status === "APPROVED" ? disableUser(userId) : enableUser(userId));
      router.refresh();
    });
  }

  function handleDeleteClick() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteUser(userId);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={
          status === "APPROVED"
            ? "inline-flex h-8 items-center gap-1 rounded-full border border-border/70 px-3 text-xs text-muted-foreground transition-colors hover:text-rose-400 disabled:opacity-60"
            : "inline-flex h-8 items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 text-xs font-medium text-emerald-400 disabled:opacity-60"
        }
      >
        {status === "APPROVED" ? <Ban className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
        {status === "APPROVED" ? "Disable" : "Enable"}
      </button>
      <button
        onClick={handleDeleteClick}
        onBlur={() => setConfirmingDelete(false)}
        disabled={isPending}
        className={
          confirmingDelete
            ? "inline-flex h-8 items-center gap-1 rounded-full border border-rose-400/40 bg-rose-400/10 px-3 text-xs font-medium text-rose-400 disabled:opacity-60"
            : "inline-flex h-8 items-center gap-1 rounded-full border border-border/70 px-3 text-xs text-muted-foreground transition-colors hover:text-rose-400 disabled:opacity-60"
        }
      >
        <Trash2 className="size-3.5" />
        {confirmingDelete ? "Confirm?" : "Delete"}
      </button>
    </div>
  );
}
