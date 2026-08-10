"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isUniqueConstraintError } from "@/lib/prisma-errors";
import {
  SESSION_COOKIE_NAME,
  SUPER_ADMIN_EMAIL,
  generateSessionToken,
  hashPassword,
  sessionExpiryDate,
  verifyPassword,
} from "@/lib/auth";

export type AuthResult =
  | { ok: true; status: "APPROVED" | "PENDING" | "REJECTED" }
  | { ok: false; error: string };

async function createSessionForUser(userId: string) {
  const token = generateSessionToken();
  await prisma.session.create({
    data: { token, userId, expiresAt: sessionExpiryDate() },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: sessionExpiryDate(),
  });
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!name) return { ok: false, error: "Name is required." };
  if (!email || !email.includes("@")) return { ok: false, error: "Enter a valid email." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const isSuperAdmin = email === SUPER_ADMIN_EMAIL.toLowerCase();
  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: isSuperAdmin ? "SUPER_ADMIN" : "USER",
        status: isSuperAdmin ? "APPROVED" : "PENDING",
        approvedAt: isSuperAdmin ? new Date() : undefined,
      },
    });

    await createSessionForUser(user.id);
    revalidatePath("/", "layout");
    return { ok: true, status: user.status };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "An account with that email already exists." };
    }
    throw error;
  }
}

export async function login(input: { email: string; password: string }): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, error: "Invalid email or password." };
  }

  await createSessionForUser(user.id);
  revalidatePath("/", "layout");
  return { ok: true, status: user.status };
}

export async function logout(): Promise<{ ok: true }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
  revalidatePath("/", "layout");
  return { ok: true };
}
