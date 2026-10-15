"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { updateFish, type FishActionState } from "@/app/actions/fish-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Fish } from "@/lib/fish";

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
  if (sigRes.status === 401) throw new Error("Session expired. Please log in again.");
  if (!sigRes.ok) throw new Error("Could not start the upload. Try again.");
  const sig: Signature = await sigRes.json();

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  body.append("timestamp", String(sig.timestamp));
  body.append("signature", sig.signature);
  body.append("folder", sig.folder);
  body.append("allowed_formats", sig.allowedFormats);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Image upload failed.");
  return data.secure_url as string;
}

export function EditFishDialog({ fish }: { fish: Fish }) {
  const updateThisFish = updateFish.bind(null, fish.id);
  const [state, formAction, pending] = useActionState(updateThisFish, initialState);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  // Reset the per-open state (new image, errors) each time the dialog is opened.
  useEffect(() => {
    if (open) {
      setImageUrl("");
      setUploadError("");
    }
  }, [open]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageUrl("");
    setUploadError("");
    if (!file) return;
    if (file.type !== "image/webp") return setUploadError("Only WebP images are allowed.");
    if (file.size > MAX_IMAGE_BYTES) return setUploadError("Image must be 50 KB or smaller.");

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="icon" variant="outline" aria-label={`Edit ${fish.name}`}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {fish.name}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`name-${fish.id}`}>Fish Name</Label>
            <Input id={`name-${fish.id}`} name="name" defaultValue={fish.name} required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`price-${fish.id}`}>Price (₹ / kg)</Label>
              <Input
                id={`price-${fish.id}`}
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={fish.price}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`discountPrice-${fish.id}`}>Discount Price (optional)</Label>
              <Input
                id={`discountPrice-${fish.id}`}
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={fish.discountPrice ?? ""}
                placeholder="None"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`image-${fish.id}`}>Fish Image (optional)</Label>
            <div className="flex items-center gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {(imageUrl || fish.image) && (
                  <Image src={imageUrl || fish.image!} alt={fish.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <Input
                  id={`image-${fish.id}`}
                  type="file"
                  accept="image/webp"
                  onChange={handleFile}
                  disabled={uploading || pending}
                />
                <p className="text-xs leading-5 text-slate-500">Leave empty to keep the current image.</p>
              </div>
            </div>
            <input type="hidden" name="image" value={imageUrl} />
            {uploading && <p className="text-sm text-slate-600">Uploading…</p>}
            {uploadError && <p className="text-sm text-red-700">{uploadError}</p>}
          </div>
          {state.message && (
            <p className={`text-sm ${state.success ? "text-emerald-800" : "text-red-700"}`}>{state.message}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending || uploading}>
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
