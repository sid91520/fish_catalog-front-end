import Image from "next/image";
import { Fish as FishIcon } from "lucide-react";
import { isOptimizableImage } from "@/lib/fish";

/** Fills its (relative) parent. Falls back to an icon when the product has no image. */
export function FishImage({ src, alt, sizes }: { src: string | null; alt: string; sizes: string }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <FishIcon className="size-10" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={!isOptimizableImage(src)}
      className="object-cover"
    />
  );
}
