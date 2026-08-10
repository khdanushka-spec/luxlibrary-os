"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, X } from "lucide-react";
import { addShelf } from "@/lib/shelf-actions";

export function AddShelfDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [label, setLabel] = useState("");
  const [room, setRoom] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setError(null);
    setLabel("");
    setRoom("");
    setCapacity("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await addShelf({
        label,
        room: room.trim() || undefined,
        capacity: capacity ? Number(capacity) : null,
      });
      if (result.ok) {
        close();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plus className="size-3.5" />
        New Shelf
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="glass relative w-full max-w-sm rounded-2xl border border-border/70 p-6 shadow-2xl">
            <button
              onClick={close}
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <form onSubmit={handleSubmit}>
              <h3 className="font-display mb-5 text-xl text-foreground">New Shelf</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Label *
                  </label>
                  <input
                    required
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="F1"
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Room
                    </label>
                    <input
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      placeholder="Study"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Optional"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-4 flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="size-3.5" />
                  {error}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="h-9 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground disabled:opacity-60"
                >
                  {isPending ? "Creating…" : "Create Shelf"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
