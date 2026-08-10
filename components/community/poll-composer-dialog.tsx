"use client";

import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Plus, Trash2, X } from "lucide-react";

export function PollComposerDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (question: string, options: string[]) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await onCreate(question, options);
    setIsSubmitting(false);
    if (!result.ok) setError(result.error ?? "Couldn't create that poll.");
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative w-full max-w-md rounded-2xl border border-border/70 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <form onSubmit={handleSubmit}>
          <h3 className="font-display mb-5 text-xl text-foreground">Create a Poll</h3>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Question *</label>
              <input
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What should we read next?"
                className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Options *</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      required
                      value={opt}
                      onChange={(e) =>
                        setOptions((prev) => prev.map((o, idx) => (idx === i ? e.target.value : o)))
                      }
                      placeholder={`Option ${i + 1}`}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        className="shrink-0 text-muted-foreground hover:text-rose-400"
                        aria-label="Remove option"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 10 && (
                <button
                  type="button"
                  onClick={() => setOptions((prev) => [...prev, ""])}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline"
                >
                  <Plus className="size-3.5" />
                  Add option
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="size-3.5" />
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground disabled:opacity-60"
            >
              {isSubmitting ? "Creating…" : "Create Poll"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
