import Link from "next/link";
import { NotebookText } from "lucide-react";
import { AddNoteDialog } from "@/components/notes/add-note-dialog";
import { DeleteNoteButton } from "@/components/notes/delete-note-button";
import { getAllBooksFromDb, getNotesFromDb } from "@/lib/db-books";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Notes — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const user = (await getCurrentUser())!;
  const [books, rawNotes] = await Promise.all([
    getAllBooksFromDb(user.id),
    getNotesFromDb(user.id),
  ]);
  const notes = [...rawNotes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
            <NotebookText className="size-6 text-gold" />
            Notes
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {notes.length} journal entries from your reading
          </p>
        </div>
        <AddNoteDialog books={books.map((b) => ({ id: b.id, title: b.title, author: b.author }))} />
      </div>

      <div className="mx-auto w-full max-w-2xl space-y-5">
        {notes.map((note) => {
          const book = books.find((b) => b.id === note.bookId);
          return (
            <div
              key={note.id}
              className="rounded-2xl border border-border/70 bg-card/60 p-6"
            >
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  {note.title && (
                    <p className="font-display truncate text-base text-foreground">
                      {note.title}
                    </p>
                  )}
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
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <DeleteNoteButton id={note.id} />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {note.content}
              </p>
            </div>
          );
        })}
        {notes.length === 0 && (
          <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
            No notes yet — add one to start your reading journal.
          </div>
        )}
      </div>
    </div>
  );
}
