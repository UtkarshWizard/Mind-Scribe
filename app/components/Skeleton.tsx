import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("dark:bg-muted bg-gray-300 rounded-md animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
