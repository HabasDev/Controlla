# Controla

Controla es la base de un SaaS multiempresa para que pymes no olviden fechas criticas: ITV, seguros, extintores, revisiones, licencias, contratos, certificados, dominios, SSL, mantenimientos y documentacion asociada.

El objetivo del producto es evitar vencimientos olvidados mediante obligaciones, activos, documentos privados, responsables, recordatorios, notificaciones y reportes.

## Stack

- Next.js App Router con TypeScript estricto.
- Tailwind CSS y componentes estilo shadcn/ui.
- Supabase Auth, PostgreSQL y Storage.
- Drizzle ORM para esquema, migraciones, consultas y seed.
- Zod y React Hook Form para validacion.
- Trigger.dev preparado para tareas programadas.
- Resend preparado para emails transaccionales.
- Stripe preparado para suscripciones.
- Sentry opcional.
- Vercel como destino de despliegue.

## Requisitos Previos

- Node.js 20 o superior.
- npm, pnpm o yarn.
- Proyecto Supabase.
- Base PostgreSQL compatible con Supabase.

## Instalacion

```bash
npm install
cp .env.example .env.local
npm run dev
```

La app arranca sin Stripe, Resend, Trigger.dev o Sentry. Si faltan Supabase o `DATABASE_URL`, el panel muestra datos demo y las acciones de escritura quedan desactivadas o devuelven avisos claros.

## Variables De Entorno

Obligatorias para autenticacion y base real:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`

Necesarias para operaciones administrativas:

- `SUPABASE_SERVICE_ROLE_KEY`

Opcionales en desarrollo:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `TRIGGER_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_APP_URL`

No guardes secretos reales en el repositorio.

## Supabase

1. Crea un proyecto en Supabase.
2. Copia la URL del proyecto y la anon key.
3. Copia la service role key solo para servidor.
4. Copia la URL de conexion PostgreSQL en `DATABASE_URL`.
5. Ejecuta las migraciones.

```bash
npm run db:migrate
```

La migracion inicial crea:

- Tablas de negocio.
- Enums.
- Indices.
- Triggers de `updated_at`.
- Funciones de pertenencia y rol.
- Politicas RLS.
- Bucket privado `company-documents`.
- Politicas de Supabase Storage.
- Tipos globales de obligacion.

## RLS Y Multiempresa

Todas las tablas de negocio incluyen `company_id`, salvo perfiles, entregas de notificacion y tablas auxiliares que se protegen mediante relacion.

Reglas aplicadas:

- Un usuario solo lee empresas donde es miembro activo.
- Crear o modificar exige rol suficiente.
- Los miembros pueden ver datos de su empresa, pero no de otras.
- Los documentos se guardan en rutas `companies/{company_id}/documents/{document_id}/{filename}`.
- Storage no expone URLs publicas permanentes.
- Las descargas usan URLs firmadas.

En servidor, las acciones vuelven a validar empresa y rol con:

- `getCurrentUser()`
- `getCurrentCompany()`
- `requireCompanyMembership()`
- `requireCompanyRole()`
- `requirePermission()`

## Storage

La migracion crea el bucket privado `company-documents` con MIME types permitidos:

- PDF
- JPG/JPEG
- PNG
- DOCX

La abstraccion esta en `src/lib/storage/documents.ts`:

- `uploadDocument()`
- `getSignedDocumentUrl()`
- `deleteDocument()`

## Seed Local

El seed crea datos demo reales usando Supabase Admin:

- Empresa `Taller Garcia`.
- Propietario y dos usuarios adicionales.
- Sede principal.
- Activos demo.
- Obligaciones demo.
- Documentos demo.
- Notificacion demo.

No incluye contrasenas reales. Las contrasenas de usuarios demo se generan aleatoriamente y no se almacenan.

```bash
npm run db:seed
```

## Trigger.dev

Las tareas estan preparadas en `src/trigger`:

- `check-expirations.ts`: revisa obligaciones activas y crea notificaciones sin duplicados.
- `send-reminders.ts`: envia emails pendientes con Resend y marca entregas.
- `monthly-report.ts`: resume obligaciones y documentos por empresa.

Para activarlas en Trigger.dev, registra cada funcion con el SDK/runtime elegido y usa los cron incluidos en cada archivo.

## Resend

Configura:

```env
RESEND_API_KEY=
EMAIL_FROM="Controla <notificaciones@tu-dominio.com>"
```

Las plantillas estan en `src/lib/email/templates.ts`.

Si falta `RESEND_API_KEY`, el envio se desactiva de forma controlada.

## Stripe

La tabla `subscriptions` y el webhook `/api/stripe/webhook` estan preparados. La pantalla de facturacion muestra plan, limites y estado, pero no activa pagos reales hasta configurar:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Ejecutar En Local

```bash
npm run dev
```

Abre `http://localhost:3000`.

Comandos utiles:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run typecheck` genera primero los tipos de rutas de Next con `next typegen` y despues ejecuta TypeScript.

## Despliegue En Vercel

1. Importa el repositorio en Vercel.
2. Configura variables de entorno.
3. Asegura que Supabase permite el dominio de produccion.
4. Ejecuta migraciones contra la base de produccion.
5. Configura el webhook de Stripe apuntando a `/api/stripe/webhook`.
6. Configura tareas programadas en Trigger.dev.

## CI

El repositorio incluye `.github/workflows/ci.yml` y ejecuta en `push` y `pull_request`:

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

## Estructura

```text
src/
  app/
    (marketing)/
    (auth)/
    dashboard/
    admin/
    api/
  components/
    ui/
    dashboard/
    forms/
    shared/
  modules/
    auth/
    companies/
    members/
    locations/
    assets/
    obligation-types/
    obligations/
    documents/
    reminders/
    notifications/
    reports/
    billing/
    audit-log/
  db/
    schema/
    migrations/
    queries/
    seed/
  lib/
    auth/
    supabase/
    email/
    storage/
    validations/
    date/
    permissions/
    utils/
  trigger/
  types/
```

## Decisiones De Arquitectura

- Monolito modular en Next.js, sin microservicios.
- Drizzle centraliza esquema y consultas.
- Supabase RLS protege el dato aunque haya errores de UI.
- Las acciones de servidor nunca confian en `company_id` sin verificar membresia.
- Fechas de negocio se tratan como date-only para evitar errores por DST.
- Integraciones externas son opcionales hasta tener claves reales.
- Los botones que no pueden operar sin configuracion se desactivan con aviso.

## Limitaciones Actuales

- Pagos reales con Stripe no estan implementados.
- Trigger.dev queda preparado como funciones invocables, pendiente de registrar en el runtime final.
- El seed crea metadatos de documentos demo, pero no sube archivos PDF reales.
- Las invitaciones requieren `SUPABASE_SERVICE_ROLE_KEY`.
- Faltan pruebas de integracion contra una base Supabase real para validar RLS extremo a extremo.
- No incluye IA, OCR, WhatsApp, app movil ni integraciones ERP.

## Auditoria

La auditoria tecnica y de producto para beta privada esta en `docs/IMPLEMENTATION_AUDIT.md`.

## Proximos Pasos

- Conectar Trigger.dev con despliegue real.
- Completar portal de cliente de Stripe.
- Anadir pantalla avanzada de reglas de recordatorio por obligacion.
- Ampliar auditoria y reportes.
- Anadir pruebas de integracion con una base Supabase de test.
