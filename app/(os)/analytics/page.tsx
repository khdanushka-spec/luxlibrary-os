import { BarChart3, BookOpen, DollarSign, Star } from "lucide-react";
import { BarList } from "@/components/analytics/bar-list";
import { getAnalytics } from "@/lib/analytics";
import { getAllBooksFromDb, getCollectionValueFromDb } from "@/lib/db-books";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Analytics — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = (await getCurrentUser())!;
  const [books, value] = await Promise.all([
    getAllBooksFromDb(user.id),
    getCollectionValueFromDb(user.id),
  ]);
  const a = getAnalytics(books, value.total, value.average);

  const stats = [
    {
      icon: DollarSign,
      label: "Estimated collection value",
      value: `$${a.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    },
    {
      icon: BookOpen,
      label: "Total pages across collection",
      value: a.totalPages.toLocaleString(),
    },
    {
      icon: Star,
      label: "Average rating",
      value: a.avgRating.toFixed(1),
    },
    {
      icon: DollarSign,
      label: "Average price per book",
      value: `$${a.avgValue.toFixed(2)}`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <BarChart3 className="size-6 text-gold" />
          Analytics
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Computed live from {a.totalBooks} books in your collection
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <h3 className="mb-5 text-sm font-medium text-foreground">
            Books by Decade
          </h3>
          <BarList data={a.byDecade} />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <h3 className="mb-5 text-sm font-medium text-foreground">
            Books by Genre
          </h3>
          <BarList data={a.byGenre} />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <h3 className="mb-5 text-sm font-medium text-foreground">
            Reading Status
          </h3>
          <BarList data={a.byStatus} />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <h3 className="mb-5 text-sm font-medium text-foreground">
            Rating Distribution
          </h3>
          <BarList data={a.ratingCounts} />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6 lg:col-span-2">
          <h3 className="mb-5 text-sm font-medium text-foreground">
            Books by Format
          </h3>
          <BarList data={a.byFormat} />
        </div>
      </div>
    </div>
  );
}
