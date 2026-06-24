import { Alert, AlertDescription } from "@/components/ui/alert";

export function FormResult({ message, ok }: { message: string | null; ok?: boolean }) {
  if (!message) {
    return null;
  }

  return (
    <Alert className={ok ? "border-success/30 bg-success/10" : "border-critical/30 bg-critical/10"}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
