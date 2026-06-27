# Changes Made

Fecha: 2026-06-26

## Reorganizacion segura

Se movieron componentes sin cambiar rutas publicas ni server actions:

| Antes | Despues | Motivo |
| --- | --- | --- |
| `src/components/dashboard/app-shell.tsx` | `src/components/layout/app-shell.tsx` | Layout privado global |
| `src/components/dashboard/app-navigation.tsx` | `src/components/layout/app-navigation.tsx` | Navegacion global |
| `src/components/dashboard/command-palette.tsx` | `src/components/layout/command-palette.tsx` | Acceso global |
| `src/components/dashboard/command-palette-data.ts` | `src/components/layout/command-palette-data.ts` | Datos del command palette |
| `src/components/dashboard/command-palette.test.ts` | `src/components/layout/command-palette.test.ts` | Test junto a logica |
| `src/components/dashboard/status-badge.tsx` | `src/components/shared/status-badge.tsx` | Estado reutilizable |
| `src/components/dashboard/obligation-board.tsx` | `src/features/obligations/components/obligation-board.tsx` | Componente de feature |
| `src/components/dashboard/obligation-actions.tsx` | `src/features/obligations/components/obligation-actions.tsx` | Componente de feature |
| `src/components/dashboard/assets-list.tsx` | `src/features/assets/components/assets-list.tsx` | Componente de feature |
| `src/components/dashboard/secure-download-button.tsx` | `src/features/documents/components/secure-download-button.tsx` | Componente de feature |
| `src/components/dashboard/delete-document-button.tsx` | `src/features/documents/components/delete-document-button.tsx` | Componente de feature |
| `src/components/dashboard/member-access-controls.tsx` | `src/features/members/components/member-access-controls.tsx` | Componente de feature |

## Base de datos y entorno

- Se añadió `src/server/env/load-env-files.ts` para que scripts Node/Drizzle puedan cargar `.env` y `.env.local`.
- `appEnv` en `src/lib/env.ts` ahora lee `process.env` mediante getters para evitar valores congelados antes de cargar env.
- `drizzle.config.ts` carga `.env`/`.env.local` antes de leer `DATABASE_URL`.
- Se añadió `src/db/check.ts`.
- Se añadió script `npm run db:check`.
- Se añadieron clientes de script:
  - `src/server/db/script-client.ts`
  - `src/server/supabase/script-admin.ts`
- `src/db/seed/seed.ts` usa clientes de script para no importar modulos `server-only` fuera de Next.
- `/api/health` ahora incluye `checks.databaseReachable`.

## Documentacion creada

- `docs/REPOSITORY_REORGANIZATION_PLAN.md`
- `docs/REPOSITORY_STRUCTURE.md`
- `docs/DATABASE_SETUP_AUDIT.md`
- `docs/DATABASE_SETUP.md`
- `docs/RLS_AND_MULTI_TENANCY.md`
- `docs/LOCAL_DEVELOPMENT.md`
- `docs/MIGRATIONS_GUIDE.md`
- `docs/CHANGES_MADE.md`

## Comprobaciones ejecutadas

- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm run test`: correcto, 6 archivos y 19 tests.
- `npm run build`: correcto, build Next.js generado.
- `npm run db:check`: falla correctamente por falta de `DATABASE_URL`.
- `npm run db:migrate`: falla correctamente porque `DATABASE_URL` esta vacio.
- `npm run db:seed`: falla correctamente porque `DATABASE_URL` no esta configurado.
- `supabase status`: no disponible porque Supabase CLI no esta instalada.
- `curl http://127.0.0.1:3000/`, `/login`, `/dashboard`, `/api/health`: 200 en el dev server activo.

## Migracion generada descartada

Se ejecuto `npm run db:generate` y Drizzle genero una nueva migracion `0000_tough_whiplash.sql`
junto con `src/db/migrations/meta/`. Se descarto porque duplicaba `0000_initial.sql` y no conservaba
la migracion manual con RLS/Storage. El repo queda con una sola migracion real:

- `src/db/migrations/0000_initial.sql`

## No realizado

- No se aplicaron migraciones porque no hay `DATABASE_URL`.
- No se verifico Supabase local porque no estan instalados Supabase CLI ni Docker.
- No se crearon credenciales ni se conecto a produccion.
- No se movieron server actions a `features` para evitar una mudanza de alto ruido sin beneficio inmediato.
- No se hizo commit porque el worktree ya contenia cambios previos no relacionados con este sprint.
