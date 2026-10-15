import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site, telUrl, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Contact · Mumbaicha Masewala" };

const details = [
  { icon: Phone, label: "Phone", value: site.phone ? `+${site.phone}` : "Call us" },
  { icon: Mail, label: "Email", value: site.email },
  { icon: MapPin, label: "Address", value: site.address },
  { icon: Clock, label: "Hours", value: site.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk fish.">
        Call or message us for today&apos;s prices, availability and delivery.
      </PageHero>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2">
        {details.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="glass flex items-center gap-4 rounded-3xl p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-1 font-medium">{value}</p>
            </div>
          </div>
        ))}
        <div className="glass flex flex-wrap gap-3 rounded-3xl p-6 sm:col-span-2">
          <Button asChild size="lg" className="rounded-full">
            <a href={telUrl()}>
              <Phone className="size-4" /> Call now
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={whatsappUrl("Hello, I would like to place an order")} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" /> WhatsApp us
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
