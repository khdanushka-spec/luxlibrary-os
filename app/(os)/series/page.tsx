import Link from "next/link";
import { Gem } from "lucide-react";
import { getAllBooksFromDb } from "@/lib/db-books";
import { getSeriesList, seriesSlug } from "@/lib/series";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Series — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);
  const series = getSeriesList(books);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Gem className="size-6 text-gold" />
          Series
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {series.length} series represented in your collection
        </p>
      </div>

      {series.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
          No multi-book series catalogued yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((s) => (
            <Link
              key={s.name}
              href={`/series/${seriesSlug(s.name)}`}
              className="rounded-2xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-gold/40 hover:bg-card"
            >
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {s.books[0].author}
              </p>
              <p className="mt-3 text-xs text-gold">
                {s.books.length} of the series owned
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
