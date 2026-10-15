import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarClock, Fish, Inbox, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdmin, getToken } from "@/lib/auth";
import { getLeads } from "@/lib/leads-api";

export const metadata: Metadata = { title: "Leads · Mumbaicha Masewala", robots: { index: false } };

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default async function LeadsPage() {
  const admin = await getAdmin();
  const token = await getToken();
  if (!admin || !token) redirect("/admin");

  const leads = await getLeads(token);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            {leads.length} enquir{leads.length === 1 ? "y" : "ies"}, newest first
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin">
            <ArrowLeft className="size-4" /> Inventory
          </Link>
        </Button>
      </div>

      {leads.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-2xl p-10 text-center shadow-none">
          <Inbox className="size-8 text-slate-400" />
          <p className="text-sm text-slate-600">No leads yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {leads.map((lead) => (
            <Card key={lead.id} className="flex flex-col gap-4 rounded-2xl p-5 shadow-none">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-medium">{lead.name}</p>
                  <p className="text-xs text-slate-500">
                    Received {dateTime.format(new Date(lead.createdAt))}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  <Fish className="mr-1 size-3" />
                  {lead.product?.name ?? `Product #${lead.productId}`}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <CalendarClock className="size-4 shrink-0 text-primary" />
                  <span className="text-slate-500">Deliver by</span>
                  <span className="font-medium">
                    {dateTime.format(new Date(lead.deliveryTime))}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="whitespace-pre-line">{lead.address}</span>
                </p>
              </div>

              {lead.email && (
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 shrink-0 text-primary" />
                  <a href={`mailto:${lead.email}`} className="truncate hover:underline">
                    {lead.email}
                  </a>
                </p>
              )}

              <div className="mt-auto flex flex-wrap items-center gap-2 border-t pt-4">
                <span className="mr-auto text-sm font-medium">{lead.mobileNumber}</span>
                <Button asChild size="sm" variant="outline">
                  <a href={`tel:${lead.mobileNumber}`}>
                    <Phone className="size-4" /> Call
                  </a>
                </Button>
                <Button asChild size="sm">
                  <a
                    href={`https://wa.me/${lead.mobileNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
