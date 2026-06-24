"use client";

import { useTransition } from "react";
import { CalendarPlus, Check, Copy, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  cancelObligationAction,
  completeObligationAction,
  createNextRenewalAction,
  duplicateObligationAction
} from "@/modules/obligations/actions";

export function ObligationActions({
  companyId,
  obligationId,
  recurrenceEnabled,
  disabled
}: {
  companyId: string;
  obligationId: string;
  recurrenceEnabled?: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        disabled={disabled || isPending}
        onClick={() => run(() => completeObligationAction(companyId, obligationId))}
        size="sm"
        title="Marcar como completada"
        variant="outline"
      >
        <Check className="h-4 w-4" aria-hidden="true" />
        Completar
      </Button>
      <Button
        disabled={disabled || isPending}
        onClick={() => run(() => duplicateObligationAction(companyId, obligationId))}
        size="sm"
        title="Duplicar obligacion"
        variant="outline"
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
        Duplicar
      </Button>
      <Button
        disabled={disabled || isPending}
        onClick={() => run(() => cancelObligationAction(companyId, obligationId))}
        size="sm"
        title="Cancelar obligacion"
        variant="outline"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        Cancelar
      </Button>
      {recurrenceEnabled ? (
        <Button
          disabled={disabled || isPending}
          onClick={() => run(() => createNextRenewalAction(companyId, obligationId))}
          size="sm"
          title="Crear proxima renovacion"
          variant="outline"
        >
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Renovacion
        </Button>
      ) : null}
    </div>
  );
}
