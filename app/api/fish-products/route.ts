import { NextResponse } from "next/server";
import { getFishList } from "@/lib/fish-api";

export async function GET() {
  try {
    return NextResponse.json(await getFishList());
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 502 });
  }
}
