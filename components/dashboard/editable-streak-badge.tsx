"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Pencil } from "lucide-react";
import { updateReadingStreak } from "@/lib/reading-stats-actions";

export function EditableStreakBadge({ initialDays }: { initialDays: number }) {
  const router = useRouter();
  const [days, setDays] = useState(initialDays);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(initialDays));

  function startEditing() {
    setValue(String(days));
    setEditing(true);
  }

  async function save() {
    setEditing(false);
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setDays(parsed);
    const result = await updateReadingStreak(parsed);
    if (result.ok) router.refresh();
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/[0.06] px-4 py-2 text-sm font-medium text-gold">
        <Flame className="size-4 shrink-0" />
        <input
          type="number"
          min={0}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          onBlur={save}
          className="w-12 border-none bg-transparent text-right tabular-nums focus:outline-none"
        />
        <span>-day reading streak</span>
      </div>
    );
  }

  return (
    <button
      onClick={startEditing}
      className="group flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/[0.06] px-4 py-2 text-sm font-medium text-gold transition-colors hover:border-gold/40"
    >
      <Flame className="size-4" />
      {days}-day reading streak
      <Pencil className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
