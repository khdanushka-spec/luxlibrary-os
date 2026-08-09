import Link from "next/link";
import { Users } from "lucide-react";
import { MOCK_BOOKS } from "@/lib/mock-data";

export const metadata = {
  title: "Authors — LuxLibrary OS",
};

function getAuthors() {
  const map = new Map<string, { name: string; count: number; genres: Set<string> }>();
  for (const book of MOCK_BOOKS) {
    const entry = map.get(book.author) ?? {
      name: book.author,
      count: 0,
      genres: new Set<string>(),
    };
    entry.count += 1;
    entry.genres.add(book.genre);
    map.set(book.author, entry);
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Users className="size-6 text-gold" />
          Authors
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {authors.length} authors across your collection
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Link
            key={author.name}
            href={`/library?q=${encodeURIComponent(author.name)}`}
            className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-gold/40 hover:bg-card"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
              {author.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {author.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {author.count} {author.count === 1 ? "book" : "books"} ·{" "}
                {Array.from(author.genres).slice(0, 2).join(", ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
