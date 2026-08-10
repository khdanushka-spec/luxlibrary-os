"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireApprovedUser } from "@/lib/auth";
import type { Community, CommunityMember, User } from "@/generated/prisma";
import {
  ensureMembership,
  getCommunityMembers,
  getMembership,
  getMessages,
  getOrCreateCommunity,
  getTypingMemberNames,
  REACTION_EMOJI,
  TYPING_WINDOW_MS,
  type CommunityMemberView,
  type CommunityMessageView,
  type ReactionEmoji,
} from "@/lib/community";

export type ActionResult = { ok: true } | { ok: false; error: string };
export type ActionResultWithId = { ok: true; id: string } | { ok: false; error: string };

type ActiveMemberContext =
  | { error: string }
  | { user: User; community: Community; member: CommunityMember };

async function requireActiveMember(): Promise<ActiveMemberContext> {
  const user = await requireApprovedUser();
  if (!user) return { error: "You must be signed in to do that." };

  const community = await getOrCreateCommunity();
  const member = await getMembership(community.id, user.id);
  if (!member || member.status !== "ACTIVE") {
    return { error: "You're not a member of this community." };
  }
  return { user, community, member };
}

export async function joinCommunity(): Promise<ActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const community = await getOrCreateCommunity();
  await ensureMembership(community.id, user.id);
  revalidatePath("/community");
  return { ok: true };
}

export async function sendMessage(input: {
  content: string;
  replyToId?: string;
}): Promise<ActionResultWithId> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const content = input.content.trim();
  if (!content) return { ok: false, error: "Message can't be empty." };
  if (content.length > 4000) return { ok: false, error: "That message is too long." };

  if (input.replyToId) {
    const target = await prisma.communityMessage.findUnique({
      where: { id: input.replyToId },
      select: { communityId: true },
    });
    if (!target || target.communityId !== ctx.community.id) {
      return { ok: false, error: "That message no longer exists." };
    }
  }

  const message = await prisma.communityMessage.create({
    data: {
      communityId: ctx.community.id,
      authorId: ctx.user.id,
      type: "TEXT",
      content,
      replyToId: input.replyToId || undefined,
    },
  });

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: ctx.community.id, userId: ctx.user.id } },
    data: { lastReadAt: new Date(), lastSeenAt: new Date(), typingUntil: null },
  });

  revalidatePath("/community");
  return { ok: true, id: message.id };
}

export async function editMessage(id: string, content: string): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const trimmed = content.trim();
  if (!trimmed) return { ok: false, error: "Message can't be empty." };

  const existing = await prisma.communityMessage.findUnique({ where: { id } });
  if (!existing || existing.communityId !== ctx.community.id) {
    return { ok: false, error: "Message not found." };
  }
  if (existing.authorId !== ctx.user.id) {
    return { ok: false, error: "You can only edit your own messages." };
  }
  if (existing.type !== "TEXT") {
    return { ok: false, error: "Only text messages can be edited." };
  }

  await prisma.communityMessage.update({
    where: { id },
    data: { content: trimmed, isEdited: true, editedAt: new Date() },
  });

  revalidatePath("/community");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const existing = await prisma.communityMessage.findUnique({ where: { id } });
  if (!existing || existing.communityId !== ctx.community.id) {
    return { ok: false, error: "Message not found." };
  }
  const isAdmin = ctx.user.role === "SUPER_ADMIN";
  if (existing.authorId !== ctx.user.id && !isAdmin) {
    return { ok: false, error: "You can only delete your own messages." };
  }

  await prisma.communityMessage.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedById: ctx.user.id,
      isPinned: false,
      pinnedAt: null,
      pinnedById: null,
    },
  });

  revalidatePath("/community");
  return { ok: true };
}

export async function toggleReaction(messageId: string, emoji: string): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  if (!REACTION_EMOJI.includes(emoji as ReactionEmoji)) {
    return { ok: false, error: "That reaction isn't supported." };
  }

  const existing = await prisma.messageReaction.findUnique({
    where: { messageId_userId: { messageId, userId: ctx.user.id } },
  });

  if (existing && existing.emoji === emoji) {
    await prisma.messageReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.messageReaction.upsert({
      where: { messageId_userId: { messageId, userId: ctx.user.id } },
      create: { messageId, userId: ctx.user.id, emoji },
      update: { emoji },
    });
  }

  revalidatePath("/community");
  return { ok: true };
}

export async function togglePin(messageId: string): Promise<ActionResult> {
  const user = await requireApprovedUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return { ok: false, error: "Only the community admin can pin messages." };
  }

  const existing = await prisma.communityMessage.findUnique({ where: { id: messageId } });
  if (!existing) return { ok: false, error: "Message not found." };

  await prisma.communityMessage.update({
    where: { id: messageId },
    data: existing.isPinned
      ? { isPinned: false, pinnedAt: null, pinnedById: null }
      : { isPinned: true, pinnedAt: new Date(), pinnedById: user.id },
  });

  revalidatePath("/community");
  return { ok: true };
}

export async function toggleStar(messageId: string): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const existing = await prisma.messageStar.findUnique({
    where: { messageId_userId: { messageId, userId: ctx.user.id } },
  });

  if (existing) {
    await prisma.messageStar.delete({ where: { id: existing.id } });
  } else {
    await prisma.messageStar.create({ data: { messageId, userId: ctx.user.id } });
  }

  revalidatePath("/community");
  return { ok: true };
}

