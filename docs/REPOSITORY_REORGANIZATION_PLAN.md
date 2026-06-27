# Repository Reorganization Plan

Fecha: 2026-06-26

Este documento se crea antes de mover archivos, siguiendo el sprint de reorganizacion. El objetivo es ordenar sin romper rutas de Next.js, imports, permisos, RLS, documentos privados ni la base tecnica existente.

## Estado encontrado

- `src/app` contiene correctamente rutas de Next.js, layouts, paginas, route handlers, loading/error boundaries y estilos globales.
- `src/components/ui` contiene primitivas visuales reutilizables.
- `src/components/forms` agrupa formularios de varios dominios.
- `src/components/dashboard` mezcla tres tipos de componentes:
  - layout global privado (`app-shell`, navegacion, command palette);
  - componentes de obligaciones, activos, documentos y miembros;
  - componentes reutilizables de estado/pagina.
- `src/modules` ya esta organizado por dominio y contiene server actions/services. No es una amalgama grave.
- `src/lib` contiene infraestructura transversal: auth/session, permisos, Supabase, Storage, email, env, fechas y validaciones.
- `src/db` contiene conexion, schema Drizzle, migracion inicial, seed y query auxiliar.
- No existe carpeta raiz `drizzle/`; las migraciones estan en `src/db/migrations`.
- No existe carpeta raiz `supabase/`; RLS y Storage policies estan en `src/db/migrations/0000_initial.sql`.
- No existe carpeta raiz `tests/`; Vitest usa tests colocados junto al codigo (`src/**/*.test.ts`).
- Existen cambios visuales no confirmados en el worktree. No deben revertirse ni perderse.

## Problemas actuales de organizacion

- `src/components/dashboard` esta demasiado cargada: contiene layout global, componentes de feature y acciones cliente.
- Formularios de dominios distintos viven juntos en `src/components/forms`, lo que funciona pero obliga a saltar mentalmente entre `forms`, `modules` y `validations`.
- Las validaciones viven en `src/lib/validations` y las acciones en `src/modules`; es coherente, pero puede resultar menos intuitivo que una carpeta `features` por dominio.
- La configuracion de DB depende de `process.env`, pero Drizzle/tsx no cargan `.env` por si solos como Next.js. Esto dificulta `npm run db:migrate` y `npm run db:seed` en local si no se exportan variables.
- `/api/health` indica configuracion minima, pero no comprueba conectividad real de DB.
- Supabase local no esta inicializado en el repo y la CLI no esta disponible en el entorno actual.

## Archivos que deben quedarse donde estan por convencion

- `src/app/**/page.tsx`: rutas de Next.js.
- `src/app/**/layout.tsx`: layouts de Next.js.
- `src/app/**/loading.tsx`: loading boundaries.
- `src/app/**/error.tsx`: error boundaries.
- `src/app/**/route.ts`: API route handlers.
- `src/app/globals.css`: CSS global requerido por el layout raiz.
- `src/app/not-found.tsx`: 404 global.
- `middleware.ts`: middleware raiz de Next.js.
- `next.config.mjs`, `tsconfig*.json`, `tailwind.config.ts`, `postcss.config.mjs`: config raiz.
- `instrumentation.ts`, `sentry.*.config.ts`: convenciones de Next/Sentry.

## Archivos que pueden moverse con bajo riesgo

| Archivo actual | Destino propuesto | Motivo | Riesgo |
| --- | --- | --- | --- |
| `src/components/dashboard/app-shell.tsx` | `src/components/layout/app-shell.tsx` | Shell privado es layout, no feature dashboard | Medio |
| `src/components/dashboard/app-navigation.tsx` | `src/components/layout/app-navigation.tsx` | Navegacion global privada | Medio |
| `src/components/dashboard/command-palette.tsx` | `src/components/layout/command-palette.tsx` | Acceso global del shell | Medio |
| `src/components/dashboard/command-palette-data.ts` | `src/components/layout/command-palette-data.ts` | Datos del comando global | Bajo |
| `src/components/dashboard/command-palette.test.ts` | `src/components/layout/command-palette.test.ts` | Test junto a la logica movida | Bajo |
| `src/components/dashboard/status-badge.tsx` | `src/components/shared/status-badge.tsx` | Badge de estado reutilizable | Bajo |
| `src/components/dashboard/obligation-board.tsx` | `src/features/obligations/components/obligation-board.tsx` | Componente exclusivo de obligaciones | Medio |
| `src/components/dashboard/obligation-actions.tsx` | `src/features/obligations/components/obligation-actions.tsx` | Acciones cliente exclusivas de obligaciones | Medio |
| `src/components/dashboard/assets-list.tsx` | `src/features/assets/components/assets-list.tsx` | Componente exclusivo de activos | Medio |
| `src/components/dashboard/secure-download-button.tsx` | `src/features/documents/components/secure-download-button.tsx` | Accion cliente exclusiva de documentos | Medio |
| `src/components/dashboard/delete-document-button.tsx` | `src/features/documents/components/delete-document-button.tsx` | Accion cliente exclusiva de documentos | Medio |
| `src/components/dashboard/member-access-controls.tsx` | `src/features/members/components/member-access-controls.tsx` | Acciones cliente exclusivas de equipo | Medio |

