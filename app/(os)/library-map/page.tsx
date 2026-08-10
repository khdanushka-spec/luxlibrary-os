import Link from "next/link";
import { Layers } from "lucide-react";
import { hashCode } from "@/lib/book-detail";
import { getShelfMapFromDb } from "@/lib/db-books";
import { coverGradient } from "@/lib/mock-data";

export const metadata = {
  title: "Library Map — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

export default async function LibraryMapPage() {
  const shelves = await getShelfMapFromDb();
  const totalBooks = shelves.reduce((sum, s) => sum + s.books.length, 0);

  const rooms = new Map<string, typeof shelves>();
  for (const shelf of shelves) {
    const list = rooms.get(shelf.room) ?? [];
    list.push(shelf);
    rooms.set(shelf.room, list);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Layers className="size-6 text-gold" />
          Library Map
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {totalBooks.toLocaleString()} books across {shelves.length} shelves
        </p>
      </div>

      {Array.from(rooms.entries()).map(([room, roomShelves]) => (
        <div key={room}>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {room}
          </h2>
          <div className="space-y-6">
            {roomShelves.map((shelf) => (
              <div
                key={shelf.id}
                className="rounded-2xl border border-border/70 bg-card/60 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    {shelf.label}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {shelf.books.length}
                    {shelf.capacity ? ` / ${shelf.capacity}` : ""} books
                  </span>
                </div>

                {shelf.capacity && (
                  <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{
                        width: `${Math.min(100, (shelf.books.length / shelf.capacity) * 100)}%`,
                      }}
                    />
                  </div>
                )}

                {shelf.books.length > 0 ? (
                  <div className="flex flex-wrap items-end gap-1.5 border-b-2 border-border/60 pb-2">
                    {shelf.books.map((book) => (
                      <Link
                        key={book.id}
                        href={`/library/${book.id}`}
                        title={`${book.title} — ${book.author}`}
                        className={`h-16 w-4 shrink-0 rounded-sm bg-gradient-to-b shadow-sm transition-transform hover:-translate-y-1 ${coverGradient(
                          hashCode(book.id)
                        )}`}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="border-b-2 border-border/60 pb-2 text-xs text-muted-foreground">
                    Empty shelf.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
