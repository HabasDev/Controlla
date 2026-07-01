import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentCompany, getCurrentUser } from "@/lib/auth/session";
import { getMissingRuntimeWarnings, hasSupabaseConfig } from "@/lib/env";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const company = await getCurrentCompany(undefined, user);

  if (hasSupabaseConfig() && !user) {
    redirect("/login");
  }

  if (hasSupabaseConfig() && user && !company) {
    redirect("/onboarding");
  }

  return (
    <AppShell companyName={company?.name} user={user} warnings={getMissingRuntimeWarnings()}>
      {children}
    </AppShell>
  );
}
