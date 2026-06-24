import { getObligationStatus } from "@/lib/date/obligations";
import type { ObligationStatus } from "@/types";

export type ReportObligationInput = {
  dueDate: string;
  status: ObligationStatus;
};

export function buildObligationStatusSummary(obligations: ReportObligationInput[]) {
  return obligations.reduce(
    (summary, obligation) => {
      const status = getObligationStatus(obligation);
      summary[status] += 1;
      return summary;
    },
    {
      completed: 0,
      expired: 0,
      critical: 0,
      warning: 0,
      normal: 0,
      cancelled: 0
    }
  );
}
