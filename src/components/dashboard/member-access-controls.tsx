"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UserMinus, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { deactivateMemberAction, removeMemberAccessAction, updateMemberRoleAction } from "@/modules/members/actions";
import type { CompanyRole } from "@/types";

export function MemberAccessControls({
  companyId,
  userId,
  role,
  disabled
}: {
  companyId: string;
  userId: string;
  role: CompanyRole;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function refreshAfter(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        className="w-32"
        defaultValue={role}
        disabled={disabled || isPending || role === "owner"}
        onChange={(event) =>
          refreshAfter(() =>
            updateMemberRoleAction({
              companyId,
              userId,
              role: event.target.value as Exclude<CompanyRole, "owner">
            })
          )
        }
      >
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="member">Member</option>
        <option value="viewer">Viewer</option>
      </Select>
      <Button
        disabled={disabled || isPending || role === "owner"}
        onClick={() => refreshAfter(() => deactivateMemberAction({ companyId, userId }))}
        size="icon"
        title="Desactivar usuario"
        variant="outline"
      >
        <UserMinus className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        disabled={disabled || isPending || role === "owner"}
        onClick={() => refreshAfter(() => removeMemberAccessAction({ companyId, userId }))}
        size="icon"
        title="Eliminar acceso"
        variant="outline"
      >
        <UserX className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
