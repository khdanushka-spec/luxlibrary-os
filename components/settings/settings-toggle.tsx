"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SettingsToggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-gold" : "bg-secondary"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-background shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
