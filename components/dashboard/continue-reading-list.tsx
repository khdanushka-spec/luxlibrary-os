import { MOCK_CONTINUE_READING } from "@/lib/mock-data";

export function ContinueReadingList() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
      <h3 className="mb-5 text-sm font-medium text-foreground">
        Continue Reading
      </h3>
      <div className="space-y-5">
        {MOCK_CONTINUE_READING.map((book) => (
          <div key={book.title} className="flex items-center gap-4">
            <div
              className={`h-14 w-10 shrink-0 rounded bg-gradient-to-br ${book.coverColor}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium text-foreground">
                  {book.title}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {book.progress}%
                </span>
              </div>
              <p className="mb-1.5 truncate text-xs text-muted-foreground">
                {book.author}
              </p>
              <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
