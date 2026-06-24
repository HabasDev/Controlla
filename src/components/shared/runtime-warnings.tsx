import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RuntimeWarnings({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <Alert className="border-warning/30 bg-warning/10">
      <AlertTitle>Entorno en modo preparacion</AlertTitle>
      <AlertDescription>{warnings.join(" ")}</AlertDescription>
    </Alert>
  );
}
