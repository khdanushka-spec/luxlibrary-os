"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BarChart3, BookMarked, Pencil, SendHorizontal, X } from "lucide-react";
import type { CommunityMemberView, CommunityMessageView } from "./types";
import { cn } from "@/lib/utils";

export function Composer({
  onSend,
  replyTo,
  onCancelReply,
  editing,
  onSaveEdit,
  onCancelEdit,
  onTyping,
  members,
  onOpenPoll,
  onOpenShareBook,
}: {
  onSend: (content: string, replyToId?: string) => void;
  replyTo: CommunityMessageView | null;
  onCancelReply: () => void;
  editing: CommunityMessageView | null;
  onSaveEdit: (id: string, content: string) => void;
  onCancelEdit: () => void;
  onTyping: () => void;
  members: CommunityMemberView[];
  onOpenPoll: () => void;
  onOpenShareBook: () => void;
}) {
  const [value, setValue] = useState("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjusting state during render (not in an effect) when a prop changes is
  // React's recommended pattern here - it avoids the extra render pass a
  // setState-in-effect would cause, and this repo's lint config flags that.
  const [syncedEditingId, setSyncedEditingId] = useState<string | null>(null);
  if ((editing?.id ?? null) !== syncedEditingId) {
    setSyncedEditingId(editing?.id ?? null);
    setValue(editing?.content ?? "");
  }

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  function handleChange(text: string) {
    setValue(text);
    onTyping();

    const cursor = textareaRef.current?.selectionStart ?? text.length;
    const upToCursor = text.slice(0, cursor);
    const match = /@([\w]*)$/.exec(upToCursor);
    setMentionQuery(match ? match[1] : null);
  }

  function insertMention(name: string) {
    const cursor = textareaRef.current?.selectionStart ?? value.length;
    const upToCursor = value.slice(0, cursor);
    const replaced = upToCursor.replace(/@([\w]*)$/, `@${name} `);
    setValue(replaced + value.slice(cursor));
    setMentionQuery(null);
    textareaRef.current?.focus();
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (editing) {
      onSaveEdit(editing.id, trimmed);
    } else {
      onSend(trimmed, replyTo?.id);
    }
    setValue("");
    setMentionQuery(null);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") {
      if (editing) onCancelEdit();
      else if (replyTo) onCancelReply();
    }
  }

  const matchingMembers =
    mentionQuery !== null
      ? members.filter((m) => m.name.toLowerCase().startsWith(mentionQuery.toLowerCase())).slice(0, 5)
      : [];

  return (
    <div className="border-t border-border/60 bg-card/60 p-3">
      {(replyTo || editing) && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-secondary/40 px-3 py-1.5">
          <div className="flex min-w-0 items-center gap-1.5 text-xs">
            {editing ? <Pencil className="size-3 shrink-0 text-gold" /> : null}
            <span className="shrink-0 font-medium text-gold">
              {editing ? "Editing message" : `Replying to ${replyTo?.authorName}`}
            </span>
            {!editing && <span className="truncate text-muted-foreground">{replyTo?.content}</span>}
          </div>
          <button
            onClick={editing ? onCancelEdit : onCancelReply}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Cancel"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="relative flex items-end gap-2">
        {matchingMembers.length > 0 && (
          <div className="glass absolute bottom-full left-0 mb-2 w-56 overflow-hidden rounded-xl border border-border/70 py-1 shadow-xl">
            {matchingMembers.map((m) => (
              <button
                key={m.userId}
                onClick={() => insertMention(m.name)}
                className="flex w-full items-center px-3 py-2 text-left text-sm text-foreground hover:bg-secondary/60"
              >
                {m.name}
              </button>
            ))}
          </div>
        )}

        {!editing && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onOpenPoll}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              aria-label="Create poll"
              title="Create poll"
            >
              <BarChart3 className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={onOpenShareBook}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              aria-label="Share a book"
              title="Share a book"
            >
              <BookMarked className="size-4.5" />
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message BringBooks Community…"
          className="max-h-32 min-h-9 flex-1 resize-none rounded-2xl border border-border/70 bg-secondary/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
        />

        <button
          onClick={submit}
          disabled={!value.trim()}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground transition-transform disabled:opacity-40",
            value.trim() && "hover:scale-105 active:scale-95"
          )}
          aria-label="Send"
        >
          <SendHorizontal className="size-4" />
        </button>
      </div>
    </div>
  );
}
