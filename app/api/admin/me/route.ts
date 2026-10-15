import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";

/** Session check for the admin UI: 200 with the admin, or 401 (show the login form). */
export async function GET() {
  const admin = await getAdmin();
  return admin
    ? NextResponse.json(admin)
    : NextResponse.json({ message: "Login required" }, { status: 401 });
}
