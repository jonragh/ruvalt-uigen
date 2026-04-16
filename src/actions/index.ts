"use server";

import { createSession, deleteSession, getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function signIn(
  username: string,
  password: string
): Promise<AuthResult> {
  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!validUsername || !validPassword) {
    return {
      success: false,
      error:
        "Authentication not configured. Set AUTH_USERNAME and AUTH_PASSWORD in .env",
    };
  }

  if (username !== validUsername || password !== validPassword) {
    return { success: false, error: "Invalid credentials" };
  }

  // Try to create a matching DB record so project saving works (best-effort)
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.user.upsert({
      where: { email: validUsername },
      update: {},
      create: {
        id: "env-admin",
        email: validUsername,
        password: "env-auth",
      },
    });
  } catch {
    // DB not set up — auth still works, projects won't be persisted
  }

  await createSession("env-admin", validUsername);
  revalidatePath("/");
  return { success: true };
}

export async function signOut() {
  await deleteSession();
  revalidatePath("/");
  redirect("/login");
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;
  return { id: session.userId, email: session.email };
}
