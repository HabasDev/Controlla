"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SecureDownloadButton({ documentId, disabled }: { documentId: string; disabled?: boolean }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-1">
      <Button
        disabled={disabled || isPending}
        onClick={() =>
          startTransition(async () => {
            const response = await fetch(`/api/documents/${documentId}/signed-url`);
            const body = (await response.json()) as { signedUrl?: string; message?: string };

            if (body.signedUrl) {
              window.open(body.signedUrl, "_blank", "noopener,noreferrer");
              setMessage(null);
            } else {
              setMessage(body.message ?? "No se pudo preparar la descarga.");
            }
          })
        }
        size="sm"
        variant="outline"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Descargar
      </Button>
      {message ? <p className="text-xs text-critical">{message}</p> : null}
    </div>
  );
}
