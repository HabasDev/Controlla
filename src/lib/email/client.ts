import "server-only";

import { Resend } from "resend";

import { appEnv } from "@/lib/env";

let resend: Resend | null = null;

export type EmailSendResult =
  | {
      sent: true;
      providerMessageId: string | null;
    }
  | {
      sent: false;
      disabled: boolean;
      errorMessage: string;
    };

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<EmailSendResult> {
  if (!appEnv.resendApiKey) {
    return {
      sent: false,
      disabled: true,
      errorMessage: "RESEND_API_KEY no esta configurado."
    };
  }

  resend ??= new Resend(appEnv.resendApiKey);

  const result = await resend.emails.send({
    from: appEnv.emailFrom,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text
  });

  if (result.error) {
    return {
      sent: false,
      disabled: false,
      errorMessage: result.error.message
    };
  }

  return {
    sent: true,
    providerMessageId: result.data?.id ?? null
  };
}
