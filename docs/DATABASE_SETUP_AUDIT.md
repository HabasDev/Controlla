# Database Setup Audit

Fecha: 2026-06-26

## Estado encontrado

- Existe esquema Drizzle en `src/db/schema/index.ts`.
- Existe configuracion Drizzle en `drizzle.config.ts`.
- Existen migraciones en `src/db/migrations/0000_initial.sql`.
- RLS esta definido dentro de `src/db/migrations/0000_initial.sql`.
- Supabase Storage se define en la misma migracion con bucket privado `company-documents`.
- Existe cliente Supabase server/browser/admin en `src/lib/supabase`.
- Existe Supabase Auth integrado mediante `@supabase/ssr`.
- Existe seed en `src/db/seed/seed.ts`.
- Existe fallback demo en `src/modules/demo/data.ts` y `src/modules/dashboard/data.ts`.
- No existe carpeta `supabase/`.
- No existe `supabase/config.toml`.
- No existe Supabase CLI en PATH en este entorno.
- No existe Docker en PATH en este entorno.
- No existe `psql` en PATH en este entorno.
- `.env` existe pero las variables reales de Supabase/DB estan vacias.

## Que esta realmente conectado

Preparado en codigo:

- Next.js puede leer variables `.env` durante `npm run dev`.
- Drizzle usa `DATABASE_URL`.
- Supabase Auth usa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Operaciones admin/Storage usan `SUPABASE_SERVICE_ROLE_KEY`.
- Documentos usan Supabase Storage via service role.
- Stripe, Resend, Sentry y Trigger.dev estan preparados por variables.

Verificado en este entorno:

- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm run test`: correcto, 19 tests.
- `npm run build`: correcto.
- `npm run db:check`: ejecuta, pero falla de forma esperada porque `DATABASE_URL` no esta configurado.
- `npm run db:migrate`: falla de forma esperada porque `DATABASE_URL` esta vacio.
- `npm run db:seed`: falla de forma esperada porque `DATABASE_URL` no esta configurado.
- No se pudo verificar DB real porque faltan credenciales.
- No se pudo verificar Supabase local porque faltan Supabase CLI y Docker.
- Dev server activo verificado en `http://127.0.0.1:3000` con `/`, `/login`, `/dashboard` y `/api/health`.

## Que existe solo en codigo

- Facturacion real: preparado, falta checkout/portal y productos Stripe.
- Trigger.dev: tareas preparadas, falta registrar runtime/cron externo.
- Resend: cliente y plantillas preparados, falta API key/dominio.
- Supabase remoto: flujo preparado, faltan URL, anon key, service role y `DATABASE_URL`.

## Variables necesarias

| Variable | Uso | Cliente/Servidor | Estado actual |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Auth browser/server | Cliente | Vacia |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Auth browser/server | Cliente | Vacia |
| `DATABASE_URL` | Drizzle, migraciones, seed, runtime server | Servidor | Vacia |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin, Storage, invitaciones, seed | Servidor | Vacia |
| `NEXT_PUBLIC_APP_URL` | Links de emails/callbacks | Cliente | Configurada local |
| `RESEND_API_KEY` | Envio de emails | Servidor | Vacia |
| `EMAIL_FROM` | Remitente email | Servidor | Configurada local |
| `TRIGGER_SECRET_KEY` | Tareas programadas | Servidor | Vacia |
| `STRIPE_SECRET_KEY` | Stripe server | Servidor | Vacia |
| `STRIPE_WEBHOOK_SECRET` | Firma webhook Stripe | Servidor | Vacia |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client futuro | Cliente | Vacia |
| `SENTRY_DSN` | Sentry server | Servidor | Vacia |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry browser | Cliente | Vacia |

## Riesgos

- Ejecutar `npm run db:migrate` contra una base incorrecta aplicara tablas, RLS y Storage policies en ese entorno.
- `npm run db:seed` crea datos y usuarios demo reales; no debe ejecutarse contra produccion.
- Sin `DATABASE_URL`, la app muestra modo demo en desarrollo.
- Sin Supabase CLI/Docker no se puede validar RLS localmente.
- Sin dos usuarios/empresas reales no se puede demostrar aislamiento multiempresa extremo a extremo.

## Plan de activacion

1. Instalar Docker Desktop.
2. Instalar Supabase CLI.
3. Crear proyecto Supabase local o remoto de desarrollo.
4. Rellenar `.env.local` con URL/keys y `DATABASE_URL`.
5. Ejecutar `npm run db:check`.
6. Ejecutar `npm run db:migrate`.
7. Ejecutar `npm run db:seed` solo en local/staging.
8. Levantar `npm run dev`.
9. Probar login, empresa, activos, obligaciones y documentos.
10. Probar dos empresas con dos usuarios antes de beta.

## Comandos exactos

```bash
npm run db:check
npm run db:generate
npm run db:migrate
npm run db:seed
```

En esta auditoria, `npm run db:generate` produjo una migracion duplicada de la inicial porque la
migracion existente es manual y no habia metadata de Drizzle. Esa migracion generada se elimino para
evitar aplicar tablas duplicadas y perder RLS/Storage manual.

`supabase start` y `supabase status` no se verificaron porque la CLI no esta instalada en este entorno.
