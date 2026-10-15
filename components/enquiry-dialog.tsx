"use client";

import { CheckCircle2, MessageCircle, ShoppingBag, Truck } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { createLead, type LeadActionState } from "@/app/actions/lead-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Fish } from "@/lib/fish";
import { whatsappUrl } from "@/lib/site";

const initialState: LeadActionState = { success: false, message: "" };

/** "YYYY-MM-DDTHH:mm" in the browser's local time, for the datetime-local min/max attributes. */
function toLocalInputValue(d: Date) {
  const copy = new Date(d);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 16);
}

function todayEnd() {
  const d = new Date();
  d.setHours(23, 59, 0, 0);
  return d;
}

export function EnquiryDialog({ fish }: { fish: Fish }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [details, setDetails] = useState({ name: "", address: "", deliveryTime: "" });
  const [state, formAction, pending] = useActionState(createLead, initialState);

  // Every time the dialog opens, show a clean form: last run's result shouldn't leak in.
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      formRef.current?.reset();
    }
  }, [open]);

  useEffect(() => {
    if (state.success) setSubmitted(true);
  }, [state]);

  function handleSubmit(formData: FormData) {
    setDetails({
      name: String(formData.get("name") ?? ""),
      address: String(formData.get("address") ?? ""),
      deliveryTime: String(formData.get("deliveryTime") ?? ""),
    });
    formAction(formData);
  }

  const message = `Hello, I'm ${details.name}. I'd like to order ${fish.name} for delivery on ${new Date(
    details.deliveryTime,
  ).toLocaleString()} at: ${details.address}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-full">
          <ShoppingBag className="size-4" /> Order Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-6" />
            </span>
            <DialogTitle>Enquiry sent!</DialogTitle>
            <p className="text-sm text-slate-600">
              We&apos;ve noted your request for {fish.name}. Tap below to confirm it on WhatsApp.
            </p>
            <Button asChild size="lg" className="mt-2 w-full rounded-full">
              <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                <MessageCircle className="size-4" /> Continue on WhatsApp
              </a>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Order {fish.name}</DialogTitle>
            </DialogHeader>
            <p className="-mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
              <Truck className="size-4" /> Ordered today, delivered today
            </p>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <input type="hidden" name="productId" value={fish.id} />
              <div className="space-y-2">
                <Label htmlFor={`lead-name-${fish.id}`}>Your Name</Label>
                <Input id={`lead-name-${fish.id}`} name="name" placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lead-mobile-${fish.id}`}>Mobile Number</Label>
                <Input
                  id={`lead-mobile-${fish.id}`}
                  name="mobileNumber"
                  type="tel"
                  placeholder="+919876543210"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lead-email-${fish.id}`}>Email</Label>
                <Input
                  id={`lead-email-${fish.id}`}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                <p className="text-xs text-slate-500">We&apos;ll use it to send updates about your booking.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lead-time-${fish.id}`}>Delivery Time (today)</Label>
                <Input
                  id={`lead-time-${fish.id}`}
                  name="deliveryTime"
                  type="datetime-local"
                  min={toLocalInputValue(new Date())}
                  max={toLocalInputValue(todayEnd())}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lead-address-${fish.id}`}>Delivery Address</Label>
                <Textarea
                  id={`lead-address-${fish.id}`}
                  name="address"
                  placeholder="House no., street, area, city"
                  required
                  className="min-h-20 resize-none"
                />
              </div>
              {state.message && <p className="text-sm text-red-700">{state.message}</p>}
              <DialogFooter>
                <Button type="submit" disabled={pending} className="w-full">
                  {pending ? "Submitting..." : "Submit enquiry"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
