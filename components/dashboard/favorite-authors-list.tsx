import { MOCK_FAVORITE_AUTHORS } from "@/lib/mock-data";

export function FavoriteAuthorsList() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
      <h3 className="mb-5 text-sm font-medium text-foreground">
        Favorite Authors
      </h3>
      <div className="space-y-4">
        {MOCK_FAVORITE_AUTHORS.map((author) => (
          <div key={author.name} className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-foreground">
              {author.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{author.name}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {author.books} books
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
