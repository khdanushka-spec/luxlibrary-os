import { STATUS_CONFIG } from "@/lib/book-status";
import type { MockBook } from "@/lib/mock-data";

function countBy<T extends string>(items: T[]) {
  const map = new Map<T, number>();
  for (const item of items) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function decadeLabel(year: number) {
  if (year < 1500) return "Pre-1500";
  return `${Math.floor(year / 10) * 10}s`;
}

export function getAnalytics(books: MockBook[], totalValue: number, avgValue: number) {
  const decades = books.map((b) => decadeLabel(b.year));
  const byDecade = countBy(decades).sort((a, b) =>
    a.label === "Pre-1500" ? -1 : b.label === "Pre-1500" ? 1 : a.label.localeCompare(b.label)
  );

  const byGenre = countBy(books.map((b) => b.genre));
  const byFormat = countBy(books.map((b) => b.format));
  const byStatus = countBy(books.map((b) => b.status)).map((entry) => ({
    label: STATUS_CONFIG[entry.label as keyof typeof STATUS_CONFIG].label,
    count: entry.count,
  }));

  const ratingCounts = [1, 2, 3, 4, 5].map((stars) => ({
    label: `${stars} star${stars > 1 ? "s" : ""}`,
    count: books.filter((b) => b.rating === stars).length,
  }));

  const totalPages = books.reduce((sum, b) => sum + b.pages, 0);
  const ratedBooks = books.filter((b) => b.rating);
  const avgRating =
    ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) /
    (ratedBooks.length || 1);

  return {
    byDecade,
    byGenre,
    byFormat,
    byStatus,
    ratingCounts,
    totalValue,
    avgValue,
    totalPages,
    avgRating,
    totalBooks: books.length,
  };
}
