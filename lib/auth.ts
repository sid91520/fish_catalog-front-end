import { cookies } from "next/headers";
import { backendFetch } from "@/lib/backend";

export const TOKEN_COOKIE = "admin_token";
export const TOKEN_MAX_AGE = 60 * 60 * 12; // matches the backend's 12h JWT

export type Admin = { id: number; email: string };

export async function getToken() {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

/** Validates the stored token with the backend. Returns null when logged out or expired. */
export async function getAdmin(): Promise<Admin | null> {
  const token = await getToken();
  if (!token) return null;
  const res = await backendFetch("/admin/me", { token });
  return res.ok ? res.json() : null;
}
