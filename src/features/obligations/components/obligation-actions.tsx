"use client";

import { useState, useTransition } from "react";
import { CalendarPlus, Check, CheckCheck, Copy, ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  cancelObligationAction,
  completeObligationAction,
  createNextRenewalAction,
  duplicateObligationAction,
  resolveObligationAction,
  reviewObligationAction
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
  const [message, setMessage] = useState<string | null>(null);

  function run(action: () => Promise<{ ok: boolean; message?: string }>) {
    startTransition(async () => {
      const result = await action();
      setMessage(result.message ?? null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
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
          onClick={() => run(() => reviewObligationAction(companyId, obligationId))}
          size="sm"
          title="Marcar como revisada"
          variant="outline"
        >
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          Revisada
        </Button>
        <Button
          disabled={disabled || isPending}
          onClick={() => run(() => resolveObligationAction(companyId, obligationId))}
          size="sm"
          title="Marcar como resuelta"
          variant="outline"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Resolver
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
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}
