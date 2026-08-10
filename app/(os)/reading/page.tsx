import { BookOpen, Clock, Flame, XCircle } from "lucide-react";
import { BarList } from "@/components/analytics/bar-list";
import { BookListRow } from "@/components/library/book-list-row";
import { ReadingChallengeRing } from "@/components/dashboard/reading-challenge-ring";
import { coverGradient } from "@/lib/mock-data";
import { getAllBooksFromDb } from "@/lib/db-books";
import { getCurrentUser } from "@/lib/auth";
import {
  getCompletedThisYear,
  getCurrentlyReading,
  getDnfBooks,
  getMonthlyReadingCounts,
  getReadingStats,
} from "@/lib/reading";

export const metadata = {
  title: "Reading Life — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);

  const currentlyReading = getCurrentlyReading(books);
  const completedThisYear = getCompletedThisYear(books);
  const dnfBooks = getDnfBooks(books);
  const monthly = getMonthlyReadingCounts(books);
  const stats = getReadingStats(books);

  const statTiles = [
    { icon: BookOpen, label: "Currently reading", value: stats.currentlyReadingCount },
    { icon: Clock, label: "Completed this year", value: stats.completedThisYearCount },
    { icon: Flame, label: "Reading streak", value: `${stats.readingStreakDays} days` },
    { icon: BookOpen, label: "Pages read this year", value: stats.pagesReadThisYear.toLocaleString() },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <BookOpen className="size-6 text-gold" />
          Reading Life
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything about how you&apos;re reading right now
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statTiles.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/70 bg-card/60 p-5"
          >
            <stat.icon className="mb-3 size-4 text-gold" />
            <div className="font-display text-2xl text-foreground">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-6 lg:col-span-2">
          <h3 className="mb-5 text-sm font-medium text-foreground">
            Currently Reading
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {currentlyReading.map(({ book, progress, daysReading }, i) => (
              <div key={book.id} className="flex gap-4">
                <div
                  className={`h-24 w-16 shrink-0 rounded-md bg-gradient-to-br shadow-md ${coverGradient(i)}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {book.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {book.author}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Day {daysReading} &middot; {progress}%
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ReadingChallengeRing completed={completedThisYear.length} />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <h3 className="mb-5 text-sm font-medium text-foreground">
          Books Completed by Month
        </h3>
        <BarList data={monthly} />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 px-5">
        <h3 className="px-1 pt-5 text-sm font-medium text-foreground">
          Completed This Year ({completedThisYear.length})
        </h3>
        <div className="mt-2">
          {completedThisYear.map(({ book }, i) => (
            <BookListRow key={book.id} book={book} index={i} />
          ))}
        </div>
      </div>

      {dnfBooks.length > 0 && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.03] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <XCircle className="size-4 text-rose-400" />
            Did Not Finish
          </h3>
          <div className="space-y-1">
            {dnfBooks.map((book, i) => (
              <BookListRow key={book.id} book={book} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
