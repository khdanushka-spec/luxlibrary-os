"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, X } from "lucide-react";
import type { ShareableBook } from "./types";

export function ShareBookDialog({
  books,
  onClose,
  onShare,
}: {
  books: ShareableBook[];
  onClose: () => void;
  onShare: (bookId: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase())
  );

  async function handleShare(bookId: string) {
    setError(null);
    setSharingId(bookId);
    const result = await onShare(bookId);
    setSharingId(null);
    if (!result.ok) setError(result.error ?? "Couldn't share that book.");
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative max-h-[80vh] w-full max-w-md overflow-hidden rounded-2xl border border-border/70 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/60 p-5 pb-4">
          <h3 className="font-display text-xl text-foreground">Share a Book</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 pt-4">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your library…"
            className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
          />

          {error && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="size-3.5" />
              {error}
            </p>
          )}

          <div className="mt-3 max-h-80 space-y-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                {books.length === 0 ? "Your library is empty." : "No books match."}
              </p>
            ) : (
              filtered.map((book) => (
                <button
                  key={book.id}
                  onClick={() => handleShare(book.id)}
                  disabled={sharingId !== null}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary/50 disabled:opacity-60"
                >
                  {book.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-pasted/uploaded cover source
                    <img
                      src={book.coverImageUrl}
                      alt=""
                      className="h-12 w-9 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-9 shrink-0 rounded bg-gradient-to-br from-gold/30 to-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{book.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  {sharingId === book.id && (
                    <span className="shrink-0 text-xs text-muted-foreground">Sharing…</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
