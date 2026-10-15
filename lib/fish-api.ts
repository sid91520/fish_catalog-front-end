import { backendFetch } from "@/lib/backend";
import type { Fish } from "@/lib/fish";

export async function getFishList(): Promise<Fish[]> {
  const res = await backendFetch("/fish-products");
  if (!res.ok) throw new Error(`Could not load products (backend responded ${res.status})`);
  return res.json();
}

/** Returns null when the product does not exist. */
export async function getFish(id: number): Promise<Fish | null> {
  const res = await backendFetch(`/fish-products/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Could not load product (backend responded ${res.status})`);
  return res.json();
}
