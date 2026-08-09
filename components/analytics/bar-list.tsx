export function BarList({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((entry) => (
        <div key={entry.label}>
          <div className="mb-1 flex items-baseline justify-between text-xs">
            <span className="text-foreground">{entry.label}</span>
            <span className="text-muted-foreground">{entry.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/50 to-gold"
              style={{ width: `${(entry.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
