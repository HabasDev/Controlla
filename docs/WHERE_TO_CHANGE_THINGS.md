# Where To Change Things

Guia practica para saber que archivos tocar segun el cambio que quieras hacer en Controlla.

## Cambios habituales

| Quiero hacer esto | Archivos que debo tocar | Tambien debo revisar | Riesgo |
| --- | --- | --- | --- |
| Cambiar el diseño global | `src/app/globals.css`, `tailwind.config.ts`, `src/components/ui/*` | `components.json`, pantallas principales en `src/app` | Medio |
| Cambiar la sidebar/topbar | `src/components/layout/app-shell.tsx`, `src/components/layout/app-navigation.tsx` | `src/app/dashboard/layout.tsx`, mobile bottom nav, command palette | Medio |
| Cambiar la command palette | `src/components/layout/command-palette.tsx`, `src/components/layout/command-palette-data.ts` | `src/components/layout/command-palette.test.ts`, rutas destino | Medio |
| Crear una pantalla publica nueva | `src/app/<ruta>/page.tsx` o grupo adecuado | `src/app/layout.tsx`, metadata, navegacion/CTA | Bajo |
| Crear una pantalla privada nueva | `src/app/dashboard/<ruta>/page.tsx` | `src/components/layout/app-navigation.tsx`, `src/app/dashboard/layout.tsx`, permisos/datos | Medio |
| Cambiar la landing | `src/app/(marketing)/page.tsx` | `src/app/layout.tsx`, `src/app/globals.css`, CTAs a login/registro | Bajo |
| Cambiar login/registro | `src/app/(auth)/*/page.tsx`, `src/components/forms/auth-forms.tsx` | `src/modules/auth/actions.ts`, `src/lib/supabase/server.ts` | Medio |
| Cambiar onboarding de empresa | `src/app/(auth)/onboarding/page.tsx`, `src/components/forms/company-form.tsx` | `src/modules/companies/actions.ts`, `src/lib/validations/company.ts` | Alto |
| Cambiar dashboard | `src/app/dashboard/page.tsx` | `src/modules/dashboard/data.ts`, `src/components/dashboard/metric-card.tsx`, fechas | Medio |
| Cambiar pagina de obligaciones | `src/app/dashboard/obligaciones/page.tsx`, `src/features/obligations/components/obligation-board.tsx` | `src/modules/dashboard/data.ts`, `src/components/forms/obligation-form.tsx` | Medio |
| Cambiar detalle de obligacion | `src/app/dashboard/obligaciones/[obligationId]/page.tsx` | `src/modules/dashboard/data.ts`, `src/features/obligations/components/obligation-actions.tsx` | Alto |
| Crear/editar obligacion | `src/components/forms/obligation-form.tsx`, `src/modules/obligations/actions.ts` | `src/lib/validations/obligation.ts`, `src/db/schema/index.ts`, RLS | Alto |
| Añadir un campo a obligaciones | `src/db/schema/index.ts`, nueva migracion, `src/lib/validations/obligation.ts`, `src/components/forms/obligation-form.tsx`, listados/detalle | `src/db/migrations/0000_initial.sql` como referencia, tests, dashboard, RLS | Critico |
| Cambiar acciones de obligacion | `src/features/obligations/components/obligation-actions.tsx`, `src/modules/obligations/actions.ts` | `src/lib/auth/session.ts`, `src/modules/audit-log/service.ts`, tests | Alto |
| Cambiar activos | `src/app/dashboard/activos/page.tsx`, `src/features/assets/components/assets-list.tsx`, `src/components/forms/asset-form.tsx` | `src/modules/assets/actions.ts`, `src/lib/validations/asset.ts` | Medio |
| Añadir campo a activos | `src/db/schema/index.ts`, migracion nueva, `src/lib/validations/asset.ts`, `src/components/forms/asset-form.tsx`, `src/features/assets/components/assets-list.tsx` | RLS, `src/modules/assets/actions.ts`, detalle de activo | Critico |
| Cambiar documentos | `src/app/dashboard/documentos/page.tsx`, `src/components/forms/document-upload-form.tsx` | `src/modules/documents/actions.ts`, `src/lib/storage/documents.ts`, `src/lib/validations/document.ts` | Alto |
| Cambiar descarga firmada | `src/app/api/documents/[documentId]/signed-url/route.ts`, `src/lib/storage/documents.ts` | `src/modules/documents/actions.ts`, RLS/Storage policies | Critico |
| Cambiar borrado de documentos | `src/features/documents/components/delete-document-button.tsx`, `src/modules/documents/actions.ts`, `src/lib/storage/documents.ts` | `src/db/schema/index.ts`, activity logs | Alto |
| Cambiar equipo/roles | `src/app/dashboard/equipo/page.tsx`, `src/components/forms/invite-member-form.tsx`, `src/features/members/components/member-access-controls.tsx` | `src/modules/members/actions.ts`, `src/lib/validations/member.ts`, RLS | Critico |
| Cambiar permisos | `src/lib/permissions/index.ts`, `src/lib/auth/session.ts` | `src/db/migrations/0000_initial.sql`, `src/lib/permissions/index.test.ts`, server actions | Critico |
| Cambiar empresa activa/sesion | `src/lib/auth/session.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `middleware.ts` | `src/app/dashboard/layout.tsx`, cookies, RLS | Critico |
| Cambiar Supabase Auth | `src/modules/auth/actions.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/browser.ts`, `src/lib/supabase/admin.ts` | `.env.example`, `src/lib/env.ts`, middleware | Alto |
| Cambiar base de datos | `src/db/schema/index.ts`, `src/db/migrations/*`, `drizzle.config.ts` | todos los `src/modules/*`, validaciones, RLS, tests | Critico |
| Añadir una tabla nueva | `src/db/schema/index.ts`, migracion nueva, RLS en SQL, services/actions, validaciones | `src/lib/auth/session.ts`, `src/types/index.ts`, tests | Critico |
| Cambiar RLS | `src/db/migrations/0000_initial.sql` o nueva migracion | `src/lib/auth/session.ts`, `src/lib/permissions/index.ts`, acciones, tests multiempresa | Critico |
| Cambiar Storage | `src/db/migrations/0000_initial.sql`, `src/lib/storage/documents.ts`, `src/lib/validations/document.ts` | Supabase bucket `company-documents`, signed-url API | Critico |
| Añadir un email | `src/lib/email/templates.ts`, `src/lib/email/client.ts` | `src/trigger/*`, `.env.example`, `src/lib/env.ts` | Medio |
| Cambiar recordatorios | `src/modules/reminders/service.ts`, `src/modules/notifications/service.ts`, `src/trigger/check-expirations.ts`, `src/trigger/send-reminders.ts` | fechas, emails, idempotencia, tests | Alto |
| Cambiar Stripe | `src/modules/billing/service.ts`, `src/app/api/stripe/webhook/route.ts`, `src/app/dashboard/facturacion/page.tsx` | `.env.example`, tabla `subscriptions`, pruebas webhook | Critico |
| Cambiar Resend | `src/lib/email/client.ts`, `src/lib/email/templates.ts` | `.env.example`, Trigger tasks | Medio |
| Cambiar Sentry | `instrumentation.ts`, `sentry.client.config.ts`, `sentry.server.config.ts` | `.env.example`, Next runtime | Medio |
| Cambiar variables de entorno | `.env.example`, `src/lib/env.ts` | README, Vercel, CI, runtime warnings | Alto |
| Cambiar CI | `.github/workflows/ci.yml` | `package.json`, `.nvmrc`, scripts locales | Medio |
| Cambiar tests | `*.test.ts`, `vitest.config.ts` | Codigo bajo prueba, aliases `@/*` | Medio |
| Cambiar seed demo | `src/db/seed/seed.ts` | `src/db/schema/index.ts`, Supabase Admin, RLS | Alto |

## Si quiero cambiar solo el diseño

Empieza por:

1. `src/app/globals.css`: tokens CSS, fondos, focus, utilidades visuales.
2. `tailwind.config.ts`: colores/tokens Tailwind, sombras, animaciones.
3. `src/components/ui/*`: botones, cards, badges, inputs, tablas.
4. `src/components/layout/app-shell.tsx`: estructura privada.
5. Pantalla concreta en `src/app/.../page.tsx`.

No toques para diseño:

- `src/db/*`
- `src/modules/*/actions.ts`
- `src/lib/auth/session.ts`
- `src/lib/permissions/index.ts`
- `src/db/migrations/*`

Si un cambio visual necesita datos nuevos, primero define si son datos reales. No inventes KPIs en una pantalla productiva.

## Si quiero añadir una funcionalidad nueva

Orden recomendado en este repositorio:

1. Define la pantalla o flujo en `src/app`.
2. Revisa si ya hay datos en `src/modules/dashboard/data.ts` o si necesitas un service/action nuevo.
3. Si hay entrada de usuario, crea o amplia validacion en `src/lib/validations`.
4. Si escribe datos, implementa server action en `src/modules/<dominio>/actions.ts`.
5. Antes de escribir, llama a `requirePermission()` o helper equivalente en `src/lib/auth/session.ts`.
6. Si necesita DB nueva, cambia `src/db/schema/index.ts`, genera migracion y anade RLS.
7. Conecta formulario/componente en `src/components/forms`, `src/components/layout` o `src/features/<dominio>/components`.
8. Anade tests cuando haya logica de permisos, fechas, validaciones o derivaciones.
9. Ejecuta `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.

## Si me sale un error de permisos

Mira en este orden:

1. `src/lib/auth/session.ts`: `getCurrentUser`, `getCurrentCompany`, `requireCompanyMembership`, `requirePermission`.
2. `src/lib/permissions/index.ts`: matriz de permisos por rol.
3. Server action afectada en `src/modules/*/actions.ts`.
4. `src/db/migrations/0000_initial.sql`: RLS de la tabla afectada.
5. `src/db/schema/index.ts`: si el recurso tiene `company_id` y relaciones correctas.
6. Cookie `controla_company_id` si el problema es empresa activa.

## Si no se guardan datos

Mira en este orden:

1. `.env.local`: `DATABASE_URL`, Supabase URL/anon key.
2. `src/lib/env.ts`: avisos de runtime.
3. `src/db/index.ts`: `getDb()` devuelve `null` si falta `DATABASE_URL`.
4. Formulario en `src/components/forms/*`.
5. Server action en `src/modules/*/actions.ts`.
6. Validacion Zod en `src/lib/validations/*`.
7. Permisos en `src/lib/auth/session.ts`.
8. RLS en `src/db/migrations/0000_initial.sql`.

## Si no se suben documentos

Mira en este orden:

1. `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`.
2. `src/components/forms/document-upload-form.tsx`: input de archivo y metadatos.
3. `src/modules/documents/actions.ts`: validacion de empresa, activo, obligacion y escritura DB.
4. `src/lib/validations/document.ts`: MIME, extension, tamaño y metadata.
5. `src/lib/storage/documents.ts`: subida, path y bucket.
6. `src/db/migrations/0000_initial.sql`: bucket `company-documents` y Storage policies.
7. Supabase dashboard: bucket privado existe y no es publico.

## Si una empresa ve datos de otra

Revisar urgentemente:

1. `src/db/migrations/0000_initial.sql`: politicas RLS de la tabla afectada.
2. `src/lib/auth/session.ts`: seleccion de empresa activa y membership.
3. `src/modules/dashboard/data.ts`: queries deben filtrar por `company.companyId`.
4. Server action concreta en `src/modules/*/actions.ts`: debe verificar `companyId`.
5. `src/db/schema/index.ts`: tabla debe tener `companyId` si es dato de negocio.
6. `src/lib/permissions/index.ts`: permisos por rol.
7. Tests de permisos en `src/lib/permissions/index.test.ts`; faltan pruebas de integracion Supabase/RLS real.

Esto es riesgo critico. No lo soluciones solo ocultando datos en UI.

## Si el build falla

Ejecuta:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Si falla:

- Server/client boundary: revisa componentes `"use client"` y no pases funciones/componentes desde server a client.
- Rutas dinamicas: revisa `params` en App Router, especialmente archivos bajo `[id]`.
- Imports `server-only`: no los importes desde client components.
- Env/config: revisa `src/lib/env.ts`, `.env.example`, `next.config.mjs`.
- Tipos de rutas: `npm run typecheck` ya ejecuta `next typegen`.
- Build de paginas privadas: revisa `src/app/dashboard/*` y `src/modules/dashboard/data.ts`.

## Si falla CI

Mira `.github/workflows/ci.yml`.

CI ejecuta:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Reproduce localmente el comando exacto que fallo antes de cambiar la CI.

## Si quiero cambiar pagos

Toca:

- `src/app/dashboard/facturacion/page.tsx`
- `src/modules/billing/service.ts`
- `src/app/api/stripe/webhook/route.ts`
- `src/db/schema/index.ts` si cambian campos de subscription
- `.env.example`

Tambien revisa productos/precios reales en Stripe. Preparado pero no operativo para checkout/portal reales.

## Si quiero cambiar emails o notificaciones

Toca:

- `src/lib/email/client.ts`
- `src/lib/email/templates.ts`
- `src/modules/notifications/service.ts`
- `src/modules/reminders/service.ts`
- `src/trigger/send-reminders.ts`
- `src/trigger/monthly-report.ts`

Tambien revisa `RESEND_API_KEY`, `EMAIL_FROM` y resolucion de emails via Supabase Admin.

## Si quiero cambiar datos demo

Hay dos fuentes distintas:

- `src/modules/demo/data.ts`: datos demo locales cuando no hay DB o empresa activa.
- `src/db/seed/seed.ts`: datos reales creados en DB/Supabase con `npm run db:seed`.

No confundas demo local con seed real.
