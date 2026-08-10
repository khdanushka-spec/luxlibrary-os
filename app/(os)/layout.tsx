import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/sidebar";
import { AppTopbar } from "@/components/app/topbar";
import { getCurrentUser } from "@/lib/auth";
import { ensureMembership, getOrCreateCommunity, getUnreadCount } from "@/lib/community";

export const dynamic = "force-dynamic";

export default async function OsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status !== "APPROVED") redirect("/pending");

  const community = await getOrCreateCommunity();
  await ensureMembership(community.id, user.id);
  const communityUnreadCount = await getUnreadCount(community.id, user.id);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar isSuperAdmin={user.role === "SUPER_ADMIN"} communityUnreadCount={communityUnreadCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          userName={user.name}
          userEmail={user.email}
          isSuperAdmin={user.role === "SUPER_ADMIN"}
          communityUnreadCount={communityUnreadCount}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
