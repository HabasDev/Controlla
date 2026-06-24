import { redirect } from "next/navigation";

import { AppShell } from "@/components/dashboard/app-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { getMissingRuntimeWarnings, hasSupabaseConfig } from "@/lib/env";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (hasSupabaseConfig() && !user) {
    redirect("/login");
  }

  return (
    <AppShell user={user} warnings={getMissingRuntimeWarnings()}>
      {children}
    </AppShell>
  );
}
