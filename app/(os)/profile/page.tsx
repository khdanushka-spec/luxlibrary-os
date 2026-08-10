import { BookMarked, Calendar, DollarSign, Flame, Star, Tags, Users } from "lucide-react";
import { ReadingChallengeRing } from "@/components/dashboard/reading-challenge-ring";
import {
  getAllBooksFromDb,
  getCollectingSinceFromDb,
  getDashboardStatsFromDb,
  getTopAuthorsFromDb,
  getTopGenresFromDb,
} from "@/lib/db-books";
import { MOCK_STATS } from "@/lib/mock-data";
import { getCompletedThisYear } from "@/lib/reading";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Profile — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = (await getCurrentUser())!;
  const [books, stats, collectingSince, topGenres, topAuthors] = await Promise.all([
    getAllBooksFromDb(user.id),
    getDashboardStatsFromDb(user.id),
    getCollectingSinceFromDb(user.id),
    getTopGenresFromDb(user.id, 1),
    getTopAuthorsFromDb(user.id, 1),
  ]);

  const completedThisYear = getCompletedThisYear(books);
  const ratedBooks = books.filter((b) => b.rating);
  const avgRating = ratedBooks.length
    ? ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) / ratedBooks.length
    : null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const statTiles = [
    { icon: BookMarked, label: "Books in collection", value: stats.totalBooks },
    { icon: Star, label: "Average rating", value: avgRating ? avgRating.toFixed(1) : "—" },
    { icon: DollarSign, label: "Collection value", value: `$${stats.collectionValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
    { icon: Flame, label: "Reading streak", value: `${MOCK_STATS.readingStreakDays} days` },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center gap-5 rounded-2xl border border-border/70 bg-card/60 p-6">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-2xl text-gold">
          {initials}
        </div>
        <div>
          <h1 className="font-display text-2xl text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {collectingSince && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="size-3.5" />
              Collecting since{" "}
              {collectingSince.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statTiles.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/70 bg-card/60 p-5"
          >
            <stat.icon className="mb-3 size-4 text-gold" />
            <div className="font-display text-2xl text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ReadingChallengeRing completed={completedThisYear.length} />

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Highlights</h3>
          <div className="space-y-4">
            {topGenres[0] && (
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Tags className="size-4 text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{topGenres[0].label}</p>
                  <p className="text-xs text-muted-foreground">
                    Favorite genre &middot; {topGenres[0].value} books
                  </p>
                </div>
              </div>
            )}
            {topAuthors[0] && (
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Users className="size-4 text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{topAuthors[0].name}</p>
                  <p className="text-xs text-muted-foreground">
                    Most-collected author &middot; {topAuthors[0].books} books
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
