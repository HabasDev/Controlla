import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("control-surface flex min-h-56 flex-col items-center justify-center rounded-lg border p-8 text-center", className)}>
      <div className="mb-4 rounded-full border bg-background/70 p-3 shadow-sm">
        <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
