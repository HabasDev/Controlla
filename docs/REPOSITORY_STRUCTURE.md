# Repository Structure

Estructura final relevante tras la reorganizacion segura del sprint.

```text
Controla/
|-- .github/workflows/ci.yml
|-- docs/
|-- public/images/
|-- src/
|   |-- app/                         # Rutas Next.js, layouts, route handlers
|   |-- components/
|   |   |-- layout/                  # AppShell, navegacion privada, command palette
|   |   |-- shared/                  # EmptyState, RuntimeWarnings, StatusBadge
|   |   `-- ui/                      # Button, Card, Input, Table, Tabs...
|   |-- features/
|   |   |-- assets/components/       # UI especifica de activos
|   |   |-- documents/components/    # UI especifica de documentos
|   |   |-- members/components/      # UI especifica de equipo
|   |   `-- obligations/components/  # UI especifica de obligaciones
|   |-- db/
|   |   |-- index.ts                 # Cliente runtime Drizzle para Next server
|   |   |-- check.ts                 # Check de conectividad DB para CLI
|   |   |-- schema/index.ts          # Schema, enums, relaciones Drizzle
|   |   |-- migrations/              # SQL, RLS, Storage policies
|   |   |-- queries/
|   |   `-- seed/
|   |-- lib/                         # Auth/session, permisos, env, fechas, email, storage, supabase
|   |-- modules/                     # Server actions/services por dominio
|   |-- server/
|   |   |-- db/script-client.ts      # Cliente DB para scripts Node
|   |   |-- env/load-env-files.ts    # Carga .env/.env.local para scripts
|   |   `-- supabase/script-admin.ts # Supabase Admin para scripts
|   |-- trigger/                     # Tareas programadas preparadas
|   `-- types/
|-- drizzle.config.ts
|-- middleware.ts
|-- package.json
|-- tailwind.config.ts
|-- tsconfig.json
`-- vitest.config.ts
```

## Rutas

Viven en `src/app`. No se movieron porque Next.js exige esa ubicacion.

- Landing: `src/app/(marketing)/page.tsx`
- Auth/onboarding: `src/app/(auth)`
- Dashboard privado: `src/app/dashboard`
- APIs: `src/app/api`

## Frontend visual

- Base UI: `src/components/ui`
- Layout global privado: `src/components/layout`
- Componentes compartidos: `src/components/shared`
- Componentes especificos de dominio: `src/features/*/components`

## Logica de servidor

- Server actions y services: `src/modules`
- Auth/session/empresa activa: `src/lib/auth/session.ts`
- Permisos: `src/lib/permissions/index.ts`
- Integraciones transversales: `src/lib/email`, `src/lib/storage`, `src/lib/supabase`

## Base de datos

- Cliente runtime Next: `src/db/index.ts`
- Cliente para scripts: `src/server/db/script-client.ts`
- Check CLI: `src/db/check.ts`
- Schema Drizzle: `src/db/schema/index.ts`
- Migraciones: `src/db/migrations`
- Seed: `src/db/seed/seed.ts`

## RLS

RLS esta en `src/db/migrations/0000_initial.sql`. No existe carpeta `supabase/` en el repo.

## Tests

Vitest busca `src/**/*.test.ts`. Los tests se mantienen junto al codigo.

## Integraciones

- Supabase: `src/lib/supabase` y `src/server/supabase`
- Stripe: `src/modules/billing/service.ts`, `src/app/api/stripe/webhook/route.ts`
- Resend: `src/lib/email`
- Trigger.dev: `src/trigger`
- Sentry: `instrumentation.ts`, `sentry.client.config.ts`, `sentry.server.config.ts`

## Archivos criticos

- `src/lib/auth/session.ts`
- `src/lib/permissions/index.ts`
- `src/db/schema/index.ts`
- `src/db/migrations/0000_initial.sql`
- `src/modules/obligations/actions.ts`
- `src/modules/documents/actions.ts`
- `src/lib/storage/documents.ts`
- `src/modules/members/actions.ts`
- `src/modules/dashboard/data.ts`
- `src/app/api/stripe/webhook/route.ts`

## No tocar sin cuidado

- Migraciones y RLS.
- `SUPABASE_SERVICE_ROLE_KEY` y clientes admin.
- Acciones que reciben `companyId`.
- Descarga firmada y borrado de documentos.
- Permisos de miembros/owner.
- Configuracion Drizzle apuntando a entornos remotos.
