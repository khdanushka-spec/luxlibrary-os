import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { requireSuperAdmin } from "@/lib/auth";
import { getAllUsers } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admin — BringBooks",
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "border-gold/40 text-gold bg-gold/10",
  APPROVED: "border-emerald-400/40 text-emerald-400 bg-emerald-400/10",
  REJECTED: "border-rose-400/40 text-rose-400 bg-rose-400/10",
};

export default async function AdminPage() {
  const admin = await requireSuperAdmin();
  if (!admin) redirect("/dashboard");

  const users = await getAllUsers();
  const pending = users.filter((u) => u.status === "PENDING");
  const others = users.filter((u) => u.status !== "PENDING");

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-8">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <ShieldCheck className="size-6 text-gold" />
          Admin
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Approve or reject requests to join your library.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Pending requests {pending.length > 0 && `(${pending.length})`}
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-border/70 bg-card/60 px-6 py-8 text-center text-sm text-muted-foreground">
            No pending requests.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
                <UserRowActions userId={u.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          All members
        </h2>
        <div className="space-y-2">
          {others.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {u.name}
                  {u.role === "SUPER_ADMIN" && (
                    <span className="ml-2 rounded-full bg-gold/10 px-2 py-0.5 text-[0.65rem] font-medium text-gold">
                      Super Admin
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
                  STATUS_STYLES[u.status]
                )}
              >
                {u.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
