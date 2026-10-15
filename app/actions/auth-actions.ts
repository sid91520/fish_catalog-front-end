"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";
import { TOKEN_COOKIE, TOKEN_MAX_AGE } from "@/lib/auth";

export type AuthActionState = { success: boolean; message: string };

export async function loginAdmin(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { success: false, message: "Email and password are required." };

  let res: Response;
  try {
    res = await backendFetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return { success: false, message: "Could not reach the server. Try again." };
  }

  if (res.status === 401) return { success: false, message: "Invalid email or password." };
  if (!res.ok) return { success: false, message: "Login failed. Try again." };

  const { token } = (await res.json()) as { token: string };
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
  revalidatePath("/admin");
  return { success: true, message: "" };
}

export async function logoutAdmin() {
  (await cookies()).delete(TOKEN_COOKIE);
  revalidatePath("/admin");
}
