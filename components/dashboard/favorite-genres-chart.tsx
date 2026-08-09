type FavoriteGenresChartProps = {
  genres: { label: string; value: number }[];
};

export function FavoriteGenresChart({ genres }: FavoriteGenresChartProps) {
  const max = Math.max(1, ...genres.map((g) => g.value));

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
      <h3 className="mb-5 text-sm font-medium text-foreground">
        Favorite Genres
      </h3>
      <div className="space-y-3.5">
        {genres.map((genre) => (
          <div key={genre.label}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="text-foreground">{genre.label}</span>
              <span className="text-muted-foreground">{genre.value}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold/50 to-gold"
                style={{ width: `${(genre.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
