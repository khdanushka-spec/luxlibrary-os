import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { COLLECTIONS, getCollectionBooks } from "@/lib/collections";
import { getAllBooksFromDb } from "@/lib/db-books";
import { coverGradient } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Collections — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const user = (await getCurrentUser())!;
  const allBooks = await getAllBooksFromDb(user.id);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <LayoutGrid className="size-6 text-gold" />
          Collections
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Smart groupings, generated automatically from your library
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((collection) => {
          const books = getCollectionBooks(collection, allBooks);
          return (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="rounded-2xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-gold/40 hover:bg-card"
            >
              <div className="mb-4 flex h-14 items-center">
                {books.slice(0, 4).map((book, i) => (
                  <div
                    key={book.id}
                    className={`h-14 w-10 shrink-0 rounded bg-gradient-to-br shadow-md ${coverGradient(i)}`}
                    style={{
                      marginLeft: i === 0 ? 0 : -16,
                      zIndex: 4 - i,
                    }}
                  />
                ))}
                {books.length === 0 && (
                  <div className="flex h-14 w-10 items-center justify-center rounded border border-dashed border-border/70 text-[0.6rem] text-muted-foreground">
                    Empty
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-foreground">
                {collection.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {collection.description}
              </p>
              <p className="mt-3 text-xs text-gold">
                {books.length} {books.length === 1 ? "book" : "books"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
