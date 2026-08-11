"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Info, MessageCircle, Pin, Search, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./message-bubble";
import { Composer } from "./composer";
import { MembersPanel } from "./members-panel";
import { PollComposerDialog } from "./poll-composer-dialog";
import { ShareBookDialog } from "./share-book-dialog";
import type {
  CommunityMemberView,
  CommunityMessageView,
  CommunitySummary,
  CurrentUserSummary,
  ShareableBook,
} from "./types";
import {
  adminBanMember,
  adminReinstateMember,
  adminRemoveMember,
  adminUpdateCommunity,
  createPoll,
  deleteMessage,
  editMessage,
  forwardMessage,
  getCommunityFeed,
  leaveCommunity,
  pingTyping,
  sendMessage,
  shareBook,
  toggleMute,
  togglePin,
  toggleReaction,
  toggleStar,
  votePoll,
} from "@/lib/community-actions";

const POLL_INTERVAL_MS = 4000;
const TYPING_PING_THROTTLE_MS = 3000;
const NEAR_BOTTOM_THRESHOLD_PX = 150;

type ViewMessage = CommunityMessageView & { pending?: boolean };

function toggleReactionLocally(message: ViewMessage, emoji: string): ViewMessage {
  const reactions = message.reactions.map((r) => ({ ...r }));
  const myIndex = reactions.findIndex((r) => r.reactedByMe);
  const myEmoji = myIndex >= 0 ? reactions[myIndex].emoji : null;

  if (myIndex >= 0) {
    reactions[myIndex].count -= 1;
    reactions[myIndex].reactedByMe = false;
    if (reactions[myIndex].count <= 0) reactions.splice(myIndex, 1);
  }

  if (myEmoji !== emoji) {
    const target = reactions.find((r) => r.emoji === emoji);
    if (target) {
      target.count += 1;
      target.reactedByMe = true;
    } else {
      reactions.push({ emoji, count: 1, reactedByMe: true });
    }
  }

  return { ...message, reactions };
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function CommunityView({
  community: initialCommunity,
  currentUser,
  initialMessages,
  initialMembers,
  initialInactiveMembers,
  firstUnreadMessageId,
  isMuted: initialIsMuted,
  myBooks,
}: {
  community: CommunitySummary;
  currentUser: CurrentUserSummary;
  initialMessages: CommunityMessageView[];
  initialMembers: CommunityMemberView[];
  initialInactiveMembers: CommunityMemberView[];
  firstUnreadMessageId: string | null;
  isMuted: boolean;
  myBooks: ShareableBook[];
}) {
  const [community, setCommunity] = useState(initialCommunity);
  const [messages, setMessages] = useState<ViewMessage[]>(initialMessages);
  const [members, setMembers] = useState(initialMembers);
  const [inactiveMembers, setInactiveMembers] = useState(initialInactiveMembers);
  const [typingNames, setTypingNames] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(initialIsMuted);

  const [replyTo, setReplyTo] = useState<CommunityMessageView | null>(null);
  const [editing, setEditing] = useState<CommunityMessageView | null>(null);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pollDialogOpen, setPollDialogOpen] = useState(false);
  const [shareBookOpen, setShareBookOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const lastTypingPingRef = useRef(0);
  const messageCountRef = useRef(messages.length);

  const memberNames = useMemo(() => members.map((m) => m.name), [members]);
  const pinnedMessages = useMemo(
    () => messages.filter((m) => m.isPinned && !m.isDeleted),
    [messages]
  );

  const visibleMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter((m) => !m.isDeleted && (m.content ?? "").toLowerCase().includes(q));
  }, [messages, searchQuery]);

  const scrollToBottom = useCallback((smooth = false) => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
    // Only on mount - subsequent scrolls are driven by the poll effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length > messageCountRef.current && isNearBottomRef.current) {
      scrollToBottom(true);
    }
    messageCountRef.current = messages.length;
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      isNearBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD_PX;
    }
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const feed = await getCommunityFeed();
      if ("error" in feed) return;
      setMessages(feed.messages);
      setMembers(feed.members);
      setInactiveMembers(feed.inactiveMembers);
      setTypingNames(feed.typingNames);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  function handleTyping() {
    const now = Date.now();
    if (now - lastTypingPingRef.current < TYPING_PING_THROTTLE_MS) return;
    lastTypingPingRef.current = now;
    void pingTyping();
  }

  async function handleSend(content: string, replyToId?: string) {
    setReplyTo(null);
    isNearBottomRef.current = true;

    const replySource = replyToId ? messages.find((m) => m.id === replyToId) : undefined;
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticMessage: ViewMessage = {
      id: tempId,
      type: "TEXT",
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      isAdminAuthor: currentUser.isAdmin,
      createdAt: new Date().toISOString(),
      isEdited: false,
      isDeleted: false,
      deletedByName: null,
      isPinned: false,
      replyTo: replySource
        ? { id: replySource.id, authorName: replySource.authorName, snippet: replySource.content ?? "" }
        : null,
      forwardedFromAuthorName: null,
      sharedBook: null,
      poll: null,
      reactions: [],
      starredByMe: false,
      pending: true,
    };
    // Shows the message immediately instead of waiting on sendMessage + a
    // full feed refetch; the feed refetch below still replaces this with
    // the real row (and quietly drops it if the send actually failed).
    setMessages((prev) => [...prev, optimisticMessage]);

    const result = await sendMessage({ content, replyToId });
    if (result.ok) {
      const feed = await getCommunityFeed();
      if (!("error" in feed)) setMessages(feed.messages);
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  }

  function handleReact(id: string, emoji: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? toggleReactionLocally(m, emoji) : m)));
    void refreshAfter(toggleReaction(id, emoji));
  }

  async function handleSaveEdit(id: string, content: string) {
    setEditing(null);
    const result = await editMessage(id, content);
    if (result.ok) {
      const feed = await getCommunityFeed();
      if (!("error" in feed)) setMessages(feed.messages);
    }
  }

  async function refreshAfter(action: Promise<unknown>) {
    await action;
    const feed = await getCommunityFeed();
    if (!("error" in feed)) {
      setMessages(feed.messages);
      setMembers(feed.members);
      setInactiveMembers(feed.inactiveMembers);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] gap-4">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 p-4">
          {searchOpen ? (
            <div className="flex flex-1 items-center gap-2">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages…"
                className="h-9 flex-1 border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Close search"
              >
                <X className="size-4.5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setInfoPanelOpen(true)}
                className="flex min-w-0 items-center gap-3 text-left"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <MessageCircle className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-base text-foreground">{community.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3" />
                    {members.length} member{members.length === 1 ? "" : "s"}
                    {community.description ? ` · ${community.description}` : ""}
                  </p>
                </div>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                  aria-label="Search messages"
                >
                  <Search className="size-4" />
                </button>
                <button
                  onClick={() => setInfoPanelOpen(true)}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground lg:hidden"
                  aria-label="Group info"
                >
                  <Info className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {pinnedMessages.length > 0 && !searchOpen && (
          <div className="flex items-center gap-2 overflow-x-auto border-b border-border/60 bg-gold/[0.04] px-4 py-2 text-xs">
            <Pin className="size-3 shrink-0 text-gold" />
            {pinnedMessages.map((m) => (
              <span key={m.id} className="shrink-0 truncate text-muted-foreground">
                <span className="font-medium text-gold">{m.authorName}:</span>{" "}
                {m.type === "TEXT" ? m.content : m.type === "POLL" ? "📊 Poll" : "📖 Shared a book"}
              </span>
            ))}
          </div>
        )}

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {visibleMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {searchQuery ? "No messages match your search." : "No messages yet — say hello!"}
            </div>
          ) : (
            visibleMessages.map((message, i) => {
              const prev = visibleMessages[i - 1];
              const showSenderName = !prev || prev.authorId !== message.authorId;
              const showDayDivider = !prev || dayLabel(prev.createdAt) !== dayLabel(message.createdAt);
              const showUnreadDivider = message.id === firstUnreadMessageId;
              return (
                <div key={message.id} className={cn(message.pending && "opacity-60 transition-opacity")}>
                  {showDayDivider && (
                    <div className="my-4 flex items-center justify-center">
                      <span className="rounded-full bg-secondary/60 px-3 py-1 text-[0.68rem] font-medium text-muted-foreground">
                        {dayLabel(message.createdAt)}
                      </span>
                    </div>
                  )}
                  {showUnreadDivider && (
                    <div className="my-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-rose-400/40" />
                      <span className="text-[0.68rem] font-medium text-rose-400">New messages</span>
                      <div className="h-px flex-1 bg-rose-400/40" />
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    isOwn={message.authorId === currentUser.id}
                    isViewerAdmin={currentUser.isAdmin}
                    showSenderName={showSenderName}
                    memberNames={memberNames}
                    onReply={setReplyTo}
                    onEdit={setEditing}
                    onDelete={(id) => refreshAfter(deleteMessage(id))}
                    onReact={handleReact}
                    onPin={(id) => refreshAfter(togglePin(id))}
                    onStar={(id) => refreshAfter(toggleStar(id))}
                    onForward={(msg) => refreshAfter(forwardMessage(msg.id))}
                    onVote={(pollId, optionId) => refreshAfter(votePoll(pollId, optionId))}
                  />
                </div>
              );
            })
          )}
        </div>

        {typingNames.length > 0 && (
          <div className="flex items-center gap-2 px-4 pb-1 text-xs italic text-muted-foreground">
            {typingNames.join(", ")} {typingNames.length === 1 ? "is" : "are"} typing…
          </div>
        )}

        <Composer
          onSend={handleSend}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          editing={editing}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={() => setEditing(null)}
          onTyping={handleTyping}
          members={members}
          onOpenPoll={() => setPollDialogOpen(true)}
          onOpenShareBook={() => setShareBookOpen(true)}
        />
      </div>

      <div className="hidden w-80 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card/40 lg:block">
        <MembersPanel
          community={community}
          members={members}
          currentUser={currentUser}
          isMuted={isMuted}
          onToggleMute={() => {
            setIsMuted((v) => !v);
            void toggleMute();
          }}
          onLeave={() => void leaveCommunity()}
          onUpdateCommunity={(name, description) => {
            setCommunity((c) => ({ ...c, name, description }));
            void adminUpdateCommunity({ name, description });
          }}
          onRemoveMember={(userId) => refreshAfter(adminRemoveMember(userId))}
          onBanMember={(userId) => refreshAfter(adminBanMember(userId))}
          inactiveMembers={inactiveMembers}
          onReinstateMember={(userId) => refreshAfter(adminReinstateMember(userId))}
        />
      </div>

      {infoPanelOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setInfoPanelOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-background shadow-2xl">
            <MembersPanel
              community={community}
              members={members}
              currentUser={currentUser}
              isMuted={isMuted}
              onToggleMute={() => {
                setIsMuted((v) => !v);
                void toggleMute();
              }}
              onLeave={() => void leaveCommunity()}
              onUpdateCommunity={(name, description) => {
                setCommunity((c) => ({ ...c, name, description }));
                void adminUpdateCommunity({ name, description });
              }}
              onRemoveMember={(userId) => refreshAfter(adminRemoveMember(userId))}
              onBanMember={(userId) => refreshAfter(adminBanMember(userId))}
              inactiveMembers={inactiveMembers}
              onReinstateMember={(userId) => refreshAfter(adminReinstateMember(userId))}
              onClose={() => setInfoPanelOpen(false)}
            />
          </div>
        </div>
      )}

      {pollDialogOpen && (
        <PollComposerDialog
          onClose={() => setPollDialogOpen(false)}
          onCreate={async (question, options) => {
            const result = await createPoll({ question, options });
            if (result.ok) {
              setPollDialogOpen(false);
              const feed = await getCommunityFeed();
              if (!("error" in feed)) setMessages(feed.messages);
            }
            return result;
          }}
        />
      )}

      {shareBookOpen && (
        <ShareBookDialog
          books={myBooks}
          onClose={() => setShareBookOpen(false)}
          onShare={async (bookId) => {
            const result = await shareBook({ bookId, replyToId: replyTo?.id });
            if (result.ok) {
              setShareBookOpen(false);
              setReplyTo(null);
              const feed = await getCommunityFeed();
              if (!("error" in feed)) setMessages(feed.messages);
            }
            return result;
          }}
        />
      )}
    </div>
  );
}
