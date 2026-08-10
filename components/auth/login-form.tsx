"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { login } from "@/lib/auth-actions";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await login({ email, password });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(result.status === "APPROVED" ? "/dashboard" : "/pending");
      router.refresh();
    });
  }

  return (
    <div className="glass rounded-2xl border border-border/70 p-6 shadow-2xl">
      <h1 className="font-display mb-1 text-2xl text-foreground">Sign in</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Welcome back to your library.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Password
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-rose-400">
            <AlertCircle className="size-3.5" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="h-9 w-full rounded-full bg-gold text-sm font-medium text-gold-foreground disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-gold hover:underline">
          Request access
        </Link>
      </p>
    </div>
  );
}
