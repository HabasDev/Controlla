import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Controlla",
    template: "%s | Controlla"
  },
  description: "SaaS para gestionar caducidades, revisiones, mantenimientos y obligaciones criticas de empresas."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
