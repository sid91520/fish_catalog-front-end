"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { addFish, type FishActionState } from "@/app/actions/fish-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: FishActionState = { success: false, message: "" };
const MAX_IMAGE_BYTES = 50 * 1024;

type Signature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
};

/** Uploads straight to Cloudinary using a backend-signed request and returns the image URL. */
async function uploadToCloudinary(file: File): Promise<string> {
  const sigRes = await fetch("/api/cloudinary-signature");
  if (sigRes.status === 401)
    throw new Error("Session expired. Please log in again.");
  if (!sigRes.ok) throw new Error("Could not start the upload. Try again.");
  const sig: Signature = await sigRes.json();

  // Every signed param must be sent with exactly the values that were signed.
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  body.append("timestamp", String(sig.timestamp));
  body.append("signature", sig.signature);
  body.append("folder", sig.folder);
  body.append("allowed_formats", sig.allowedFormats);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    {
      method: "POST",
      body,
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Image upload failed.");
  return data.secure_url as string;
}

export function AdminFishForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(addFish, initialState);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setImageUrl("");
    }
  }, [state.success]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageUrl("");
    setUploadError("");
    if (!file) return;
    if (file.type !== "image/webp")
      return setUploadError("Only WebP images are allowed.");
    if (file.size > MAX_IMAGE_BYTES)
      return setUploadError("Image must be 50 KB or smaller.");

    setUploading(true);
    try {
      setImageUrl(await uploadToCloudinary(file));
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Fish Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Pomfret"
          required
         
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹ / kg)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="850"
            required
           
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountPrice">Discount Price (optional)</Label>
          <Input
            id="discountPrice"
            name="discountPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="750"
           
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image-file">Fish Image</Label>
        {/* No name: the file goes to Cloudinary from the browser; only the resulting URL is submitted. */}
        <Input
          id="image-file"
          type="file"
          accept="image/webp"
          onChange={handleFile}
          disabled={uploading || pending}
         
        />
        <input type="hidden" name="image" value={imageUrl} />
        <p className="text-xs leading-5 text-slate-500">
          WebP only. Maximum image size 50 KB.
        </p>
        {uploading && <p className="text-sm text-slate-600">Uploading…</p>}
        {uploadError && <p className="text-sm text-red-700">{uploadError}</p>}
        {imageUrl && (
          <div className="relative size-24 overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt="Uploaded preview"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        )}
      </div>
      {state.message && (
        <p
          className={`text-sm ${state.success ? "text-emerald-800" : "text-red-700"}`}
        >
          {state.message}
        </p>
      )}
      <Button
        type="submit"
        disabled={pending || uploading || !imageUrl}
        className="w-full sm:w-auto"
      >
        {pending ? "Adding..." : "Add Fish"}
      </Button>
    </form>
  );
}
