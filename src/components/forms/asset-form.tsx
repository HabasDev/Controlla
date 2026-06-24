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
import { assetSchema, type AssetInput } from "@/lib/validations/asset";
import { createAssetAction } from "@/modules/assets/actions";

export function AssetForm({
  companyId,
  locations,
  members,
  disabled
}: {
  companyId: string;
  locations: { id: string; name: string }[];
  members: { userId: string; fullName: string }[];
  disabled?: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(disabled ? "Conecta la base de datos para crear activos." : null);
  const [isOk, setIsOk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<AssetInput>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      companyId,
      name: "",
      assetType: "Vehiculo",
      status: "active",
      locationId: "",
      responsibleUserId: "",
      internalReference: "",
      serialNumber: "",
      description: ""
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
          const result = await createAssetAction(values);
          setMessage(result.message ?? null);
          setIsOk(result.ok);
          if (result.ok) {
            form.reset();
            router.refresh();
          }
        })
      )}
    >
      <div className="md:col-span-2">
        <FormResult message={message} ok={isOk} />
      </div>
      <input type="hidden" {...form.register("companyId")} />
      <div className="space-y-2">
        <Label htmlFor="asset-name">Nombre</Label>
        <Input id="asset-name" disabled={disabled} {...form.register("name")} />
        <p className="text-xs text-critical">{form.formState.errors.name?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="asset-type">Tipo</Label>
        <Select id="asset-type" disabled={disabled} {...form.register("assetType")}>
          <option>Vehiculo</option>
          <option>Extintor</option>
          <option>Maquinaria</option>
          <option>Equipo industrial</option>
          <option>Dominio web</option>
          <option>Certificado SSL</option>
          <option>Local</option>
          <option>Otro</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="asset-location">Sede</Label>
        <Select id="asset-location" disabled={disabled} {...form.register("locationId")}>
          <option value="">Sin sede</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="asset-responsible">Responsable</Label>
        <Select id="asset-responsible" disabled={disabled} {...form.register("responsibleUserId")}>
          <option value="">Sin asignar</option>
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.fullName}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="asset-reference">Referencia interna</Label>
        <Input id="asset-reference" disabled={disabled} {...form.register("internalReference")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="asset-serial">Numero de serie</Label>
        <Input id="asset-serial" disabled={disabled} {...form.register("serialNumber")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="asset-description">Descripcion</Label>
        <Textarea id="asset-description" disabled={disabled} {...form.register("description")} />
      </div>
      <div className="md:col-span-2">
        <Button disabled={disabled || isPending} type="submit">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Crear activo
        </Button>
      </div>
    </form>
  );
}
