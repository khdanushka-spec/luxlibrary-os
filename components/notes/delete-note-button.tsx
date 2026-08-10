"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteNote } from "@/lib/note-actions";

export function DeleteNoteButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteNote(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      disabled={isPending}
      className={
        confirming
          ? "inline-flex shrink-0 items-center gap-1 text-xs text-rose-400 transition-colors disabled:opacity-60"
          : "inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-rose-400 disabled:opacity-60"
      }
    >
      <Trash2 className="size-3.5" />
      {confirming && "Confirm?"}
    </button>
  );
}
