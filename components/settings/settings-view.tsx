"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Database, Moon, Sparkles, User } from "lucide-react";
import { SettingsToggle } from "./settings-toggle";
import { updateSetting, type UserSettings } from "@/lib/settings-actions";

function subscribeNoop() {
  return () => {};
}

// next-themes can't know the real theme until after mount (it's read from
// localStorage client-side) - resolvedTheme is undefined before that, which
// would make the toggle show "light" for a moment even when already dark.
// useSyncExternalStore forces the client-only reconciliation pass needed to
// pick this up, without a useState+useEffect mount-guard (that pattern trips
// this repo's react-hooks/set-state-in-effect rule - see live-clock.tsx).
function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

export function SettingsView({ initialSettings }: { initialSettings: UserSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  function handleToggle(key: keyof UserSettings) {
    return (checked: boolean) => {
      setSettings((s) => ({ ...s, [key]: checked }));
      void updateSetting(key, checked);
    };
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <User className="size-6 text-gold" />
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Your preferences, saved to your account.</p>
      </div>

      <section className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <h3 className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
          <Moon className="size-4 text-gold" />
          Appearance
        </h3>
        <div className="divide-y divide-border/60">
          <SettingsToggle
            label="Dark mode"
            description="BringBooks supports both themes — switch any time."
            checked={mounted && resolvedTheme === "dark"}
            disabled={!mounted}
            onChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <SettingsToggle
            label="Reduce motion"
            description="Turn off page-load and hover animations."
            checked={settings.reduceMotion}
            onChange={handleToggle("reduceMotion")}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <h3 className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="size-4 text-gold" />
          AI Preferences
        </h3>
        <div className="divide-y divide-border/60">
          <SettingsToggle
            label="AI reading suggestions"
            description="Let the AI Librarian surface a daily pick on your dashboard."
            checked={settings.aiReadingSuggestions}
            onChange={handleToggle("aiReadingSuggestions")}
          />
          <SettingsToggle
            label="Auto-generate book summaries"
            description="Draft a summary when a new book is added. (Uses the same template-based approach as the AI Librarian — not a live AI call.)"
            checked={settings.autoGenerateSummaries}
            onChange={handleToggle("autoGenerateSummaries")}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <h3 className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="size-4 text-gold" />
          Notifications
        </h3>
        <div className="divide-y divide-border/60">
          <SettingsToggle
            label="Reading streak reminders"
            description="A nudge if you haven't logged reading time by evening. (Preference saved — delivery isn't built yet, no email/push system exists.)"
            checked={settings.readingStreakReminders}
            onChange={handleToggle("readingStreakReminders")}
          />
          <SettingsToggle
            label="Weekly collection digest"
            description="A summary of what was added, finished, and rated. (Preference saved — delivery isn't built yet.)"
            checked={settings.weeklyDigest}
            onChange={handleToggle("weeklyDigest")}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <Database className="size-4 text-gold" />
          Data &amp; Backup
        </h3>
        <p className="text-sm text-muted-foreground">
          Export and automatic backups aren&apos;t built yet.
        </p>
        <button
          disabled
          className="mt-4 h-9 cursor-not-allowed rounded-full border border-border/70 px-4 text-sm text-muted-foreground opacity-50"
        >
          Export library (unavailable)
        </button>
      </section>
    </div>
  );
}
