import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RuntimeWarnings({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <Alert className="border-cyan-300/25 bg-cyan-300/[0.055] text-slate-200 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
      <AlertTitle>Entorno en modo preparacion</AlertTitle>
      <AlertDescription className="text-slate-400">{warnings.join(" ")}</AlertDescription>
    </Alert>
  );
}
