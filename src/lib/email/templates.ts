import { appEnv } from "@/lib/env";
import { formatDateEs } from "@/lib/date/obligations";

export function reminderEmailTemplate(input: {
  companyName: string;
  obligationTitle: string;
  dueDate: string;
  relativeDueDate: string;
}) {
  const subject = `Accion necesaria: ${input.obligationTitle} ${input.relativeDueDate.toLowerCase()}`;
  const dashboardUrl = `${appEnv.appUrl}/dashboard/obligaciones`;
  const text = `${input.companyName}: ${input.obligationTitle} ${input.relativeDueDate}. Fecha de vencimiento: ${formatDateEs(input.dueDate)}. Revisa el panel: ${dashboardUrl}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#172033">
      <h1 style="font-size:20px;margin:0 0 12px">Accion necesaria</h1>
      <p><strong>${input.obligationTitle}</strong> ${input.relativeDueDate.toLowerCase()}.</p>
      <p>Fecha de vencimiento: <strong>${formatDateEs(input.dueDate)}</strong></p>
      <p><a href="${dashboardUrl}" style="color:#17656b">Abrir panel de Controla</a></p>
    </div>
  `;

  return { subject, text, html };
}

export function monthlyReportEmailTemplate(input: {
  companyName: string;
  expired: number;
  upcoming: number;
  completed: number;
  expiringDocuments: number;
}) {
  const subject = "Resumen mensual de obligaciones - Controla";
  const dashboardUrl = `${appEnv.appUrl}/dashboard`;
  const text = `${input.companyName}: ${input.expired} vencidas, ${input.upcoming} proximas, ${input.completed} completadas y ${input.expiringDocuments} documentos con caducidad proxima. Panel: ${dashboardUrl}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#172033">
      <h1 style="font-size:20px;margin:0 0 12px">Resumen mensual de obligaciones</h1>
      <p>${input.companyName}</p>
      <ul>
        <li>${input.expired} obligaciones vencidas</li>
        <li>${input.upcoming} obligaciones proximas a vencer</li>
        <li>${input.completed} obligaciones completadas</li>
        <li>${input.expiringDocuments} documentos con caducidad proxima</li>
      </ul>
      <p><a href="${dashboardUrl}" style="color:#17656b">Abrir panel de Controla</a></p>
    </div>
  `;

  return { subject, text, html };
}
