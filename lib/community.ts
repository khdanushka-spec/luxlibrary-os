import { prisma } from "@/lib/prisma";
import type { CommunityMemberStatus, CommunityMessageType } from "@/generated/prisma";

const SINGLETON_KEY = "bringbooks-community";
export const COMMUNITY_NAME = "BringBooks Community";
export const COMMUNITY_DESCRIPTION =
  "A community for book lovers to connect, chat, and share their reading journey.";

// A member is shown "online" if we've heard from them (via the poll
// heartbeat) more recently than this.
export const ONLINE_WINDOW_MS = 45_000;
export const TYPING_WINDOW_MS = 6_000;

const REACTION_EMOJI = ["👍", "❤️", "😂", "😮", "😢"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJI)[number];
export { REACTION_EMOJI };

const sharedBookSelect = {
  select: {
    id: true,
    title: true,
    coverImageUrl: true,
    rating: true,
    contributors: {
      where: { role: "AUTHOR" as const },
      take: 1,
      include: { author: true },
    },
  },
} as const;

const messageInclude = {
  author: { select: { id: true, name: true, role: true } },
  deletedBy: { select: { id: true, name: true } },
  replyTo: {
    select: {
      id: true,
      content: true,
      type: true,
      isDeleted: true,
      author: { select: { name: true } },
    },
  },
  forwardedFrom: {
    select: { author: { select: { name: true } } },
  },
  sharedBook: sharedBookSelect,
  poll: {
    include: {
      options: {
        include: { votes: { select: { userId: true } } },
      },
    },
  },
  reactions: { select: { emoji: true, userId: true } },
  stars: { select: { userId: true } },
} as const;

type MessageWithRelations = NonNullable<
  Awaited<ReturnType<typeof prisma.communityMessage.findFirst<{ include: typeof messageInclude }>>>
>;

export type SharedBookSummary = {
  id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
  rating: number | null;
};

export type CommunityMessageView = {
  id: string;
  type: CommunityMessageType;
  content: string | null;
  authorId: string;
  authorName: string;
  isAdminAuthor: boolean;
  createdAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  deletedByName: string | null;
  isPinned: boolean;
  replyTo: { id: string; authorName: string; snippet: string } | null;
  forwardedFromAuthorName: string | null;
  sharedBook: SharedBookSummary | null;
  poll: {
    id: string;
    question: string;
    totalVotes: number;
    myOptionId: string | null;
    options: { id: string; label: string; voteCount: number }[];
  } | null;
  reactions: { emoji: string; count: number; reactedByMe: boolean }[];
  starredByMe: boolean;
};

function snippetFor(msg: {
  content: string | null;
  type: CommunityMessageType;
  isDeleted: boolean;
}): string {
  if (msg.isDeleted) return "This message was deleted";
  if (msg.type === "POLL") return "📊 Poll";
  if (msg.type === "BOOK_SHARE") return "📖 Shared a book";
  return msg.content ?? "";
}

export function toMessageView(msg: MessageWithRelations, currentUserId: string): CommunityMessageView {
  const reactionGroups = new Map<string, { count: number; reactedByMe: boolean }>();
  for (const r of msg.reactions) {
    const entry = reactionGroups.get(r.emoji) ?? { count: 0, reactedByMe: false };
    entry.count += 1;
    if (r.userId === currentUserId) entry.reactedByMe = true;
    reactionGroups.set(r.emoji, entry);
  }

  const bookAuthor = msg.sharedBook?.contributors[0]?.author.name ?? "Unknown";

  return {
    id: msg.id,
    type: msg.type,
    content: msg.isDeleted ? null : msg.content,
    authorId: msg.authorId,
    authorName: msg.author.name,
    isAdminAuthor: msg.author.role === "SUPER_ADMIN",
    createdAt: msg.createdAt.toISOString(),
    isEdited: msg.isEdited,
    isDeleted: msg.isDeleted,
    deletedByName: msg.deletedBy?.name ?? null,
    isPinned: msg.isPinned,
    replyTo: msg.replyTo
      ? { id: msg.replyTo.id, authorName: msg.replyTo.author.name, snippet: snippetFor(msg.replyTo) }
      : null,
    forwardedFromAuthorName: msg.forwardedFrom?.author.name ?? null,
    sharedBook: msg.sharedBook
      ? {
          id: msg.sharedBook.id,
          title: msg.sharedBook.title,
          author: bookAuthor,
          coverImageUrl: msg.sharedBook.coverImageUrl ?? undefined,
          rating: msg.sharedBook.rating,
        }
      : null,
    poll: msg.poll
      ? {
          id: msg.poll.id,
          question: msg.poll.question,
          totalVotes: msg.poll.options.reduce((sum, o) => sum + o.votes.length, 0),
          myOptionId: msg.poll.options.find((o) => o.votes.some((v) => v.userId === currentUserId))?.id ?? null,
          options: msg.poll.options.map((o) => ({ id: o.id, label: o.label, voteCount: o.votes.length })),
        }
      : null,
    reactions: Array.from(reactionGroups.entries()).map(([emoji, v]) => ({ emoji, ...v })),
    starredByMe: msg.stars.some((s) => s.userId === currentUserId),
  };
}

