import Link from "next/link";
import { NotebookText } from "lucide-react";
import { MOCK_BOOKS } from "@/lib/mock-data";
import { MOCK_NOTES } from "@/lib/mock-notes";

export const metadata = {
  title: "Notes — LuxLibrary OS",
};

export default function NotesPage() {
  const notes = [...MOCK_NOTES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <NotebookText className="size-6 text-gold" />
          Notes
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {notes.length} journal entries from your reading
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl space-y-5">
        {notes.map((note) => {
          const book = MOCK_BOOKS.find((b) => b.id === note.bookId);
          return (
            <div
              key={note.id}
              className="rounded-2xl border border-border/70 bg-card/60 p-6"
            >
              <div className="mb-3 flex items-baseline justify-between gap-4">
                {book ? (
                  <Link
                    href={`/library/${book.id}`}
                    className="text-sm font-medium text-foreground hover:text-gold"
                  >
                    {book.title}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-foreground">
                    General note
                  </span>
                )}
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(note.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {note.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