export async function forwardMessage(messageId: string): Promise<ActionResultWithId> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const original = await prisma.communityMessage.findUnique({ where: { id: messageId } });
  if (!original || original.communityId !== ctx.community.id || original.isDeleted) {
    return { ok: false, error: "That message can no longer be forwarded." };
  }
  if (original.type === "POLL") {
    return { ok: false, error: "Polls can't be forwarded." };
  }

  const forwarded = await prisma.communityMessage.create({
    data: {
      communityId: ctx.community.id,
      authorId: ctx.user.id,
      type: original.type,
      content: original.content,
      sharedBookId: original.sharedBookId,
      forwardedFromId: original.id,
    },
  });

  revalidatePath("/community");
  return { ok: true, id: forwarded.id };
}

export async function createPoll(input: { question: string; options: string[] }): Promise<ActionResultWithId> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const question = input.question.trim();
  const options = input.options.map((o) => o.trim()).filter(Boolean);
  if (!question) return { ok: false, error: "Give the poll a question." };
  if (options.length < 2) return { ok: false, error: "Add at least 2 options." };
  if (options.length > 10) return { ok: false, error: "Polls can have at most 10 options." };

  const message = await prisma.communityMessage.create({
    data: {
      communityId: ctx.community.id,
      authorId: ctx.user.id,
      type: "POLL",
      poll: {
        create: {
          question,
          options: { create: options.map((label) => ({ label })) },
        },
      },
    },
  });

  revalidatePath("/community");
  return { ok: true, id: message.id };
}

export async function votePoll(pollId: string, optionId: string): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const option = await prisma.pollOption.findUnique({ where: { id: optionId } });
  if (!option || option.pollId !== pollId) {
    return { ok: false, error: "That poll option no longer exists." };
  }

  await prisma.pollVote.upsert({
    where: { pollId_userId: { pollId, userId: ctx.user.id } },
    create: { pollId, optionId, userId: ctx.user.id },
    update: { optionId },
  });

  revalidatePath("/community");
  return { ok: true };
}

export async function shareBook(input: { bookId: string; replyToId?: string }): Promise<ActionResultWithId> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const book = await prisma.book.findUnique({ where: { id: input.bookId }, select: { userId: true } });
  if (!book || book.userId !== ctx.user.id) {
    return { ok: false, error: "You can only share books from your own library." };
  }

  const message = await prisma.communityMessage.create({
    data: {
      communityId: ctx.community.id,
      authorId: ctx.user.id,
      type: "BOOK_SHARE",
      sharedBookId: input.bookId,
      replyToId: input.replyToId || undefined,
    },
  });

  revalidatePath("/community");
  return { ok: true, id: message.id };
}

export async function markCommunityRead(): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: ctx.community.id, userId: ctx.user.id } },
    data: { lastReadAt: new Date(), lastSeenAt: new Date() },
  });

  return { ok: true };
}

export async function pingTyping(): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: ctx.community.id, userId: ctx.user.id } },
    data: { typingUntil: new Date(Date.now() + TYPING_WINDOW_MS), lastSeenAt: new Date() },
  });

  return { ok: true };
}

export type CommunityFeed = {
  messages: CommunityMessageView[];
  members: CommunityMemberView[];
  typingNames: string[];
};

/**
 * Single combined round-trip for the client-side polling loop: bumps
 * presence, marks the community read (the caller is actively viewing it),
 * and returns fresh state.
 */
export async function getCommunityFeed(): Promise<CommunityFeed | { error: string }> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { error: ctx.error };

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: ctx.community.id, userId: ctx.user.id } },
    data: { lastSeenAt: new Date(), lastReadAt: new Date() },
  });

  const [messages, members, typingNames] = await Promise.all([
    getMessages(ctx.community.id, ctx.user.id, ctx.member.joinedAt),
    getCommunityMembers(ctx.community.id),
    getTypingMemberNames(ctx.community.id, ctx.user.id),
  ]);

  return { messages, members, typingNames };
}

export async function pingPresence(): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: ctx.community.id, userId: ctx.user.id } },
    data: { lastSeenAt: new Date() },
  });

  return { ok: true };
}

export async function toggleMute(): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: ctx.community.id, userId: ctx.user.id } },
    data: { isMuted: !ctx.member.isMuted },
  });

  revalidatePath("/community");
  return { ok: true };
}

export async function leaveCommunity(): Promise<ActionResult> {
  const ctx = await requireActiveMember();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: ctx.community.id, userId: ctx.user.id } },
    data: { status: "LEFT", typingUntil: null },
  });

  revalidatePath("/community");
  return { ok: true };
}

export async function rejoinCommunity(): Promise<ActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const community = await getOrCreateCommunity();
  const member = await getMembership(community.id, user.id);
  if (!member || member.status !== "LEFT") {
    return { ok: false, error: "You can't rejoin right now." };
  }

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: community.id, userId: user.id } },
    data: { status: "ACTIVE", lastReadAt: new Date(), joinedAt: new Date() },
  });

  revalidatePath("/community");
  return { ok: true };
}

type AdminContext = { error: string } | { user: User; community: Community };

async function requireAdmin(): Promise<AdminContext> {
  const user = await requireApprovedUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return { error: "Only the community admin can do that." };
  }
  const community = await getOrCreateCommunity();
  return { user, community };
}

export async function adminRemoveMember(userId: string): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  await prisma.communityMember.updateMany({
    where: { communityId: ctx.community.id, userId },
    data: { status: "REMOVED" },
  });

  revalidatePath("/community");
  return { ok: true };
}

export async function adminBanMember(userId: string): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  await prisma.communityMember.updateMany({
    where: { communityId: ctx.community.id, userId },
    data: { status: "BANNED" },
  });

  revalidatePath("/community");
  return { ok: true };
}

export async function adminUpdateCommunity(input: {
  name: string;
  description: string;
}): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Community name can't be empty." };

  await prisma.community.update({
    where: { id: ctx.community.id },
    data: { name, description: input.description.trim() || null },
  });

  revalidatePath("/community");
  return { ok: true };
}
