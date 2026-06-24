"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { FormResult } from "@/components/forms/form-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { invitationSchema, type InvitationInput } from "@/lib/validations/member";
import { inviteMemberAction } from "@/modules/members/actions";

export function InviteMemberForm({ companyId, disabled }: { companyId: string; disabled?: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(disabled ? "Configura Supabase service role para invitar usuarios." : null);
  const [isOk, setIsOk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<InvitationInput>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      companyId,
      email: "",
      role: "member"
    }
  });

  return (
    <form
      className="grid gap-4 md:grid-cols-3"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          if (disabled) {
            return;
          }
          const result = await inviteMemberAction(values);
          setMessage(result.message ?? null);
          setIsOk(result.ok);
          if (result.ok) {
            form.reset();
            router.refresh();
          }
        })
      )}
    >
      <div className="md:col-span-3">
        <FormResult message={message} ok={isOk} />
      </div>
      <input type="hidden" {...form.register("companyId")} />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="invite-email">Email</Label>
        <Input disabled={disabled} id="invite-email" type="email" {...form.register("email")} />
        <p className="text-xs text-critical">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="invite-role">Rol</Label>
        <Select disabled={disabled} id="invite-role" {...form.register("role")}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
        </Select>
      </div>
      <div className="md:col-span-3">
        <Button disabled={disabled || isPending} type="submit">
          <Send className="h-4 w-4" aria-hidden="true" />
          Invitar usuario
        </Button>
      </div>
    </form>
  );
}
