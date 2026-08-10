import type { CommunityMemberView, CommunityMessageView } from "@/lib/community";

export type { CommunityMemberView, CommunityMessageView };

export type CommunitySummary = { id: string; name: string; description: string | null };
export type CurrentUserSummary = { id: string; name: string; isAdmin: boolean };
export type ShareableBook = {
  id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
  rating: number | null;
};
