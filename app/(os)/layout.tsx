import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/sidebar";
import { AppTopbar } from "@/components/app/topbar";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status !== "APPROVED") redirect("/pending");

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar isSuperAdmin={user.role === "SUPER_ADMIN"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar userName={user.name} userEmail={user.email} />
        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
