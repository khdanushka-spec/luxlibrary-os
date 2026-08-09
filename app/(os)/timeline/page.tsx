import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, NotebookText } from "lucide-react";
import { getAllBooksFromDb, getNotesFromDb } from "@/lib/db-books";
import { getTimelineEvents } from "@/lib/timeline";

export const metadata = {
  title: "Timeline — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

const TYPE_CONFIG = {
  started: { icon: BookOpen, className: "bg-sky-400/15 text-sky-400" },
  finished: { icon: CheckCircle2, className: "bg-emerald-400/15 text-emerald-400" },
  note: { icon: NotebookText, className: "bg-gold/15 text-gold" },
};

export default async function TimelinePage() {
  const [books, notes] = await Promise.all([getAllBooksFromDb(), getNotesFromDb()]);
  const events = getTimelineEvents(books, notes);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Clock className="size-6 text-gold" />
          Timeline
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything that&apos;s happened across your library, most recent first
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="relative space-y-6 border-l border-border/60 pl-8">
          {events.map((event) => {
            const config = TYPE_CONFIG[event.type];
            return (
              <div key={event.id} className="relative">
                <span
                  className={`absolute -left-[calc(2rem+9px)] top-0.5 flex size-6 items-center justify-center rounded-full ${config.className}`}
                >
                  <config.icon className="size-3.5" />
                </span>
                <Link
                  href={`/library/${event.bookId}`}
                  className="text-sm text-foreground hover:text-gold"
                >
                  {event.description}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {event.date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
