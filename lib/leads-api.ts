import { backendFetch } from "@/lib/backend";

export type Lead = {
  id: number;
  name: string;
  mobileNumber: string;
  email: string | null;
  address: string;
  deliveryTime: string;
  createdAt: string;
  productId: number;
  product: { id: number; name: string } | null;
};

/** Admin only: needs the admin token. */
export async function getLeads(token: string): Promise<Lead[]> {
  const res = await backendFetch("/leads", { token });
  if (!res.ok) throw new Error(`Could not load leads (backend responded ${res.status})`);
  return res.json();
}
