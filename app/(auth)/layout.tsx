import Link from "next/link";
import { LogoMark } from "@/components/home/logo-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2 text-foreground">
        <LogoMark className="h-7 w-7" />
        <span className="font-display text-lg">
          Bring<span className="text-gold">Books</span>
        </span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
