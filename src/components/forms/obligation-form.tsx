"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { FormResult } from "@/components/forms/form-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { obligationSchema, type ObligationInput } from "@/lib/validations/obligation";
import { createObligationAction, updateObligationAction } from "@/modules/obligations/actions";

export function ObligationForm({
  companyId,
  obligationId,
  initialValues,
  obligationTypes,
  assets,
  locations,
  members,
  disabled
}: {
  companyId: string;
  obligationId?: string;
  initialValues?: Partial<ObligationInput>;
  obligationTypes: { id: string; name: string }[];
  assets: { id: string; name: string }[];
  locations: { id: string; name: string }[];
  members: { userId: string; fullName: string }[];
  disabled?: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(disabled ? "Conecta la base de datos para crear obligaciones." : null);
  const [isOk, setIsOk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ObligationInput>({
    resolver: zodResolver(obligationSchema),
    defaultValues: {
      companyId,
      title: initialValues?.title ?? "",
      obligationTypeId: initialValues?.obligationTypeId ?? obligationTypes[0]?.id ?? "",
      assetId: initialValues?.assetId ?? "",
      locationId: initialValues?.locationId ?? "",
      responsibleUserId: initialValues?.responsibleUserId ?? "",
      dueDate: initialValues?.dueDate ?? "",
      priority: initialValues?.priority ?? "medium",
      status: initialValues?.status ?? "active",
      recurrenceEnabled: initialValues?.recurrenceEnabled ?? false,
      recurrenceUnit: initialValues?.recurrenceUnit ?? "years",
      recurrenceInterval: initialValues?.recurrenceInterval ?? 1,
      autoCreateNext: initialValues?.autoCreateNext ?? false,
      description: initialValues?.description ?? "",
      notes: initialValues?.notes ?? "",
      reminderRules: []
    }
  });

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          if (disabled) {
            return;
          }
          const result = obligationId
            ? await updateObligationAction(companyId, obligationId, values)
            : await createObligationAction(values);
          setMessage(result.message ?? null);
          setIsOk(result.ok);
          if (result.ok) {
            if (!obligationId) {
              form.reset();
              if (result.data?.obligationId) {
                router.push(`/dashboard/obligaciones/${result.data.obligationId}`);
              }
            }
            router.refresh();
          }
        })
      )}
    >
      <div className="md:col-span-2">
        <FormResult message={message} ok={isOk} />
      </div>
      <input type="hidden" {...form.register("companyId")} />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="obligation-title">Titulo</Label>
        <Input id="obligation-title" disabled={disabled} {...form.register("title")} />
        <p className="text-xs text-critical">{form.formState.errors.title?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="obligation-type">Tipo</Label>
        <Select id="obligation-type" disabled={disabled} {...form.register("obligationTypeId")}>
          {obligationTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="obligation-due">Fecha de vencimiento</Label>
        <Input id="obligation-due" disabled={disabled} type="date" {...form.register("dueDate")} />
        <p className="text-xs text-critical">{form.formState.errors.dueDate?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="obligation-asset">Activo</Label>
        <Select id="obligation-asset" disabled={disabled} {...form.register("assetId")}>
          <option value="">Sin activo</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="obligation-location">Sede</Label>
        <Select id="obligation-location" disabled={disabled} {...form.register("locationId")}>
          <option value="">Sin sede</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="obligation-responsible">Responsable</Label>
        <Select id="obligation-responsible" disabled={disabled} {...form.register("responsibleUserId")}>
          <option value="">Sin asignar</option>
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.fullName}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="obligation-priority">Prioridad</Label>
        <Select id="obligation-priority" disabled={disabled} {...form.register("priority")}>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="critical">Critica</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="obligation-recurrence-unit">Periodicidad</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select id="obligation-recurrence-unit" disabled={disabled} {...form.register("recurrenceUnit")}>
            <option value="days">Dias</option>
            <option value="weeks">Semanas</option>
            <option value="months">Meses</option>
            <option value="years">Años</option>
          </Select>
          <Input disabled={disabled} min={1} type="number" {...form.register("recurrenceInterval", { valueAsNumber: true })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" disabled={disabled} {...form.register("recurrenceEnabled")} />
          Recurrente
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" disabled={disabled} {...form.register("autoCreateNext")} />
          Crear siguiente automaticamente al completar
        </label>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="obligation-description">Descripcion</Label>
        <Textarea id="obligation-description" disabled={disabled} {...form.register("description")} />
      </div>
      <div className="md:col-span-2">
        <Button disabled={disabled || isPending} type="submit">
          <Plus className="h-4 w-4" aria-hidden="true" />
          {obligationId ? "Guardar cambios" : "Crear obligacion"}
        </Button>
      </div>
    </form>
  );
}
