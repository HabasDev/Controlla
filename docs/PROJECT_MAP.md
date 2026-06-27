# Project Map

Mapa practico del repositorio de Controlla. Esta guia describe donde vive cada pieza real del proyecto y que mirar antes de tocarla.

## Arbol simplificado

```text
Controla/
|-- .github/
|   `-- workflows/
|       `-- ci.yml                         # CI: typecheck, lint, tests y build
|-- docs/
|   `-- IMPLEMENTATION_AUDIT.md            # Auditoria tecnica existente
|-- public/
|   `-- images/
|       `-- controla-hero.png              # Imagen publica usada por marketing anterior
|-- src/
|   |-- app/                               # Rutas, layouts, paginas y APIs de Next.js
|   |   |-- (marketing)/page.tsx           # Landing publica
|   |   |-- (auth)/                        # Login, registro, password y onboarding
|   |   |-- admin/page.tsx                 # Placeholder admin
|   |   |-- api/                           # API routes: health, Stripe, signed URLs
|   |   |-- dashboard/                     # App privada: panel, activos, obligaciones, docs...
|   |   |-- globals.css                    # Tokens CSS, estilos globales y utilidades visuales
|   |   `-- layout.tsx                     # Layout raiz y metadata global
|   |-- components/
|   |   |-- layout/                        # App shell, navegacion privada y command palette
|   |   |-- forms/                         # Formularios React Hook Form + Zod
|   |   |-- shared/                        # Estados compartidos y avisos runtime
|   |   `-- ui/                            # Primitivas UI reutilizables
|   |-- features/
|   |   |-- assets/components/             # Componentes especificos de activos
|   |   |-- documents/components/          # Componentes especificos de documentos
|   |   |-- members/components/            # Componentes especificos de equipo
|   |   `-- obligations/components/        # Componentes especificos de obligaciones
|   |-- db/
|   |   |-- index.ts                       # Conexion Drizzle/Postgres
|   |   |-- schema/index.ts                # Tablas, enums, relaciones y tipos Drizzle
|   |   |-- migrations/0000_initial.sql    # Migracion inicial, RLS y Storage policies
|   |   |-- queries/company-scope.ts       # Helper de pertenencia a empresa
|   |   `-- seed/seed.ts                   # Seed demo real con Supabase Admin
|   |-- lib/
|   |   |-- auth/session.ts                # Usuario actual, empresa activa, permisos por sesion
|   |   |-- date/obligations.ts            # Fechas, estados y recurrencias de obligaciones
|   |   |-- email/                         # Resend y plantillas
|   |   |-- env.ts                         # Variables de entorno y avisos de runtime
|   |   |-- permissions/                   # Matriz rol/permiso
|   |   |-- storage/documents.ts           # Supabase Storage para documentos privados
|   |   |-- supabase/                      # Clientes Supabase browser/server/admin/middleware
|   |   |-- validations/                   # Esquemas Zod
|   |   `-- utils/cn.ts                    # Merge de clases Tailwind
|   |-- modules/
|   |   |-- auth/actions.ts                # Server actions de login, registro, reset, logout
|   |   |-- assets/actions.ts              # Crear activos
|   |   |-- companies/actions.ts           # Crear/editar empresa
|   |   |-- dashboard/data.ts              # Queries para pantallas privadas y modo demo
|   |   |-- documents/actions.ts           # Subir/borrar documentos
|   |   |-- members/actions.ts             # Invitar, roles y acceso de equipo
|   |   |-- obligations/actions.ts         # Crear, editar, completar, renovar, cancelar, duplicar
|   |   |-- notifications/service.ts       # Crea notificaciones por vencimiento
|   |   |-- reminders/service.ts           # Reglas por defecto e idempotencia de avisos
|   |   |-- billing/service.ts             # Stripe client y limites de plan
|   |   |-- audit-log/service.ts           # Activity logs
|   |   `-- reports/service.ts             # Resumen de estados para reportes
|   |-- trigger/
|   |   |-- check-expirations.ts           # Tarea preparada para revisar vencimientos
|   |   |-- send-reminders.ts              # Tarea preparada para enviar emails pendientes
|   |   `-- monthly-report.ts              # Tarea preparada para resumen mensual
|   `-- types/index.ts                     # Enums/tipos compartidos y ActionResult
|-- .env.example                           # Variables requeridas/opcionales
|-- drizzle.config.ts                      # Configuracion Drizzle Kit
|-- instrumentation.ts                     # Registro condicional de Sentry server
|-- middleware.ts                          # Refresco de sesion Supabase
|-- next.config.mjs                        # Typed routes e imagenes
|-- package.json                           # Scripts, dependencias y engines
|-- tailwind.config.ts                     # Tokens Tailwind
|-- tsconfig*.json                         # TypeScript estricto y typecheck
`-- vitest.config.ts                       # Configuracion de tests
```

No existe carpeta raiz `drizzle/`: las migraciones estan en `src/db/migrations`. No existe carpeta `supabase/`: SQL, RLS y Storage policies estan en `src/db/migrations/0000_initial.sql`.

