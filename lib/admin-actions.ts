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

export async function disableUser(userId: string): Promise<AdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { ok: false, error: "Not authorized." };
  if (userId === admin.id) return { ok: false, error: "You can't disable your own account." };

  await prisma.user.update({
    where: { id: userId },
    data: { status: "DISABLED" },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function enableUser(userId: string): Promise<AdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { ok: false, error: "Not authorized." };

  await prisma.user.update({
    where: { id: userId },
    data: { status: "APPROVED", approvedAt: new Date(), approvedById: admin.id },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteUser(userId: string): Promise<AdminActionResult> {
  const admin = await requireSuperAdmin();
  if (!admin) return { ok: false, error: "Not authorized." };
  if (userId === admin.id) return { ok: false, error: "You can't delete your own account." };

  await prisma.user.delete({ where: { id: userId } });

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
