import { redirect } from "next/navigation";
import { Clock, XCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata = {
  title: "Pending approval — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function PendingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status === "APPROVED") redirect("/dashboard");

  const rejected = user.status === "REJECTED";

  return (
    <div className="glass rounded-2xl border border-border/70 p-6 text-center shadow-2xl">
      {rejected ? (
        <XCircle className="mx-auto mb-4 size-10 text-rose-400" />
      ) : (
        <Clock className="mx-auto mb-4 size-10 text-gold" />
      )}
      <h1 className="font-display text-xl text-foreground">
        {rejected ? "Access denied" : "Waiting for approval"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {rejected
          ? "Your request to join this library was declined."
          : `Hi ${user.name}, your account is signed up but hasn't been approved yet. Once the library owner approves it, you'll be able to sign in and browse the collection.`}
      </p>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}