## `src/app`

**Para que sirve:**  
Contiene rutas, pantallas, layouts, estados de carga/error y API routes de Next.js App Router.

**Aqui encontraras:**  
- `page.tsx`: pantalla de una ruta.
- `layout.tsx`: estructura compartida de un grupo de rutas.
- `loading.tsx`: estado de carga.
- `error.tsx`: error boundary de dashboard.
- `route.ts`: endpoint HTTP.

**Cuando tocarla:**  
Cuando quieras cambiar una pantalla, crear una ruta, modificar metadata, exponer una API o ajustar la estructura visual de una seccion.

**No tocar aqui para:**  
Validaciones compartidas, permisos, queries reutilizables, subida de Storage o reglas de negocio complejas. Eso vive en `src/lib`, `src/modules` y `src/db`.

**Archivos relacionados:**  
`src/components`, `src/modules/dashboard/data.ts`, `src/lib/auth/session.ts`, `src/app/globals.css`.

## `src/app/(marketing)`

**Para que sirve:**  
Landing publica de Controlla.

**Aqui encontraras:**  
- `page.tsx`: hero, secciones comerciales, CTAs a registro/login.

**Cuando tocarla:**  
Para cambiar mensajes de venta, visual de la home publica, CTAs o posicionamiento.

**No tocar aqui para:**  
Cambiar login, registro, pagos reales, datos del dashboard o permisos.

**Archivos relacionados:**  
`src/app/layout.tsx`, `src/app/globals.css`, `src/components/ui/*`, `tailwind.config.ts`.

## `src/app/(auth)`

**Para que sirve:**  
Pantallas publicas de autenticacion y onboarding inicial.

**Aqui encontraras:**  
- `layout.tsx`: layout visual comun de auth.
- `login/page.tsx`, `register/page.tsx`, `forgot-password/page.tsx`.
- `onboarding/page.tsx`: creacion de empresa inicial.

**Cuando tocarla:**  
Para cambiar textos/formato de login, registro, password reset u onboarding.

**No tocar aqui para:**  
Cambiar la logica de Supabase Auth o la creacion real de perfiles/empresas.

**Archivos relacionados:**  
`src/components/forms/auth-forms.tsx`, `src/components/forms/company-form.tsx`, `src/modules/auth/actions.ts`, `src/modules/companies/actions.ts`.

## `src/app/dashboard`

**Para que sirve:**  
Aplicacion privada: panel, obligaciones, activos, documentos, equipo, configuracion y facturacion.

**Aqui encontraras:**  
- `layout.tsx`: obtiene usuario/empresa y monta `AppShell`.
- `page.tsx`: dashboard principal.
- Subrutas `obligaciones`, `activos`, `documentos`, `equipo`, `configuracion`, `facturacion`.
- `loading.tsx` y `error.tsx`.

**Cuando tocarla:**  
Para cambiar pantallas privadas, crear nuevas secciones de producto o ajustar loading/error.

**No tocar aqui para:**  
Relajar permisos, cambiar RLS o escribir SQL complejo inline.

**Archivos relacionados:**  
`src/components/layout/*`, `src/features/*/components`, `src/modules/dashboard/data.ts`, `src/modules/*/actions.ts`, `src/lib/auth/session.ts`.

## `src/app/api`

**Para que sirve:**  
Endpoints HTTP del proyecto.

**Aqui encontraras:**  
- `health/route.ts`: estado de configuracion.
- `stripe/webhook/route.ts`: webhook de Stripe.
- `documents/[documentId]/signed-url/route.ts`: URL firmada para descargar documento.

**Cuando tocarla:**  
Para crear endpoints server-side o integrar webhooks externos.

**No tocar aqui para:**  
Logica de UI o acciones de formularios que pueden ser server actions.

**Archivos relacionados:**  
`src/lib/env.ts`, `src/lib/storage/documents.ts`, `src/modules/billing/service.ts`, `src/db/schema/index.ts`.

## `src/components/layout`

**Para que sirve:**  
Componentes de estructura global de la app privada.

**Aqui encontraras:**  
`AppShell`, navegacion privada y command palette.

**Cuando tocarla:**  
Para cambiar navegacion, sidebar, topbar o busqueda global.

**No tocar aqui para:**  
Cambiar la seguridad real de una accion. La autorizacion debe permanecer en `src/modules` y `src/lib/auth/session.ts`.

**Archivos relacionados:**  
`src/app/dashboard/layout.tsx`, `src/modules/*/actions.ts`, `src/components/ui/*`.

## `src/features`

**Para que sirve:**  
Componentes especificos de cada dominio que no son primitivos UI ni layout global.

**Aqui encontraras:**  
Componentes de activos, documentos, miembros y obligaciones.

**Cuando tocarla:**  
Para cambiar UI de una feature concreta sin mezclarla con el shell.

**No tocar aqui para:**  
Server actions, RLS, DB o permisos. Eso sigue en `src/modules`, `src/db` y `src/lib`.

**Archivos relacionados:**  
`src/app/dashboard/*`, `src/modules/*`, `src/components/forms`.

