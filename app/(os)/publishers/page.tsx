import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getAllBooksFromDb } from "@/lib/db-books";
import { getPublishers, publisherSlug } from "@/lib/publishers";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Publishers — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function PublishersPage() {
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);
  const publishers = getPublishers(books);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <BookOpen className="size-6 text-gold" />
          Publishers
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {publishers.length} publishers across your collection
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {publishers.map((publisher) => (
          <Link
            key={publisher.name}
            href={`/publishers/${publisherSlug(publisher.name)}`}
            className="rounded-2xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-gold/40 hover:bg-card"
          >
            <p className="text-sm font-medium text-foreground">
              {publisher.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {publisher.books.length}{" "}
              {publisher.books.length === 1 ? "book" : "books"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
