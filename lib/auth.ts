import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma";

export const SESSION_COOKIE_NAME = "luxlibrary_session";
export const SESSION_DURATION_DAYS = 30;
export const SUPER_ADMIN_EMAIL = "khdanushka@gmail.com";

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function sessionExpiryDate(): Date {
  return new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

export async function requireApprovedUser(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user || user.status !== "APPROVED") return null;
  return user;
}

export async function requireSuperAdmin(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user || user.status !== "APPROVED" || user.role !== "SUPER_ADMIN") return null;
  return user;
}
