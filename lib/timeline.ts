import { MOCK_BOOKS } from "@/lib/mock-data";
import { MOCK_NOTES } from "@/lib/mock-notes";
import { getCompletedThisYear, getCurrentlyReading } from "@/lib/reading";

export type TimelineEvent = {
  id: string;
  date: Date;
  type: "started" | "finished" | "note";
  bookId: string;
  bookTitle: string;
  description: string;
};

export function getTimelineEvents(): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const { book, daysReading } of getCurrentlyReading()) {
    const date = new Date();
    date.setDate(date.getDate() - daysReading);
    events.push({
      id: `started-${book.id}`,
      date,
      type: "started",
      bookId: book.id,
      bookTitle: book.title,
      description: `Started reading “${book.title}”`,
    });
  }

  const currentYear = new Date().getFullYear();
  for (const { book, month, day } of getCompletedThisYear()) {
    events.push({
      id: `finished-${book.id}`,
      date: new Date(currentYear, month, day),
      type: "finished",
      bookId: book.id,
      bookTitle: book.title,
      description: `Finished “${book.title}”${book.rating ? ` — rated ${book.rating}/5` : ""}`,
    });
  }

  for (const note of MOCK_NOTES) {
    const book = MOCK_BOOKS.find((b) => b.id === note.bookId);
    events.push({
      id: `note-${note.id}`,
      date: new Date(note.date),
      type: "note",
      bookId: note.bookId,
      bookTitle: book?.title ?? "",
      description: `Wrote a note on “${book?.title ?? "a book"}”`,
    });
  }

  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}
