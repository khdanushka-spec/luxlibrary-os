import { hashCode } from "@/lib/book-detail";
import { MOCK_BOOKS, MOCK_STATS, type MockBook } from "@/lib/mock-data";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function getCurrentlyReading() {
  return MOCK_BOOKS.filter((b) => b.status === "reading").map((book) => {
    const seed = hashCode(book.id + "reading");
    const progress = 15 + (seed % 80);
    const daysReading = 3 + (seed % 40);
    return { book, progress, daysReading };
  });
}

export function getCompletedThisYear() {
  const today = new Date();
  const currentMonth = today.getMonth();
  return MOCK_BOOKS.filter((b) => b.status === "completed")
    .map((book) => {
      const seed = hashCode(book.id + "completed");
      const month = seed % (currentMonth + 1);
      const rawDay = 1 + ((seed >> 4) % 28);
      const day = month === currentMonth ? Math.min(rawDay, today.getDate()) : rawDay;
      return { book, month, day };
    })
    .sort((a, b) => b.month - a.month || b.day - a.day);
}

export function getDnfBooks(): MockBook[] {
  return MOCK_BOOKS.filter((b) => b.status === "dnf");
}

export function getMonthlyReadingCounts() {
  const completed = getCompletedThisYear();
  return MONTHS.map((label, i) => ({
    label,
    count: completed.filter((c) => c.month === i).length,
  }));
}

export function getReadingStats() {
  const currentlyReading = getCurrentlyReading();
  const completedThisYear = getCompletedThisYear();
  const pagesReadThisYear = completedThisYear.reduce(
    (sum, c) => sum + c.book.pages,
    0
  );
  return {
    currentlyReadingCount: currentlyReading.length,
    completedThisYearCount: completedThisYear.length,
    readingStreakDays: MOCK_STATS.readingStreakDays,
    pagesReadThisYear,
  };
}
