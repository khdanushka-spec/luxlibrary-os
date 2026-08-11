import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { TodaysPickCard } from "@/components/dashboard/todays-pick-card";
import { ContinueReadingList } from "@/components/dashboard/continue-reading-list";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { ReadingChallengeRing } from "@/components/dashboard/reading-challenge-ring";
import { RecentlyAddedShelf } from "@/components/dashboard/recently-added-shelf";
import { FavoriteGenresChart } from "@/components/dashboard/favorite-genres-chart";
import { FavoriteAuthorsList } from "@/components/dashboard/favorite-authors-list";
import { getAiInsights, getTodaysPick } from "@/lib/dashboard";
import {
  getAllBooksFromDb,
  getDashboardStatsFromDb,
  getRecentlyAddedFromDb,
  getTopAuthorsFromDb,
  getTopGenresFromDb,
} from "@/lib/db-books";
import { getCompletedThisYear, getCurrentlyReading } from "@/lib/reading";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Home — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = (await getCurrentUser())!;
  const [books, stats, recentlyAdded, topGenres, topAuthors] = await Promise.all([
    getAllBooksFromDb(user.id),
    getDashboardStatsFromDb(user.id),
    getRecentlyAddedFromDb(user.id),
    getTopGenresFromDb(user.id),
    getTopAuthorsFromDb(user.id),
  ]);

  const currentlyReading = getCurrentlyReading(books);
  const completedThisYear = getCompletedThisYear(books);
  const todaysPick = user.aiReadingSuggestions ? getTodaysPick(books) : null;
  const insights = getAiInsights(books, completedThisYear.length);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <WelcomeBanner name={user.name} />
      <StatTiles stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {todaysPick && <TodaysPickCard pick={todaysPick} />}
          <ContinueReadingList items={currentlyReading} />
        </div>
        <div className="space-y-6">
          <ReadingChallengeRing completed={completedThisYear.length} />
          <AiInsightsCard insights={insights} />
        </div>
      </div>

      <RecentlyAddedShelf books={recentlyAdded} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FavoriteGenresChart genres={topGenres} />
        <FavoriteAuthorsList authors={topAuthors} />
      </div>
    </div>
  );
}
