"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteBook } from "@/lib/book-actions";

export function DeleteBookButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteBook(id);
      router.push("/library");
    });
  }

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      disabled={isPending}
      className={
        confirming
          ? "inline-flex h-9 items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-400/10 px-4 text-sm text-rose-400 transition-colors disabled:opacity-60"
          : "inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-rose-400"
      }
    >
      <Trash2 className="size-3.5" />
      {isPending ? "Deleting…" : confirming ? "Confirm delete?" : "Delete"}
    </button>
  );
}
