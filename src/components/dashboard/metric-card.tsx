import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type MetricCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "default" | "warning" | "critical" | "success";
};

const tones = {
  default: "text-primary bg-primary/10",
  warning: "text-warning bg-warning/[0.14]",
  critical: "text-critical bg-critical/10",
  success: "text-success bg-success/10"
};

export function MetricCard({ title, value, icon: Icon, tone = "default" }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("rounded-md p-2", tones[tone])}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
