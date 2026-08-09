"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Pencil, X } from "lucide-react";
import { updateBook } from "@/lib/book-actions";
import type { BookFormat, BookStatus } from "@/lib/mock-data";

const GENRE_OPTIONS = [
  "Literary Fiction",
  "Fantasy",
  "Science Fiction",
  "History",
  "Science",
  "Philosophy",
  "Biography",
];

const FORMAT_OPTIONS: BookFormat[] = ["Hardcover", "Paperback", "Ebook", "Audiobook", "Leather"];
const STATUS_OPTIONS: { label: string; value: BookStatus }[] = [
  { label: "Wishlist", value: "wishlist" },
  { label: "Unread", value: "unread" },
  { label: "Reading", value: "reading" },
  { label: "Completed", value: "completed" },
  { label: "DNF", value: "dnf" },
];

type EditBookDialogProps = {
  id: string;
  title: string;
  author: string;
  genre: string;
  format: BookFormat;
  status: BookStatus;
  rating: number | null;
  publisher?: string;
  isbn13?: string;
  pages?: number;
  year?: number;
  purchasePrice?: number;
};

export function EditBookDialog({
  id,
  title: initialTitle,
  author: initialAuthor,
  genre: initialGenre,
  format: initialFormat,
  status: initialStatus,
  rating: initialRating,
  publisher: initialPublisher,
  isbn13: initialIsbn13,
  pages: initialPages,
  year: initialYear,
  purchasePrice: initialPurchasePrice,
}: EditBookDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [genre, setGenre] = useState(initialGenre);
  const [format, setFormat] = useState<BookFormat>(initialFormat);
  const [status, setStatus] = useState<BookStatus>(initialStatus);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [publisher, setPublisher] = useState(initialPublisher ?? "");
  const [isbn13, setIsbn13] = useState(initialIsbn13 ?? "");
  const [pages, setPages] = useState(initialPages ? String(initialPages) : "");
  const [year, setYear] = useState(initialYear ? String(initialYear) : "");
  const [purchasePrice, setPurchasePrice] = useState(
    initialPurchasePrice ? String(initialPurchasePrice) : ""
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await updateBook(id, {
        title,
        author,
        genre,
        format,
        status,
        rating,
        publisher: publisher.trim() || undefined,
        isbn13: isbn13.trim() || undefined,
        pages: pages ? Number(pages) : null,
        year: year ? Number(year) : null,
        purchasePrice: purchasePrice ? Number(purchasePrice) : null,
      });
      if (result.ok) {
        setOpen(false);
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
        <Pencil className="size-3.5" />
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="glass relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/70 p-6 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <form onSubmit={handleSubmit}>
              <h3 className="font-display mb-5 text-xl text-foreground">Edit Book</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Title *
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
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
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Genre
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      {GENRE_OPTIONS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as BookFormat)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      {FORMAT_OPTIONS.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Reading status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as BookStatus)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Rating
                    </label>
                    <select
                      value={rating ?? ""}
                      onChange={(e) => setRating(e.target.value ? Number(e.target.value) : null)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      <option value="">No rating</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} star{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Publisher
                  </label>
                  <input
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="Anchor Books"
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Year
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Pages
                    </label>
                    <input
                      type="number"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      ISBN-13
                    </label>
                    <input
                      value={isbn13}
                      onChange={(e) => setIsbn13(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Purchase price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
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
                  onClick={() => setOpen(false)}
                  className="h-9 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground disabled:opacity-60"
                >
                  {isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
