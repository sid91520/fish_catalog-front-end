import { NextResponse } from "next/server";
import { getFish } from "@/lib/fish-api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  try {
    const fish = await getFish(id);
    return fish
      ? NextResponse.json(fish)
      : NextResponse.json({ message: `Fish product ${id} not found` }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 502 });
  }
}
