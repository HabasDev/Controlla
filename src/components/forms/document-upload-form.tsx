"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck2, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { FormResult } from "@/components/forms/form-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { documentMetadataSchema, type DocumentMetadataInput } from "@/lib/validations/document";
import { uploadDocumentAction } from "@/modules/documents/actions";

export function DocumentUploadForm({
  companyId,
  obligations,
  assets,
  disabled
}: {
  companyId: string;
  obligations: { id: string; title: string }[];
  assets: { id: string; name: string }[];
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(disabled ? "Conecta Supabase Storage para subir documentos." : null);
  const [isOk, setIsOk] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<DocumentMetadataInput>({
    resolver: zodResolver(documentMetadataSchema),
    defaultValues: {
      companyId,
      obligationId: "",
      assetId: "",
      documentType: "",
      expirationDate: "",
      notes: ""
    }
  });

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      ref={formRef}
      onSubmit={form.handleSubmit(() => {
        if (disabled || !formRef.current) {
          return;
        }
        const formData = new FormData(formRef.current);
        startTransition(async () => {
          const result = await uploadDocumentAction(formData);
          setMessage(result.message ?? null);
          setIsOk(result.ok);
          if (result.ok) {
            formRef.current?.reset();
            form.reset();
            setSelectedFile(null);
          }
        });
      })}
    >
      <div className="md:col-span-2">
        <FormResult message={message} ok={isOk} />
      </div>
      <input type="hidden" value={companyId} {...form.register("companyId")} />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="document-file">Archivo privado</Label>
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-background/70 p-6 text-center transition hover:border-primary/40 hover:bg-muted/40">
          <Upload className="h-7 w-7 text-primary" aria-hidden="true" />
          <span className="mt-3 text-sm font-semibold">{selectedFile ?? "Selecciona un PDF, JPG, PNG o DOCX"}</span>
          <span className="mt-1 text-xs text-muted-foreground">Maximo 10 MB. La descarga se hara mediante URL firmada.</span>
          <Input
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            className="sr-only"
            disabled={disabled}
            id="document-file"
            name="file"
            onChange={(event) => setSelectedFile(event.target.files?.[0]?.name ?? null)}
            required
            type="file"
          />
        </label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="document-type">Tipo</Label>
        <Input disabled={disabled} id="document-type" placeholder="Seguro, ITV, certificado..." {...form.register("documentType")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="document-obligation">Obligacion</Label>
        <Select disabled={disabled} id="document-obligation" {...form.register("obligationId")}>
          <option value="">Sin obligacion</option>
          {obligations.map((obligation) => (
            <option key={obligation.id} value={obligation.id}>
              {obligation.title}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="document-asset">Activo</Label>
        <Select disabled={disabled} id="document-asset" {...form.register("assetId")}>
          <option value="">Sin activo</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="document-expiration">Fecha de caducidad</Label>
        <Input disabled={disabled} id="document-expiration" type="date" {...form.register("expirationDate")} />
        <p className="text-xs text-critical">{form.formState.errors.expirationDate?.message}</p>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="document-notes">Notas</Label>
        <Textarea disabled={disabled} id="document-notes" {...form.register("notes")} />
      </div>
      <div className="md:col-span-2">
        <Button disabled={disabled || isPending} type="submit">
          <FileCheck2 className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Archivando..." : "Subir documento"}
        </Button>
      </div>
    </form>
  );
}
