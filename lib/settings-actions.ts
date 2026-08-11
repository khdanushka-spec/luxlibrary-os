"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireApprovedUser } from "@/lib/auth";

export type UserSettings = {
  reduceMotion: boolean;
  aiReadingSuggestions: boolean;
  autoGenerateSummaries: boolean;
  readingStreakReminders: boolean;
  weeklyDigest: boolean;
};

export type SettingsActionResult = { ok: true } | { ok: false; error: string };

export async function getUserSettings(): Promise<UserSettings | null> {
  const user = await requireApprovedUser();
  if (!user) return null;
  return {
    reduceMotion: user.reduceMotion,
    aiReadingSuggestions: user.aiReadingSuggestions,
    autoGenerateSummaries: user.autoGenerateSummaries,
    readingStreakReminders: user.readingStreakReminders,
    weeklyDigest: user.weeklyDigest,
  };
}

export async function updateSetting(
  key: keyof UserSettings,
  value: boolean
): Promise<SettingsActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  await prisma.user.update({
    where: { id: user.id },
    data: { [key]: value },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
