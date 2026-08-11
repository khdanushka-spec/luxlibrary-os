"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireApprovedUser } from "@/lib/auth";

export type StatsActionResult = { ok: true } | { ok: false; error: string };

function revalidateStatsPages() {
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  revalidatePath("/reading");
}

export async function updateReadingStreak(days: number): Promise<StatsActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };
  if (!Number.isInteger(days) || days < 0 || days > 100_000) {
    return { ok: false, error: "Enter a valid number of days." };
  }

  await prisma.user.update({ where: { id: user.id }, data: { readingStreakDays: days } });
  revalidateStatsPages();
  return { ok: true };
}

export async function updateReadingChallengeGoal(goal: number): Promise<StatsActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };
  if (!Number.isInteger(goal) || goal < 1 || goal > 100_000) {
    return { ok: false, error: "Enter a valid goal." };
  }

  await prisma.user.update({ where: { id: user.id }, data: { readingChallengeGoal: goal } });
  revalidateStatsPages();
  return { ok: true };
}