export async function getOrCreateCommunity() {
  // upsert on a fixed key, not findFirst-then-create: this runs on every
  // (os) page load via the layout, so concurrent first-requests would
  // otherwise each see "no community" and race, creating duplicates.
  return prisma.community.upsert({
    where: { singletonKey: SINGLETON_KEY },
    create: { singletonKey: SINGLETON_KEY, name: COMMUNITY_NAME, description: COMMUNITY_DESCRIPTION },
    update: {},
  });
}

export async function getMembership(communityId: string, userId: string) {
  return prisma.communityMember.findUnique({
    where: { communityId_userId: { communityId, userId } },
  });
}

/** Auto-joins a never-before-seen user; leaves an explicit LEFT/REMOVED/BANNED status untouched. */
export async function ensureMembership(communityId: string, userId: string) {
  // upsert, not findUnique-then-create: this runs on every (os) page load
  // via the layout, so concurrent requests for a first-time visitor would
  // otherwise both see "no row" and race on the unique constraint.
  return prisma.communityMember.upsert({
    where: { communityId_userId: { communityId, userId } },
    create: { communityId, userId, status: "ACTIVE" },
    update: {},
  });
}

export type CommunityMemberView = {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isOnline: boolean;
  status: CommunityMemberStatus;
  joinedAt: string;
};

export async function getCommunityMembers(communityId: string): Promise<CommunityMemberView[]> {
  const members = await prisma.communityMember.findMany({
    where: { communityId, status: "ACTIVE" },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { joinedAt: "asc" },
  });
  const onlineCutoff = Date.now() - ONLINE_WINDOW_MS;
  return members.map((m) => ({
    userId: m.userId,
    name: m.user.name,
    email: m.user.email,
    isAdmin: m.user.role === "SUPER_ADMIN",
    isOnline: m.lastSeenAt.getTime() > onlineCutoff,
    status: m.status,
    joinedAt: m.joinedAt.toISOString(),
  }));
}

export async function getInactiveCommunityMembers(communityId: string): Promise<CommunityMemberView[]> {
  const members = await prisma.communityMember.findMany({
    where: { communityId, status: { in: ["REMOVED", "BANNED"] } },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { joinedAt: "desc" },
  });
  return members.map((m) => ({
    userId: m.userId,
    name: m.user.name,
    email: m.user.email,
    isAdmin: m.user.role === "SUPER_ADMIN",
    isOnline: false,
    status: m.status,
    joinedAt: m.joinedAt.toISOString(),
  }));
}

export async function getMessages(
  communityId: string,
  currentUserId: string,
  visibleFrom: Date,
  limit = 300
) {
  // Most recent `limit` messages, but returned oldest-first for rendering.
  // visibleFrom = the member's joinedAt: history from before they joined
  // (or before their most recent rejoin) stays hidden, like a real group chat.
  const rows = await prisma.communityMessage.findMany({
    where: { communityId, createdAt: { gte: visibleFrom } },
    include: messageInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.reverse().map((m) => toMessageView(m, currentUserId));
}

export async function getUnreadCount(communityId: string, userId: string): Promise<number> {
  const member = await getMembership(communityId, userId);
  if (!member || member.status !== "ACTIVE") return 0;
  return prisma.communityMessage.count({
    where: {
      communityId,
      createdAt: { gt: member.lastReadAt },
      authorId: { not: userId },
    },
  });
}

/**
 * A book is normally only visible to its owner (or a super admin) - see
 * getBookDetailFromDb's caller. Sharing it into the community is a
 * deliberate, narrow exception: it makes *that specific book* visible to
 * fellow active members, without exposing the sharer's wider library.
 */
export async function wasBookSharedWithMember(bookId: string, viewerUserId: string): Promise<boolean> {
  const community = await getOrCreateCommunity();
  const member = await getMembership(community.id, viewerUserId);
  if (!member || member.status !== "ACTIVE") return false;

  const share = await prisma.communityMessage.findFirst({
    where: { communityId: community.id, sharedBookId: bookId, isDeleted: false },
    select: { id: true },
  });
  return share !== null;
}

/**
 * The id of the first message the viewer hasn't read yet, captured once at
 * page load (before we mark the community read) so the "New messages"
 * divider stays put at wherever they left off, instead of racing ahead as
 * the poll loop marks incoming messages read.
 */
export async function getFirstUnreadMessageId(
  communityId: string,
  userId: string,
  lastReadAt: Date
): Promise<string | null> {
  const first = await prisma.communityMessage.findFirst({
    where: { communityId, createdAt: { gt: lastReadAt }, authorId: { not: userId } },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return first?.id ?? null;
}

export async function getTypingMemberNames(communityId: string, excludeUserId: string): Promise<string[]> {
  const typing = await prisma.communityMember.findMany({
    where: {
      communityId,
      userId: { not: excludeUserId },
      typingUntil: { gt: new Date() },
    },
    include: { user: { select: { name: true } } },
  });
  return typing.map((t) => t.user.name);
}
