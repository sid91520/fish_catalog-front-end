"use server";

import { backendFetch } from "@/lib/backend";

export type LeadActionState = { success: boolean; message: string };

/** Public: a customer submits an order enquiry. No admin token involved. */
export async function createLead(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const mobileNumber = String(formData.get("mobileNumber") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const address = String(formData.get("address") ?? "").trim();
  const deliveryTime = String(formData.get("deliveryTime") ?? "").trim();
  const productId = Number(formData.get("productId"));

  if (!name || name.length < 2) return { success: false, message: "Enter your name." };
  if (!/^\+?[0-9]{10,15}$/.test(mobileNumber)) {
    return { success: false, message: "Enter a valid 10-15 digit mobile number." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Enter a valid email address." };
  }
  if (!address) return { success: false, message: "Enter a delivery address." };
  if (!deliveryTime) return { success: false, message: "Choose a delivery date and time." };
  if (!Number.isInteger(productId)) return { success: false, message: "Invalid product." };

  let res: Response;
  try {
    res = await backendFetch("/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobileNumber, email, address, deliveryTime, productId }),
    });
  } catch {
    return { success: false, message: "Could not reach the server. Try again." };
  }

  if (res.status === 404) return { success: false, message: "This product is no longer available." };
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = Array.isArray(body?.message) ? body.message.join(" ") : body?.message;
    return { success: false, message: detail || "Could not submit your enquiry. Try again." };
  }

  return { success: true, message: "" };
}
