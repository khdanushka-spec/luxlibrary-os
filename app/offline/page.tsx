import { WifiOff } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/home/logo-mark";
import { RetryButton } from "@/components/offline/retry-button";

export const metadata = {
  title: "You're offline — BringBooks",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2 text-foreground">
        <LogoMark className="h-7 w-7" />
        <span className="font-display text-lg">
          Bring<span className="text-gold">Books</span>
        </span>
      </Link>
      <div className="glass w-full max-w-sm rounded-2xl border border-border/70 p-6 text-center shadow-2xl">
        <WifiOff className="mx-auto mb-4 size-10 text-muted-foreground" />
        <h1 className="font-display text-xl text-foreground">You&apos;re offline</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          BringBooks needs a connection to reach your library. Reconnect and try again.
        </p>
        <div className="mt-6">
          <RetryButton />
        </div>
      </div>
    </div>
  );
}
