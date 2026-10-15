import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "About Us · Mumbaicha Masewala" };

const stats = [
  { value: "10+", label: "Years of experience" },
  { value: "50+", label: "Varieties of fish" },
  { value: "5k+", label: "Happy families" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Honest fish, from the water to your kitchen.">
        We started with a simple idea: make it easy to buy truly fresh fish without the market rush.
      </PageHero>
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="glass rounded-3xl p-8 sm:p-10">
          <p className="max-w-3xl leading-8 text-slate-600">
            Every morning we work with local fishermen to hand-pick the best of the catch. Each fish is cleaned, cut
            to your preference and packed on ice so it reaches you at its freshest. No middlemen, no surprises: just
            good fish at fair prices, and a message away on WhatsApp.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-3xl p-8 text-center">
              <p className="text-4xl font-semibold text-primary">{s.value}</p>
              <p className="mt-2 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
