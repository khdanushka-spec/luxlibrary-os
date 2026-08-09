import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { TodaysPickCard } from "@/components/dashboard/todays-pick-card";
import { ContinueReadingList } from "@/components/dashboard/continue-reading-list";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { ReadingChallengeRing } from "@/components/dashboard/reading-challenge-ring";
import { RecentlyAddedShelf } from "@/components/dashboard/recently-added-shelf";
import { FavoriteGenresChart } from "@/components/dashboard/favorite-genres-chart";
import { FavoriteAuthorsList } from "@/components/dashboard/favorite-authors-list";

export const metadata = {
  title: "Home — LuxLibrary OS",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <WelcomeBanner />
      <StatTiles />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TodaysPickCard />
          <ContinueReadingList />
        </div>
        <div className="space-y-6">
          <ReadingChallengeRing />
          <AiInsightsCard />
        </div>
      </div>

      <RecentlyAddedShelf />

      <div className="grid gap-6 lg:grid-cols-2">
        <FavoriteGenresChart />
        <FavoriteAuthorsList />
      </div>
    </div>
  );
}
