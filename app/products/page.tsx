import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { getFishList } from "@/lib/fish-api";

export const metadata: Metadata = { title: "Products · Mumbaicha Masewala" };

export default async function ProductsPage() {
  const fishList = await getFishList();

  return (
    <>
      <PageHero eyebrow="Products" title="Today's catch">
        Every item is cleaned and packed fresh. Tap enquire to check availability and price on WhatsApp.
      </PageHero>
      {fishList.length === 0 ? (
        <p className="mx-auto max-w-6xl px-4 text-sm text-slate-600">
          No products available right now. Please check back soon.
        </p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {fishList.map((f) => (
            <ProductCard key={f.id} fish={f} />
          ))}
        </div>
      )}
    </>
  );
}
