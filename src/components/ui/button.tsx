import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-control hover:bg-primary/92 hover:shadow-lg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border bg-background/80 shadow-sm backdrop-blur hover:border-primary/30 hover:bg-muted",
        ghost: "hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground shadow-control hover:bg-destructive/92"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-5",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} type={type} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
