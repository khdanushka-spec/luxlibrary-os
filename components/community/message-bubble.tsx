"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CornerUpLeft,
  Forward,
  MoreVertical,
  Pencil,
  Pin,
  PinOff,
  Smile,
  Star,
  Trash2,
} from "lucide-react";
import { MemberAvatar } from "./member-avatar";
import { REACTION_EMOJI } from "@/lib/community";
import type { CommunityMessageView } from "./types";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function highlightMentions(text: string, memberNames: string[]) {
  if (memberNames.length === 0) return text;
  const pattern = new RegExp(`@(${memberNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "g");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-medium text-gold">
        @{part}
      </span>
    ) : (
      part
    )
  );
}

export function MessageBubble({
  message,
  isOwn,
  isViewerAdmin,
  showSenderName,
  memberNames,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onPin,
  onStar,
  onForward,
  onVote,
}: {
  message: CommunityMessageView & { pending?: boolean };
  isOwn: boolean;
  isViewerAdmin: boolean;
  showSenderName: boolean;
  memberNames: string[];
  onReply: (message: CommunityMessageView) => void;
  onEdit: (message: CommunityMessageView) => void;
  onDelete: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
  onPin: (id: string) => void;
  onStar: (id: string) => void;
  onForward: (message: CommunityMessageView) => void;
  onVote: (pollId: string, optionId: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const canDelete = isOwn || isViewerAdmin;
  const canEdit = isOwn && message.type === "TEXT" && !message.isDeleted;

  return (
    <div className={cn("flex gap-2.5", isOwn ? "flex-row-reverse" : "flex-row")}>
      {!isOwn && (
        <div className="w-8 shrink-0">
          {showSenderName && <MemberAvatar name={message.authorName} size="size-8" />}
        </div>
      )}

      <div className={cn("flex max-w-[min(30rem,85%)] flex-col", isOwn ? "items-end" : "items-start")}>
        {!isOwn && showSenderName && (
          <p className="mb-1 px-1 text-xs font-medium text-muted-foreground">
            {message.authorName}
            {message.isAdminAuthor && (
              <span className="ml-1.5 rounded-full bg-gold/10 px-1.5 py-0.5 text-[0.6rem] font-medium text-gold">
                Admin
              </span>
            )}
          </p>
        )}

        <div className="group relative">
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-sm",
              isOwn ? "rounded-tr-sm bg-gold/[0.12] text-foreground" : "rounded-tl-sm bg-secondary/50 text-foreground",
              message.isDeleted && "italic text-muted-foreground"
            )}
          >
            {message.isPinned && (
              <div className="mb-1 flex items-center gap-1 text-[0.65rem] text-gold">
                <Pin className="size-3" />
                Pinned
              </div>
            )}

            {message.forwardedFromAuthorName && (
              <p className="mb-1 flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                <Forward className="size-3" />
                Forwarded
              </p>
            )}

            {message.replyTo && (
              <div className="mb-2 rounded-lg border-l-2 border-gold/50 bg-black/10 px-2.5 py-1.5">
                <p className="text-[0.7rem] font-medium text-gold">{message.replyTo.authorName}</p>
                <p className="truncate text-xs text-muted-foreground">{message.replyTo.snippet}</p>
              </div>
            )}

            {message.isDeleted ? (
              <p>This message was deleted{message.deletedByName && !isOwn ? ` by ${message.deletedByName}` : ""}</p>
            ) : message.type === "BOOK_SHARE" && message.sharedBook ? (
              <BookShareCard book={message.sharedBook} />
            ) : message.type === "BOOK_SHARE" ? (
              // The shared book (or its owner's account) was deleted after
              // this message was sent - sharedBookId sets null on delete,
              // but the message row and its BOOK_SHARE type persist.
              <p className="italic text-muted-foreground">This shared book is no longer available.</p>
            ) : message.type === "POLL" && message.poll ? (
              <PollCard poll={message.poll} onVote={(optionId) => onVote(message.poll!.id, optionId)} />
            ) : (
              <p className="whitespace-pre-wrap break-words">
                {highlightMentions(message.content ?? "", memberNames)}
              </p>
            )}
          </div>

          {!message.isDeleted && !message.pending && (
            <div
              className={cn(
                "absolute top-1 flex items-center opacity-0 transition-opacity group-hover:opacity-100",
                isOwn ? "-left-16" : "-right-16"
              )}
            >
              <button
                onClick={() => setPickerOpen((v) => !v)}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="React"
              >
                <Smile className="size-4" />
              </button>
              <button
                onClick={() => onReply(message)}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Reply"
              >
                <CornerUpLeft className="size-4" />
              </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="More"
              >
                <MoreVertical className="size-4" />
              </button>
            </div>
          )}

          {pickerOpen && (
            <div
              className={cn(
                "glass absolute top-9 z-20 flex items-center gap-1 rounded-full border border-border/70 p-1 shadow-xl",
                isOwn ? "right-0" : "left-0"
              )}
            >
              {REACTION_EMOJI.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji);
                    setPickerOpen(false);
                  }}
                  className="flex size-8 items-center justify-center rounded-full text-lg transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {menuOpen && (
            <div
              className={cn(
                "glass absolute top-9 z-20 w-40 overflow-hidden rounded-xl border border-border/70 py-1 shadow-xl",
                isOwn ? "right-0" : "left-0"
              )}
            >
              <button
                onClick={() => {
                  onStar(message.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/60"
              >
                <Star className={cn("size-3.5", message.starredByMe && "fill-gold text-gold")} />
                {message.starredByMe ? "Unstar" : "Star"}
              </button>
              {message.type !== "POLL" && (
                <button
                  onClick={() => {
                    onForward(message);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/60"
                >
                  <Forward className="size-3.5" />
                  Forward
                </button>
              )}
              {canEdit && (
                <button
                  onClick={() => {
                    onEdit(message);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/60"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
              )}
              {isViewerAdmin && (
                <button
                  onClick={() => {
                    onPin(message.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/60"
                >
                  {message.isPinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
                  {message.isPinned ? "Unpin" : "Pin"}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => {
                    onDelete(message.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-400/10"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {message.reactions.length > 0 && (
          <div className={cn("mt-1 flex flex-wrap gap-1", isOwn ? "justify-end" : "justify-start")}>
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onReact(message.id, r.emoji)}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs transition-colors",
                  r.reactedByMe
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-border/70 bg-secondary/40 text-muted-foreground hover:border-gold/30"
                )}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center gap-1 px-1 text-[0.68rem] text-muted-foreground">
          {message.starredByMe && <Star className="size-2.5 fill-gold text-gold" />}
          {message.pending ? <span>Sending…</span> : <span>{formatTime(message.createdAt)}</span>}
          {message.isEdited && <span>· edited</span>}
        </div>
      </div>
    </div>
  );
}

function BookShareCard({ book }: { book: NonNullable<CommunityMessageView["sharedBook"]> }) {
  return (
    <Link
      href={`/library/${book.id}`}
      className="-mx-1 -my-0.5 flex w-56 flex-col gap-2 rounded-xl border border-gold/20 bg-gold/[0.04] p-2.5 transition-colors hover:border-gold/40"
    >
      <div className="flex gap-3">
        {book.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-pasted/uploaded cover source
          <img
            src={book.coverImageUrl}
            alt={`${book.title} cover`}
            className="h-20 w-14 shrink-0 rounded object-cover shadow"
          />
        ) : (
          <div className="h-20 w-14 shrink-0 rounded bg-gradient-to-br from-gold/30 to-secondary shadow" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{book.title}</p>
          <p className="truncate text-xs text-muted-foreground">{book.author}</p>
          {book.rating && (
            <p className="mt-1 text-xs text-gold">{"★".repeat(book.rating)}</p>
          )}
        </div>
      </div>
      <span className="inline-flex h-7 w-full items-center justify-center rounded-full bg-gold text-xs font-medium text-gold-foreground">
        View Book
      </span>
    </Link>
  );
}

function PollCard({
  poll,
  onVote,
}: {
  poll: NonNullable<CommunityMessageView["poll"]>;
  onVote: (optionId: string) => void;
}) {
  return (
    <div className="w-56">
      <p className="mb-2 font-medium text-foreground">{poll.question}</p>
      <div className="space-y-1.5">
        {poll.options.map((opt) => {
          const pct = poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0;
          const mine = poll.myOptionId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onVote(opt.id)}
              className={cn(
                "relative w-full overflow-hidden rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors",
                mine ? "border-gold/50" : "border-border/70 hover:border-gold/30"
              )}
            >
              <div
                className="absolute inset-y-0 left-0 bg-gold/15"
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex items-center justify-between gap-2">
                <span className={cn(mine && "font-medium text-gold")}>{opt.label}</span>
                <span className="shrink-0 text-muted-foreground">{pct}%</span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-[0.68rem] text-muted-foreground">
        {poll.totalVotes} vote{poll.totalVotes === 1 ? "" : "s"}
      </p>
    </div>
  );
}
