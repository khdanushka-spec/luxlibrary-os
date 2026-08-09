"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Plus, Sparkles, X } from "lucide-react";

const GENRE_OPTIONS = [
  "Literary Fiction",
  "Fantasy",
  "Science Fiction",
  "History",
  "Science",
  "Philosophy",
  "Biography",
];

const FORMAT_OPTIONS = ["Hardcover", "Paperback", "Ebook", "Audiobook", "Leather"];
const STATUS_OPTIONS = ["Wishlist", "Unread", "Reading", "Completed", "DNF"];

export function AddBookDialog() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

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
    setSubmitted(false);
    setTitle("");
    setAuthor("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    setSubmitted(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gold px-4 text-sm font-medium text-gold-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="size-4" />
        Add Book
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="glass relative w-full max-w-md rounded-2xl border border-border/70 p-6 shadow-2xl">
            <button
              onClick={close}
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="mb-4 size-10 text-gold" />
                <h3 className="font-display text-xl text-foreground">
                  &ldquo;{title}&rdquo; added
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  This is a preview of the Add Book flow. Connect a database
                  to permanently save books to your library.
                </p>
                <button
                  onClick={close}
                  className="mt-6 h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="font-display mb-1 text-xl text-foreground">
                  Add a Book
                </h3>
                <p className="mb-5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 text-gold" />
                  Preview only — no database is connected yet
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Title *
                    </label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="The Night Circus"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Author *
                    </label>
                    <input
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Erin Morgenstern"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Genre
                      </label>
                      <select className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none">
                        {GENRE_OPTIONS.map((g) => (
                          <option key={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Format
                      </label>
                      <select className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none">
                        {FORMAT_OPTIONS.map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Reading status
                    </label>
                    <select className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none">
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

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
                    className="h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
