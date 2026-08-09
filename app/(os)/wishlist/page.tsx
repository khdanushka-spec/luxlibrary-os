import { Bookmark } from "lucide-react";
import { BookCard } from "@/components/library/book-card";
import { getAllBooksFromDb } from "@/lib/db-books";

export const metadata = {
  title: "Wishlist — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const books = await getAllBooksFromDb();
  const wishlistBooks = books.filter((b) => b.status === "wishlist");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Bookmark className="size-6 text-gold" />
          Wishlist
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {wishlistBooks.length} books you don&apos;t own yet
        </p>
      </div>

      {wishlistBooks.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {wishlistBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
