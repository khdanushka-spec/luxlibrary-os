"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, Search } from "lucide-react";
import { STATUS_FILTERS } from "@/lib/book-status";
import type { BookStatus, MockBook } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { BookCard } from "./book-card";
import { BookListRow } from "./book-list-row";

type SortKey = "title" | "author" | "year" | "pages";

export function LibraryView({ books }: { books: MockBook[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState<BookStatus | "all">("all");
  const [genre, setGenre] = useState(searchParams.get("genre") ?? "all");
  const [sortBy, setSortBy] = useState<SortKey>("title");
  const [view, setView] = useState<"grid" | "list">("grid");

  const genres = useMemo(
    () => ["all", ...Array.from(new Set(books.map((b) => b.genre))).sort()],
    [books]
  );

  const filtered = useMemo(() => {
    return books
      .filter((b) => (status === "all" ? true : b.status === status))
      .filter((b) => (genre === "all" ? true : b.genre === genre))
      .filter((b) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "author") return a.author.localeCompare(b.author);
        if (sortBy === "year") return b.year - a.year;
        return b.pages - a.pages;
      });
  }, [books, status, genre, query, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Library</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {filtered.length.toLocaleString()} of {books.length.toLocaleString()}{" "}
          books
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or author..."
            className="h-9 w-full rounded-full border border-border/70 bg-secondary/40 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="h-9 rounded-full border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g === "all" ? "All genres" : g}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-9 rounded-full border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
          >
            <option value="title">Sort: Title</option>
            <option value="author">Sort: Author</option>
            <option value="year">Sort: Newest</option>
            <option value="pages">Sort: Longest</option>
          </select>

          <div className="flex items-center rounded-full border border-border/70 bg-secondary/40 p-0.5">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-colors",
                view === "grid"
                  ? "bg-gold text-gold-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-colors",
                view === "list"
                  ? "bg-gold text-gold-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              status === f.value
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-border/70 text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
          No books match your filters.
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/70 bg-card/60 px-5">
          {filtered.map((book, i) => (
            <BookListRow key={book.id} book={book} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
