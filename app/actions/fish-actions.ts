"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";
import { getToken, TOKEN_COOKIE } from "@/lib/auth";

export type FishActionState = { success: boolean; message: string };

const CLOUDINARY_URL = /^https:\/\/res\.cloudinary\.com\/.+\.webp$/i;
const MAX_IMAGE_BYTES = 50 * 1024;
const SESSION_EXPIRED = "Session expired. Please log in again.";

function refresh() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}

/** Clears the cookie and refreshes /admin so the login form shows again. */
async function expireSession(): Promise<FishActionState> {
  (await cookies()).delete(TOKEN_COOKIE);
  revalidatePath("/admin");
  return { success: false, message: SESSION_EXPIRED };
}

/** Re-checks the uploaded file itself, since the browser-side checks can be bypassed. */
async function isValidWebp(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (!res.ok) return false;
    const size = Number(res.headers.get("content-length"));
    return res.headers.get("content-type") === "image/webp" && size > 0 && size <= MAX_IMAGE_BYTES;
  } catch {
    return false;
  }
}

export async function addFish(
  _prev: FishActionState,
  formData: FormData,
): Promise<FishActionState> {
  const token = await getToken();
  if (!token) return { success: false, message: SESSION_EXPIRED };

  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const discountRaw = String(formData.get("discountPrice") ?? "").trim();
  const discountPrice = discountRaw === "" ? undefined : Number(discountRaw);
  const image = String(formData.get("image") ?? "").trim();

  if (!name) return { success: false, message: "Fish name is required." };
  if (!Number.isFinite(price) || price < 0) return { success: false, message: "Enter a valid price." };
  if (discountPrice !== undefined && (!Number.isFinite(discountPrice) || discountPrice < 0)) {
    return { success: false, message: "Enter a valid discount price." };
  }
  if (!CLOUDINARY_URL.test(image)) return { success: false, message: "Please upload a WebP image first." };
  if (!(await isValidWebp(image))) {
    return { success: false, message: "Image must be a WebP file of 50 KB or smaller." };
  }

  let res: Response;
  try {
    res = await backendFetch("/fish-products", {
      method: "POST",
      token,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, discountPrice, image }),
    });
  } catch {
    return { success: false, message: "Could not reach the server. Try again." };
  }

  if (res.status === 401) return expireSession();
  if (!res.ok) return { success: false, message: "Could not add the fish. Try again." };

  refresh();
  return { success: true, message: `${name} added.` };
}

export async function updateFish(
  id: number,
  _prev: FishActionState,
  formData: FormData,
): Promise<FishActionState> {
  const token = await getToken();
  if (!token) return { success: false, message: SESSION_EXPIRED };

  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const discountRaw = String(formData.get("discountPrice") ?? "").trim();
  const discountPrice = discountRaw === "" ? null : Number(discountRaw);
  const image = String(formData.get("image") ?? "").trim();

  if (!name) return { success: false, message: "Fish name is required." };
  if (!Number.isFinite(price) || price < 0) return { success: false, message: "Enter a valid price." };
  if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0)) {
    return { success: false, message: "Enter a valid discount price." };
  }
  // image is optional here: an empty value means "keep the current image".
  if (image && !CLOUDINARY_URL.test(image)) {
    return { success: false, message: "Please upload a WebP image first." };
  }
  if (image && !(await isValidWebp(image))) {
    return { success: false, message: "Image must be a WebP file of 50 KB or smaller." };
  }

  let res: Response;
  try {
    res = await backendFetch(`/fish-products/${id}`, {
      method: "PATCH",
      token,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, discountPrice, ...(image ? { image } : {}) }),
    });
  } catch {
    return { success: false, message: "Could not reach the server. Try again." };
  }

  if (res.status === 401) return expireSession();
  if (res.status === 404) return { success: false, message: "This fish no longer exists." };
  if (!res.ok) return { success: false, message: "Could not update the fish. Try again." };

  refresh();
  return { success: true, message: `${name} updated.` };
}

export async function deleteFish(id: number) {
  const token = await getToken();
  if (!token) {
    await expireSession();
    return;
  }

  const res = await backendFetch(`/fish-products/${id}`, { method: "DELETE", token });
  if (res.status === 401) {
    await expireSession();
    return;
  }
  refresh();
}
