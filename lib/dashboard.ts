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

export function getTodaysPick(books: MockBook[]) {
  const candidates = books.filter(
    (b) => b.status === "unread" || b.status === "wishlist"
  );
  if (candidates.length === 0) return null;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const pick = candidates[dayOfYear % candidates.length];

  const sameGenreRated = books.filter((b) => b.genre === pick.genre && b.rating);
  const avgGenreRating = sameGenreRated.length
    ? sameGenreRated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / sameGenreRated.length
    : null;

  const location = pick.status === "wishlist" ? "on your wishlist" : "unread on your shelves";
  const reason = avgGenreRating
    ? `You've rated ${pick.genre} books ${avgGenreRating.toFixed(1)}/5 on average — this one's still ${location}.`
    : `Still ${location} — worth picking up next.`;

  return { book: pick, reason };
}

export function getAiInsights(books: MockBook[], completedThisYear: number): string[] {
  const insights: string[] = [];

  const genreCounts = countBy(books.map((b) => b.genre));
  if (genreCounts[0]) {
    insights.push(
      `${genreCounts[0].label} is your most-collected genre, with ${genreCounts[0].count} books.`
    );
  }

  const rated = books.filter((b) => b.rating);
  const fiveStars = rated.filter((b) => b.rating === 5).length;
  if (rated.length) {
    insights.push(
      `${fiveStars} of your ${rated.length} rated books earned the full five stars.`
    );
  }

  insights.push(`You've completed ${completedThisYear} book${completedThisYear === 1 ? "" : "s"} this year.`);

  const formatCounts = countBy(books.map((b) => b.format));
  if (formatCounts[0]) {
    insights.push(
      `${formatCounts[0].label} is your most common format, at ${formatCounts[0].count} books.`
    );
  }

  return insights;
}
