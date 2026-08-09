import { getBookDetail } from "@/lib/book-detail";
import { STATUS_CONFIG } from "@/lib/book-status";
import { MOCK_BOOKS } from "@/lib/mock-data";

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

export function getAnalytics() {
  const decades = MOCK_BOOKS.map((b) => decadeLabel(b.year));
  const byDecade = countBy(decades).sort((a, b) =>
    a.label === "Pre-1500" ? -1 : b.label === "Pre-1500" ? 1 : a.label.localeCompare(b.label)
  );

  const byGenre = countBy(MOCK_BOOKS.map((b) => b.genre));
  const byFormat = countBy(MOCK_BOOKS.map((b) => b.format));
  const byStatus = countBy(MOCK_BOOKS.map((b) => b.status)).map((entry) => ({
    label: STATUS_CONFIG[entry.label as keyof typeof STATUS_CONFIG].label,
    count: entry.count,
  }));

  const ratingCounts = [1, 2, 3, 4, 5].map((stars) => ({
    label: `${stars} star${stars > 1 ? "s" : ""}`,
    count: MOCK_BOOKS.filter((b) => b.rating === stars).length,
  }));

  const details = MOCK_BOOKS.map((b) => getBookDetail(b));
  const totalValue = details.reduce((sum, d) => sum + d.purchasePrice, 0);
  const avgValue = totalValue / MOCK_BOOKS.length;
  const totalPages = MOCK_BOOKS.reduce((sum, b) => sum + b.pages, 0);
  const ratedBooks = MOCK_BOOKS.filter((b) => b.rating);
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
    totalBooks: MOCK_BOOKS.length,
  };
}
