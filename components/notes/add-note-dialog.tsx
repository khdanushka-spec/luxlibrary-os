"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, X } from "lucide-react";
import { addNote } from "@/lib/note-actions";

type BookOption = { id: string; title: string; author: string };

export function AddNoteDialog({
  books = [],
  lockedBookId,
  lockedBookLabel,
}: {
  books?: BookOption[];
  /** When set, the book picker is hidden and every note is attached to this book (used on a Book Detail page). */
  lockedBookId?: string;
  lockedBookLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [bookId, setBookId] = useState(lockedBookId ?? "");

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
    setTitle("");
    setContent("");
    setBookId(lockedBookId ?? "");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await addNote({
        title: title.trim() || undefined,
        content,
        bookId: bookId || undefined,
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
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gold px-4 text-sm font-medium text-gold-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="size-4" />
        Add Note
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="glass relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/70 p-6 shadow-2xl">
            <button
              onClick={close}
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <form onSubmit={handleSubmit}>
              <h3 className="font-display mb-5 text-xl text-foreground">Add a Note</h3>

              <div className="space-y-4">
                {lockedBookId ? (
                  <p className="text-xs text-muted-foreground">
                    For <span className="text-foreground">{lockedBookLabel}</span>
                  </p>
                ) : (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Book
                    </label>
                    <select
                      value={bookId}
                      onChange={(e) => setBookId(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      <option value="">General note</option>
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} — {b.author}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Optional"
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Note *
                  </label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    placeholder="What's on your mind?"
                    className="w-full resize-none rounded-lg border border-border/70 bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
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
                  {isPending ? "Saving…" : "Add Note"}
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