## `src/components/forms`

**Para que sirve:**  
Formularios cliente con React Hook Form y Zod.

**Aqui encontraras:**  
Formularios de auth, empresa, activo, obligacion, documento e invitacion de miembros.

**Cuando tocarla:**  
Para cambiar campos, labels, ayuda contextual, estados pending o layout del formulario.

**No tocar aqui para:**  
Confiar en validacion solo cliente. Toda entrada relevante se revalida en server actions.

**Archivos relacionados:**  
`src/lib/validations/*`, `src/modules/*/actions.ts`, `src/components/forms/form-result.tsx`.

## `src/components/ui`

**Para que sirve:**  
Primitivas visuales reutilizables: botones, cards, inputs, tablas, tabs, alertas.

**Aqui encontraras:**  
Componentes pequeños sin logica de negocio.

**Cuando tocarla:**  
Para cambiar look and feel global de UI.

**No tocar aqui para:**  
Logica de permisos, datos o rutas.

**Archivos relacionados:**  
`src/app/globals.css`, `tailwind.config.ts`, `components.json`.

## `src/db`

**Para que sirve:**  
Conexion a PostgreSQL, esquema Drizzle, migraciones, queries auxiliares y seed.

**Aqui encontraras:**  
- `index.ts`: `getDb()` y `requireDb()`.
- `schema/index.ts`: tablas, enums, relaciones.
- `migrations/0000_initial.sql`: SQL inicial, funciones, RLS, Storage.
- `queries/company-scope.ts`: pertenencia activa.
- `seed/seed.ts`: datos demo reales.

**Cuando tocarla:**  
Para cambiar modelo de datos, migraciones, indices, RLS, seed o conexion.

**No tocar aqui para:**  
Cambios puramente visuales o copy.

**Archivos relacionados:**  
`drizzle.config.ts`, `.env.example`, `src/modules/*`, `src/lib/auth/session.ts`.

## `src/lib`

**Para que sirve:**  
Infraestructura compartida: env, auth/session, permisos, validaciones, Supabase, Storage, email, fechas y utilidades.

**Aqui encontraras:**  
Funciones reutilizables que no pertenecen a una pantalla concreta.

**Cuando tocarla:**  
Para cambiar reglas transversales, integraciones o validaciones compartidas.

**No tocar aqui para:**  
Cambios cosmeticos de una pantalla concreta.

**Archivos relacionados:**  
`src/modules`, `src/app/api`, `src/components/forms`, `src/db`.

## `src/modules`

**Para que sirve:**  
Logica de servidor organizada por dominio.

**Aqui encontraras:**  
Server actions (`auth`, `companies`, `assets`, `documents`, `members`, `obligations`) y services (`dashboard`, `notifications`, `reminders`, `billing`, `reports`, `audit-log`).

**Cuando tocarla:**  
Para cambiar comportamiento real, escrituras, validaciones server-side, permisos o queries.

**No tocar aqui para:**  
Solo estilos o copy visual.

**Archivos relacionados:**  
`src/lib/validations/*`, `src/lib/auth/session.ts`, `src/db/schema/index.ts`, tests.

## `src/trigger`

**Para que sirve:**  
Funciones preparadas para tareas programadas.

**Aqui encontraras:**  
Revisiones de vencimiento, envio de recordatorios y resumen mensual.

**Cuando tocarla:**  
Para cambiar crons, destinatarios, emails o logica batch.

**No tocar aqui para:**  
Activar Trigger.dev en produccion sin configurar runtime externo. Existe base tecnica, falta configuracion/registro externo.

**Archivos relacionados:**  
`src/modules/notifications/service.ts`, `src/lib/email/*`, `src/lib/env.ts`, `.env.example`.

## `.github`

**Para que sirve:**  
Automatizacion de GitHub Actions.

**Aqui encontraras:**  
`workflows/ci.yml` ejecuta instalacion, typecheck, lint, tests y build.

**Cuando tocarla:**  
Para cambiar la verificacion automatica de PR/push.

**No tocar aqui para:**  
Arreglar fallos de build de aplicacion; primero corrige el codigo.

**Archivos relacionados:**  
`package.json`, `package-lock.json`, `.nvmrc`.

## `docs`

**Para que sirve:**  
Documentacion interna del proyecto.

**Aqui encontraras:**  
Auditorias, guias de mapa, comandos y orientacion de cambios.

**Cuando tocarla:**  
Cuando cambie arquitectura, comandos, rutas criticas o decisiones de producto.

**No tocar aqui para:**  
Implementar funcionalidad.

**Archivos relacionados:**  
Todo el repositorio.

## `public`

**Para que sirve:**  
Assets estaticos servidos publicamente.

**Aqui encontraras:**  
`public/images/controla-hero.png`.

**Cuando tocarla:**  
Para cambiar imagenes publicas, iconos o archivos descargables.

**No tocar aqui para:**  
Documentos privados de clientes. Esos van a Supabase Storage privado.

**Archivos relacionados:**  
`src/app/(marketing)/page.tsx`, `next.config.mjs`.
