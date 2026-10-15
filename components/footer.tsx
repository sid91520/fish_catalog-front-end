import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { navLinks, site, telUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="px-4 pb-6 pt-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#f5b82e]/60 bg-[#4a1a12] text-amber-50 shadow-[0_20px_50px_-20px_rgba(74,26,18,0.7)]">
        <div className="kinar" aria-hidden />
        <div className="p-8 sm:p-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-3 text-lg font-semibold">
              <Image src="/logo.png" alt="" width={44} height={54} className="h-14 w-auto" />
              {site.name}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-amber-100/80">
              Hand-picked, cleaned and delivered fresh every morning. Message us for today&apos;s catch and prices.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200/70">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-amber-100/80 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200/70">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-amber-100/80">
              <li className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-300/15 text-amber-300">
                  <Phone className="size-3.5" />
                </span>
                <a href={telUrl()} className="hover:text-white">
                  {site.phone ? `+${site.phone}` : "Call us"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-300/15 text-amber-300">
                  <Mail className="size-3.5" />
                </span>
                {site.email}
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-300/15 text-amber-300">
                  <MapPin className="size-3.5" />
                </span>
                {site.address}
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-300/15 text-amber-300">
                  <Clock className="size-3.5" />
                </span>
                {site.hours}
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-amber-200/20" />
        <p className="text-center text-xs text-amber-200/70">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        </div>
      </div>
    </footer>
  );
}
