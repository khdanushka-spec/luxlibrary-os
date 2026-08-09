import type { MockBook } from "@/lib/mock-data";
import type { MockNote } from "@/lib/mock-notes";
import { getCompletedThisYear, getCurrentlyReading } from "@/lib/reading";

export type TimelineEvent = {
  id: string;
  date: Date;
  type: "started" | "finished" | "note";
  bookId: string;
  bookTitle: string;
  description: string;
};

export function getTimelineEvents(books: MockBook[], notes: MockNote[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const { book, daysReading } of getCurrentlyReading(books)) {
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
  for (const { book, month, day } of getCompletedThisYear(books)) {
    events.push({
      id: `finished-${book.id}`,
      date: new Date(currentYear, month, day),
      type: "finished",
      bookId: book.id,
      bookTitle: book.title,
      description: `Finished “${book.title}”${book.rating ? ` — rated ${book.rating}/5` : ""}`,
    });
  }

  for (const note of notes) {
    const book = books.find((b) => b.id === note.bookId);
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
