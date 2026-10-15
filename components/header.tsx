"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { navLinks, site, telUrl } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="kinar fixed inset-x-0 top-0 -z-10" aria-hidden />
      <div className="glass mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full px-3 pl-5">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight transition hover:opacity-80">
          <Image src="/logo.png" alt="" width={36} height={44} priority className="h-11 w-auto drop-shadow-sm" />
          <span className="hidden min-[400px]:inline">{site.name}</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition",
                isActive(l.href)
                  ? "bg-foreground/7 text-foreground"
                  : "text-slate-600 hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="rounded-full">
            <a href={telUrl()} aria-label="Call us">
              <Phone className="size-4" />
              <span className="hidden sm:inline">Call now</span>
            </a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="mb-6 flex items-center gap-2">
                <Image src="/logo.png" alt="" width={28} height={34} className="h-9 w-auto" /> {site.name}
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {navLinks.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "rounded-xl px-4 py-3 text-base transition hover:bg-foreground/5",
                        isActive(l.href) && "bg-foreground/7 font-medium",
                      )}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
