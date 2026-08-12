"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { signup } from "@/lib/auth-actions";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signup({ name, email, password });
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
      <h1 className="font-display mb-1 text-2xl text-foreground">Request access</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        New accounts need approval before they can enter the library.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
          />
        </div>
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
            minLength={8}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
          />
          <p className="mt-1 text-[0.7rem] text-muted-foreground">At least 8 characters</p>
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
          {isPending ? "Creating account…" : "Request access"}
        </button>

        <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
          By requesting access, you agree to our{" "}
          <Link href="/terms" className="text-gold hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-gold hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already approved?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
