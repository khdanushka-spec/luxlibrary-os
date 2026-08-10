import { MessageCircle } from "lucide-react";
import { CommunityView } from "@/components/community/community-view";
import { getCurrentUser } from "@/lib/auth";
import { getAllBooksFromDb } from "@/lib/db-books";
import {
  getCommunityMembers,
  getFirstUnreadMessageId,
  getMembership,
  getMessages,
  getOrCreateCommunity,
} from "@/lib/community";
import { rejoinCommunity } from "@/lib/community-actions";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Community — BringBooks",
};

export const dynamic = "force-dynamic";

const LEFT_STATUS_COPY: Record<string, { title: string; body: string; canRejoin: boolean }> = {
  LEFT: {
    title: "You left BringBooks Community",
    body: "You can rejoin any time to catch up with everyone.",
    canRejoin: true,
  },
  REMOVED: {
    title: "You were removed from BringBooks Community",
    body: "An admin removed you from this community. Reach out to them if you think that was a mistake.",
    canRejoin: false,
  },
  BANNED: {
    title: "You're banned from BringBooks Community",
    body: "An admin has banned you from this community.",
    canRejoin: false,
  },
};

export default async function CommunityPage() {
  const user = (await getCurrentUser())!;
  const community = await getOrCreateCommunity();
  const member = await getMembership(community.id, user.id);

  if (!member || member.status !== "ACTIVE") {
    const copy = LEFT_STATUS_COPY[member?.status ?? "LEFT"];
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
        <MessageCircle className="size-10 text-muted-foreground" />
        <h1 className="font-display text-2xl text-foreground">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">{copy.body}</p>
        {copy.canRejoin && (
          <form
            action={async () => {
              "use server";
              await rejoinCommunity();
            }}
          >
            <button
              type="submit"
              className="mt-2 inline-flex h-10 items-center gap-1.5 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Rejoin community
            </button>
          </form>
        )}
      </div>
    );
  }

  const firstUnreadId = await getFirstUnreadMessageId(community.id, user.id, member.lastReadAt);

  const [messages, members, myBooks] = await Promise.all([
    getMessages(community.id, user.id),
    getCommunityMembers(community.id),
    getAllBooksFromDb(user.id),
  ]);

  await prisma.communityMember.update({
    where: { communityId_userId: { communityId: community.id, userId: user.id } },
    data: { lastReadAt: new Date(), lastSeenAt: new Date() },
  });

  return (
    <CommunityView
      community={{ id: community.id, name: community.name, description: community.description }}
      currentUser={{ id: user.id, name: user.name, isAdmin: user.role === "SUPER_ADMIN" }}
      initialMessages={messages}
      initialMembers={members}
      firstUnreadMessageId={firstUnreadId}
      isMuted={member.isMuted}
      myBooks={myBooks.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        coverImageUrl: b.coverImageUrl,
        rating: b.rating,
      }))}
    />
  );
}
