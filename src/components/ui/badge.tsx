import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-primary/10 text-primary ring-1 ring-primary/15",
      secondary: "bg-secondary text-secondary-foreground",
      success: "bg-success/[0.12] text-success ring-1 ring-success/20",
      warning: "bg-warning/[0.18] text-warning ring-1 ring-warning/25",
      critical: "bg-critical/[0.12] text-critical ring-1 ring-critical/20",
      outline: "border bg-background/80"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
