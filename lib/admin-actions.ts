"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

export async function approveUser(userId: string): Promise<AdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { ok: false, error: "Not authorized." };

  await prisma.user.update({
    where: { id: userId },
    data: { status: "APPROVED", approvedAt: new Date(), approvedById: admin.id },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function rejectUser(userId: string): Promise<AdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { ok: false, error: "Not authorized." };

  await prisma.user.update({
    where: { id: userId },
    data: { status: "REJECTED", approvedById: admin.id },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function getAllUsers() {
  const admin = await requireSuperAdmin();
  if (!admin) return [];

  return prisma.user.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      approvedAt: true,
    },
  });
}
