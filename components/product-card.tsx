import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { FishImage } from "@/components/fish-image";
import { formatPrice, type Fish } from "@/lib/fish";
import { whatsappUrl } from "@/lib/site";

export function ProductCard({ fish }: { fish: Fish }) {
  const hasDiscount = fish.discountPrice !== null && Number(fish.discountPrice) < Number(fish.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(fish.discountPrice) / Number(fish.price)) * 100)
    : 0;

  return (
    <article className="glass group overflow-hidden rounded-[2rem] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
        <div className="size-full transition duration-500 group-hover:scale-105">
          <FishImage
            src={fish.image}
            alt={fish.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        {hasDiscount && (
          <Badge className="absolute left-3 top-3 rounded-full border-0 bg-destructive px-2.5 py-1 text-[11px] font-semibold text-destructive-foreground shadow-md">
            {discountPercent}% OFF
          </Badge>
        )}
      </div>
      <div className="px-3 pb-3 pt-5">
        <h3 className="truncate text-lg font-semibold tracking-tight">{fish.name}</h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base font-semibold text-primary">
            {formatPrice(hasDiscount ? fish.discountPrice! : fish.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-500 line-through">{formatPrice(fish.price)}</span>
          )}
          <span className="text-xs text-slate-500">/ kg</span>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <EnquiryDialog fish={fish} />
          <Button asChild variant="outline" className="w-full rounded-full">
            <a
              href={whatsappUrl(`Hello, I would like to inquire about ${fish.name}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
