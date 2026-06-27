"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { deleteDocumentAction } from "@/modules/documents/actions";

export function DeleteDocumentButton({
  companyId,
  documentId,
  disabled
}: {
  companyId: string;
  documentId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={disabled || isPending}
      onClick={() => {
        const confirmed = window.confirm("Vas a eliminar este documento. Esta accion no se puede deshacer.");

        if (!confirmed) {
          return;
        }

        startTransition(async () => {
          await deleteDocumentAction(companyId, documentId);
          router.refresh();
        });
      }}
      size="sm"
      title="Eliminar documento"
      variant="outline"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      Eliminar
    </Button>
  );
}
