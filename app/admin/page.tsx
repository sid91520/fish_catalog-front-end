import type { Metadata } from "next";
import Link from "next/link";
import { Fish as FishIcon, LogOut, PackageOpen, Users } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth-actions";
import { AdminFishForm } from "@/components/admin-fish-form";
import { AdminLoginForm } from "@/components/admin-login-form";
import { DeleteFishButton } from "@/components/delete-fish-button";
import { EditFishDialog } from "@/components/edit-fish-dialog";
import { FishImage } from "@/components/fish-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAdmin } from "@/lib/auth";
import { getFishList } from "@/lib/fish-api";
import { formatPrice } from "@/lib/fish";

export const metadata: Metadata = { title: "Admin · Mumbaicha Masewala", robots: { index: false } };

export default async function AdminPage() {
  const admin = await getAdmin();

  // Not logged in: show only the login form.
  if (!admin) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-16">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_rgba(124,92,255,0.6)]">
            <FishIcon className="size-6" />
          </span>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin login</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage the fish catalog.</p>
        </div>
        <Card className="rounded-3xl p-6 shadow-none sm:p-7">
          <AdminLoginForm />
        </Card>
      </div>
    );
  }

  const fishList = await getFishList();

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Fish Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-500">Signed in as {admin.email}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/leads">
              <Users className="size-4" /> Leads
            </Link>
          </Button>
          <form action={logoutAdmin}>
            <Button type="submit" size="sm" variant="outline">
              <LogOut className="size-4" /> Log out
            </Button>
          </form>
        </div>
      </div>

      <Card className="rounded-3xl p-5 shadow-none sm:p-7">
        <h2 className="mb-6 text-lg font-medium">Add Fish</h2>
        <AdminFishForm />
      </Card>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-medium">Current Inventory</h2>
          <p className="text-sm text-slate-500">
            {fishList.length} item{fishList.length === 1 ? "" : "s"}
          </p>
        </div>

        {fishList.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 rounded-2xl p-10 text-center shadow-none">
            <PackageOpen className="size-8 text-slate-400" />
            <p className="text-sm text-slate-600">No fish have been added yet.</p>
          </Card>
        ) : (
          <Card className="rounded-2xl p-2 shadow-none sm:p-3">
            {fishList.map((fish, i) => (
              <div key={fish.id}>
                {i > 0 && <Separator className="my-2" />}
                <div className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-foreground/3 sm:p-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-20">
                    <FishImage src={fish.image} alt={fish.name} sizes="80px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{fish.name}</p>
                    <div className="mt-1 flex items-baseline gap-2 text-sm">
                      <span className="font-medium text-primary">
                        {formatPrice(fish.discountPrice ?? fish.price)}
                      </span>
                      {fish.discountPrice !== null && (
                        <span className="text-slate-500 line-through">{formatPrice(fish.price)}</span>
                      )}
                      <span className="text-slate-500">/ kg</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <EditFishDialog fish={fish} />
                    <DeleteFishButton id={fish.id} name={fish.name} />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
