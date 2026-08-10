"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteShelf } from "@/lib/shelf-actions";

export function DeleteShelfButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      setError(null);
      return;
    }
    startTransition(async () => {
      const result = await deleteShelf(id);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-rose-400">{error}</span>}
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
    </div>
  );
}
