import { Database, Moon, Settings as SettingsIcon, Sparkles, User } from "lucide-react";
import { SettingsToggle } from "@/components/settings/settings-toggle";

export const metadata = {
  title: "Settings — LuxLibrary OS",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <SettingsIcon className="size-6 text-gold" />
          Settings
        </h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-3.5 text-gold" />
          Preview only — nothing here is persisted yet, no database is
          connected
        </p>
      </div>

      <section className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <h3 className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
          <Moon className="size-4 text-gold" />
          Appearance
        </h3>
        <div className="divide-y divide-border/60">
          <SettingsToggle
            label="Dark mode"
            description="LuxLibrary OS is dark-mode-first; light mode is planned."
            defaultChecked
          />
          <SettingsToggle
            label="Reduce motion"
            description="Turn off page-load and hover animations."
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
            defaultChecked
          />
          <SettingsToggle
            label="Auto-generate book summaries"
            description="Draft an AI summary when a new book is added."
            defaultChecked
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
            description="A nudge if you haven't logged reading time by evening."
            defaultChecked
          />
          <SettingsToggle
            label="Weekly collection digest"
            description="A summary of what was added, finished, and rated."
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
