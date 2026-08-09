import { BookMarked, DollarSign, Library, PlusCircle } from "lucide-react";
import { AnimatedCounter } from "@/components/home/animated-counter";
import { MOCK_STATS } from "@/lib/mock-data";

const TILES = [
  {
    icon: Library,
    label: "Total books",
    value: MOCK_STATS.totalBooks,
    prefix: "",
  },
  {
    icon: BookMarked,
    label: "Currently reading",
    value: MOCK_STATS.currentlyReading,
    prefix: "",
  },
  {
    icon: PlusCircle,
    label: "Added this month",
    value: MOCK_STATS.addedThisMonth,
    prefix: "+",
  },
  {
    icon: DollarSign,
    label: "Collection value",
    value: MOCK_STATS.collectionValueUsd,
    prefix: "$",
  },
];

export function StatTiles() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {TILES.map((tile) => (
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
