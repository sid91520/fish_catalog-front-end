import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md glass-soft bg-foreground/6", className)}
      {...props}
    />
  )
}

export { Skeleton }
