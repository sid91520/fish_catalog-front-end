"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ErrorView({
  error,
  reset,
  title = "Something went wrong",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        We couldn&apos;t load this page. Please check your connection and try again.
      </p>
      <Button onClick={reset} className="mt-6 rounded-full">
        Try again
      </Button>
    </div>
  );
}
