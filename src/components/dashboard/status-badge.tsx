import { Badge } from "@/components/ui/badge";
import type { ComputedObligationStatus } from "@/lib/date/obligations";

const labels: Record<ComputedObligationStatus, string> = {
  completed: "Completado",
  expired: "Vencido",
  critical: "Urgente",
  warning: "Proximo a vencer",
  normal: "Correcto",
  cancelled: "Cancelado"
};

const variants: Record<ComputedObligationStatus, "success" | "critical" | "warning" | "secondary" | "outline"> = {
  completed: "success",
  expired: "critical",
  critical: "critical",
  warning: "warning",
  normal: "success",
  cancelled: "outline"
};

export function StatusBadge({ status }: { status: ComputedObligationStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
