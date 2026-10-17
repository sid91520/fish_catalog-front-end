import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Snowflake, Truck, Waves } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getFishList } from "@/lib/fish-api";

const perks = [
  {
    icon: Waves,
    title: "Caught fresh",
    text: "Sourced every morning from trusted local fishermen.",
  },
  {
    icon: Snowflake,
    title: "Cleaned & chilled",
    text: "Cut, cleaned and packed on ice, ready to cook.",
  },
  {
    icon: Truck,
    title: "Quick delivery",
    text: "Order on WhatsApp and get it at your door.",
  },
];

export default async function HomePage() {
  const featured = (await getFishList()).slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <section className="py-14 text-center sm:py-20">
        <Image
          src="/logo.png"
          alt="Mumbaicha Masewala: ताजेपणाचा शाही अनुभव"
          width={160}
          height={196}
          priority
          className="mx-auto mb-8 h-40 w-auto drop-shadow-[0_12px_24px_rgba(80,40,20,0.25)] sm:h-52"
        />
        <p className="mx-auto mb-6 w-fit rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Fresh every morning
        </p>
        <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          Mumbaicha{" "}
          <span className="bg-gradient-to-r from-[#f08a00] via-[#d9480f] to-[#7a2e1b] bg-clip-text text-transparent">
            Masewala
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          ताजेपणाचा शाही अनुभव. Browse today&apos;s fresh catch and order
          directly for price, availability and delivery.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">
              View products <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {perks.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="glass rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      <section className="pt-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">
            Today&apos;s selection
          </h2>
          <Link
            href="/products"
            className="text-sm text-primary hover:underline"
          >
            See all
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-sm text-slate-600">
            No products available right now. Please check back soon.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((f) => (
              <ProductCard key={f.id} fish={f} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