## Archivos que no se moveran en esta fase

- `src/modules/*`: ya agrupa server actions y services por dominio. Moverlo ahora a `src/features/*/actions` tendria mucho ruido de imports y riesgo sin beneficio proporcional.
- `src/lib/validations/*`: se mantiene centralizado porque los formularios y acciones lo reutilizan y ya tiene tests.
- `src/db/schema/index.ts`: aunque es grande, separarlo por dominio ahora implicaria riesgo alto en migraciones/relations. Se documenta como candidato futuro.
- Tests existentes bajo `src/**/*.test.ts`: Vitest ya esta configurado asi. Solo se movera el test de command palette si se mueve su logica.
- `src/trigger/*`: las tareas ya estan agrupadas y localizables.

## Dependencias relevantes

- `src/app/dashboard/layout.tsx` importa `AppShell`.
- `AppShell` importa navegacion, command palette, runtime warnings, auth sign out y UI.
- Dashboard y detalle de obligacion importan `StatusBadge`.
- Paginas de obligaciones/activos/documentos/equipo importan componentes actualmente en `src/components/dashboard`.
- Los formularios importan schemas de `src/lib/validations` y actions de `src/modules`.
- Server actions importan permisos desde `src/lib/auth/session.ts`, DB desde `src/db`, schema desde `src/db/schema`, audit log y validaciones.
- Documentos conectan `src/components/forms/document-upload-form.tsx` -> `src/modules/documents/actions.ts` -> `src/lib/storage/documents.ts` -> Supabase Admin Storage.

## Plan de migracion de imports

1. Mover layout global privado a `src/components/layout`.
2. Mover `StatusBadge` a `src/components/shared`.
3. Mover componentes cliente exclusivos de feature a `src/features/<dominio>/components`.
4. Actualizar imports con busquedas `rg`.
5. Ejecutar `npm run typecheck`.
6. Ejecutar `npm run lint`.
7. Solo despues tocar flujo de DB/env.

## Nueva estructura propuesta para esta fase

```text
src/
|-- app/                         # Rutas Next.js, sin mover
|-- components/
|   |-- layout/                  # Shell, navegacion y command palette global
|   |-- shared/                  # Empty states, status badge, runtime warnings
|   `-- ui/                      # Primitivas UI
|-- features/
|   |-- assets/components/       # UI especifica de activos
|   |-- documents/components/    # UI especifica de documentos
|   |-- members/components/      # UI especifica de equipo
|   `-- obligations/components/  # UI especifica de obligaciones
|-- modules/                     # Server actions/services por dominio, se mantiene
|-- lib/                         # Infraestructura transversal, se mantiene
|-- db/                          # Drizzle, schema, migraciones, seed
|-- server/env/                  # Helpers server-only para cargar env en scripts
|-- trigger/                     # Tareas preparadas
`-- types/                       # Tipos compartidos
```

## Riesgos por movimiento

- Riesgo de importar componentes cliente desde server con props no serializables. Mitigacion: mantener iconos definidos dentro de client components cuando sea necesario.
- Riesgo de imports rotos por alias antiguos. Mitigacion: `rg` y `npm run typecheck`.
- Riesgo de mezclar `server-only` con client components. Mitigacion: no mover server actions a carpetas de componentes.
- Riesgo de perder cambios visuales pendientes. Mitigacion: mover archivos completos y no recrearlos manualmente.

## Base de datos: plan antes de cambios

- Mantener `src/db/schema/index.ts` en esta fase.
- Añadir carga segura de `.env` para scripts Node/Drizzle sin imprimir secretos.
- Añadir `npm run db:check` para comprobar conectividad real cuando exista `DATABASE_URL`.
- Mejorar `/api/health` para informar si la DB configurada responde, sin exponer URL ni stack traces.
- Documentar que Supabase CLI/Docker no estan disponibles en el entorno actual.
- No crear credenciales ni simular conexion.

## Checks obligatorios despues de cada bloque

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Para DB, si hay variables:

```bash
npm run db:check
npm run db:migrate
```

En el entorno actual no se puede ejecutar `supabase status` porque `supabase` no esta instalado.
