import { MOCK_RECENTLY_ADDED } from "@/lib/mock-data";

export function RecentlyAddedShelf() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Recently Added</h3>
        <span className="text-xs text-gold">View library →</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1">
        {MOCK_RECENTLY_ADDED.map((book) => (
          <div key={book.title} className="w-24 shrink-0">
            <div
              className={`h-32 w-24 rounded-lg bg-gradient-to-br ${book.coverColor} shadow-md`}
            />
            <p className="mt-2 truncate text-xs font-medium text-foreground">
              {book.title}
            </p>
            <p className="truncate text-[0.7rem] text-muted-foreground">
              {book.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
