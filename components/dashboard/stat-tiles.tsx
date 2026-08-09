import { BookMarked, DollarSign, Library, PlusCircle } from "lucide-react";
import { AnimatedCounter } from "@/components/home/animated-counter";

type StatTilesProps = {
  stats: {
    totalBooks: number;
    currentlyReading: number;
    addedThisMonth: number;
    collectionValueUsd: number;
  };
};

export function StatTiles({ stats }: StatTilesProps) {
  const tiles = [
    {
      icon: Library,
      label: "Total books",
      value: stats.totalBooks,
      prefix: "",
    },
    {
      icon: BookMarked,
      label: "Currently reading",
      value: stats.currentlyReading,
      prefix: "",
    },
    {
      icon: PlusCircle,
      label: "Added this month",
      value: stats.addedThisMonth,
      prefix: "+",
    },
    {
      icon: DollarSign,
      label: "Collection value",
      value: stats.collectionValueUsd,
      prefix: "$",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-2xl border border-border/70 bg-card/60 p-5"
        >
          <tile.icon className="mb-3 size-4 text-gold" />
          <div className="font-display text-2xl text-foreground">
            <AnimatedCounter value={tile.value} prefix={tile.prefix} duration={1.2} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{tile.label}</div>
        </div>
      ))}
    </div>
  );
}
