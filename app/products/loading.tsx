import { PageHero } from "@/components/page-hero";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

export default function Loading() {
  return (
    <>
      <PageHero eyebrow="Products" title="Today's catch" />
      <ProductGridSkeleton count={8} />
    </>
  );
}
