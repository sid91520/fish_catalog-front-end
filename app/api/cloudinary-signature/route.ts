import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { getToken } from "@/lib/auth";

/** Admin only: proxies the backend's Cloudinary upload signature (the API secret stays on the backend). */
export async function GET() {
  const token = await getToken();
  if (!token) return NextResponse.json({ message: "Login required" }, { status: 401 });

  try {
    const res = await backendFetch("/uploads/signature", { token });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ message: "Could not reach the server" }, { status: 502 });
  }
}
