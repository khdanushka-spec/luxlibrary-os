"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { updateReadingChallengeGoal } from "@/lib/reading-stats-actions";

type ReadingChallengeRingProps = {
  completed: number;
  initialGoal: number;
};

export function ReadingChallengeRing({ completed, initialGoal }: ReadingChallengeRingProps) {
  const router = useRouter();
  const year = new Date().getFullYear();
  const [goal, setGoal] = useState(initialGoal);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(initialGoal));

  const pct = Math.min(100, Math.round((completed / goal) * 100));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  function startEditing() {
    setValue(String(goal));
    setEditing(true);
  }

  async function save() {
    setEditing(false);
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) return;
    setGoal(parsed);
    const result = await updateReadingChallengeGoal(parsed);
    if (result.ok) router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
      <h3 className="mb-5 text-sm font-medium text-foreground">{year} Reading Challenge</h3>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" className="stroke-secondary" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-gold"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div>
          <div className="font-display text-2xl text-foreground">
            {completed}
            <span className="text-base text-muted-foreground"> / </span>
            {editing ? (
              <input
                type="number"
                min={1}
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                  if (e.key === "Escape") setEditing(false);
                }}
                onBlur={save}
                className="w-14 border-b border-gold/40 bg-transparent text-base text-foreground tabular-nums focus:outline-none"
              />
            ) : (
              <button
                onClick={startEditing}
                className="group inline-flex items-center gap-1 text-base text-muted-foreground hover:text-gold"
              >
                {goal}
                <Pencil className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">books read this year</p>
        </div>
      </div>
    </div>
  );
}
