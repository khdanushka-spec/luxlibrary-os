import { hashCode } from "@/lib/book-detail";
import type { MockBook } from "@/lib/mock-data";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function getCurrentlyReading(books: MockBook[]) {
  return books.filter((b) => b.status === "reading").map((book) => {
    const seed = hashCode(book.id + "reading");
    const progress = book.readingProgressPercent ?? 15 + (seed % 80);
    const daysReading = book.readingStartedAt
      ? Math.max(1, Math.floor((Date.now() - new Date(book.readingStartedAt).getTime()) / 86_400_000))
      : 3 + (seed % 40);
    return { book, progress, daysReading };
  });
}

export function getCompletedThisYear(books: MockBook[]) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return books
    .filter((b) => b.status === "completed")
    .map((book) => {
      if (book.completedAt) {
        const d = new Date(book.completedAt);
        if (d.getFullYear() !== currentYear) return null;
        return { book, month: d.getMonth(), day: d.getDate() };
      }
      const seed = hashCode(book.id + "completed");
      const month = seed % (currentMonth + 1);
      const rawDay = 1 + ((seed >> 4) % 28);
      const day = month === currentMonth ? Math.min(rawDay, today.getDate()) : rawDay;
      return { book, month, day };
    })
    .filter((entry): entry is { book: MockBook; month: number; day: number } => entry !== null)
    .sort((a, b) => b.month - a.month || b.day - a.day);
}

export function getDnfBooks(books: MockBook[]): MockBook[] {
  return books.filter((b) => b.status === "dnf");
}

export function getMonthlyReadingCounts(books: MockBook[]) {
  const completed = getCompletedThisYear(books);
  return MONTHS.map((label, i) => ({
    label,
    count: completed.filter((c) => c.month === i).length,
  }));
}

export function getReadingStats(books: MockBook[], readingStreakDays: number) {
  const currentlyReading = getCurrentlyReading(books);
  const completedThisYear = getCompletedThisYear(books);
  const pagesReadThisYear = completedThisYear.reduce(
    (sum, c) => sum + c.book.pages,
    0
  );
  return {
    currentlyReadingCount: currentlyReading.length,
    completedThisYearCount: completedThisYear.length,
    readingStreakDays,
    pagesReadThisYear,
  };
}
