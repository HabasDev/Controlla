"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { FormResult } from "@/components/forms/form-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { companySchema, type CompanyInput } from "@/lib/validations/company";
import { createInitialCompanyAction, updateCompanyAction } from "@/modules/companies/actions";

export function CompanyForm({
  companyId,
  initialValues,
  disabled
}: {
  companyId?: string;
  initialValues?: Partial<CompanyInput>;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(disabled ? "Conecta Supabase y DATABASE_URL para guardar cambios." : null);
  const [isOk, setIsOk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      legalName: initialValues?.legalName ?? "",
      taxId: initialValues?.taxId ?? "",
      timezone: initialValues?.timezone ?? "Europe/Madrid",
      industry: initialValues?.industry ?? ""
    }
  });

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          if (disabled) {
            return;
          }
          const result = companyId ? await updateCompanyAction(companyId, values) : await createInitialCompanyAction(values);
          setMessage(result.message ?? null);
          setIsOk(result.ok);
          if (result.ok) {
            router.push("/dashboard");
            router.refresh();
          }
        })
      )}
    >
      <div className="md:col-span-2">
        <FormResult message={message} ok={isOk} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-name">Nombre</Label>
        <Input id="company-name" disabled={disabled} {...form.register("name")} />
        <p className="text-xs text-critical">{form.formState.errors.name?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-legal-name">Razon social</Label>
        <Input id="company-legal-name" disabled={disabled} {...form.register("legalName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-tax-id">CIF/NIF</Label>
        <Input id="company-tax-id" disabled={disabled} {...form.register("taxId")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-industry">Sector</Label>
        <Input id="company-industry" disabled={disabled} {...form.register("industry")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-timezone">Zona horaria</Label>
        <Select id="company-timezone" disabled={disabled} {...form.register("timezone")}>
          <option value="Europe/Madrid">Europe/Madrid</option>
          <option value="Atlantic/Canary">Atlantic/Canary</option>
          <option value="Europe/Lisbon">Europe/Lisbon</option>
        </Select>
      </div>
      <div className="flex items-end">
        <Button disabled={disabled || isPending} type="submit">
          <Save className="h-4 w-4" aria-hidden="true" />
          Guardar
        </Button>
      </div>
    </form>
  );
}
