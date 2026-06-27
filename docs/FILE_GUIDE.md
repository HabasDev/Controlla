# File Guide

Guia practica archivo por archivo. Esta documentacion se basa en el estado real del repositorio.

## Archivos raiz y configuracion

## `.env.example`

**Que hace:**  
Plantilla de variables de entorno para desarrollo/despliegue.

**Que contiene:**  
Variables de Supabase, DB, Storage admin, Resend, Trigger.dev, Stripe, Sentry y URL publica.

**Cuando tocarlo:**  
Cuando anadas o cambies una variable leida por el codigo.

**Antes de tocarlo, revisa:**  
`src/lib/env.ts`, `README.md`, Vercel/Supabase/Stripe config.

**Puede afectar a:**  
Arranque local, auth, DB, emails, pagos, Storage, Sentry y warnings runtime.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir una variable para un proveedor externo nuevo.

## `.github/workflows/ci.yml`

**Que hace:**  
Define la verificacion automatica en GitHub Actions.

**Que contiene:**  
Workflow en Ubuntu con Node 20, `npm ci`, typecheck, lint, test y build.

**Cuando tocarlo:**  
Cuando cambien scripts, version de Node o pasos obligatorios de CI.

**Antes de tocarlo, revisa:**  
`package.json`, `.nvmrc`, `package-lock.json`.

**Puede afectar a:**  
Pull requests, pushes y calidad minima antes de desplegar.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir un paso de coverage si se crea script real.

## `.eslintrc.json`

**Que hace:**  
Configura ESLint para Next y TypeScript.

**Que contiene:**  
Extends `next/core-web-vitals`, `next/typescript` e ignora `next-env.d.ts`.

**Cuando tocarlo:**  
Cuando cambien reglas de lint o patrones generados.

**Antes de tocarlo, revisa:**  
`package.json`, `next-env.d.ts`, salida de `npm run lint`.

**Puede afectar a:**  
CI, lint local y estilo de codigo.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Ignorar otro archivo generado por herramientas.

## `.nvmrc`

**Que hace:**  
Indica la version mayor de Node esperada.

**Que contiene:**  
`20`.

**Cuando tocarlo:**  
Cuando el proyecto suba version minima de Node.

**Antes de tocarlo, revisa:**  
`package.json` `engines`, `.github/workflows/ci.yml`, Vercel.

**Puede afectar a:**  
Instalacion local, CI y despliegue.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Subir a Node 22 cuando dependencias y hosting lo soporten.

## `package.json`

**Que hace:**  
Define scripts, dependencias, devDependencies y engines.

**Que contiene:**  
Scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:watch`, `db:generate`, `db:migrate`, `db:seed`.

**Cuando tocarlo:**  
Cuando anadas dependencias o scripts reales.

**Antes de tocarlo, revisa:**  
`package-lock.json`, `.github/workflows/ci.yml`, `.nvmrc`.

**Puede afectar a:**  
Instalacion, CI, build, tests, migraciones y runtime.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir un script `db:studio` si se decide exponer Drizzle Studio.

## `package-lock.json`

**Que hace:**  
Bloquea versiones exactas de dependencias npm.

**Que contiene:**  
Arbol resuelto de paquetes.

**Cuando tocarlo:**  
Normalmente se actualiza automaticamente al instalar o actualizar dependencias.

**Antes de tocarlo, revisa:**  
`package.json`, salida de `npm install`/`npm ci`.

**Puede afectar a:**  
CI reproducible, seguridad de dependencias y builds.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Actualizar Next o una dependencia de Supabase.

## `README.md`

**Que hace:**  
Documenta stack, instalacion, variables, Supabase, Storage, CI y limitaciones actuales.

**Que contiene:**  
Resumen tecnico y pasos de ejecucion/despliegue.

**Cuando tocarlo:**  
Cuando cambien arquitectura, comandos, variables o limitaciones.

**Antes de tocarlo, revisa:**  
`package.json`, `.env.example`, `docs/IMPLEMENTATION_AUDIT.md`.

**Puede afectar a:**  
Onboarding de desarrolladores y despliegue.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Documentar un nuevo proveedor de email.

## `CHANGELOG.md`

**Que hace:**  
Registra cambios de producto/codigo si se mantiene manualmente.

**Que contiene:**  
Historial de versiones o cambios.

**Cuando tocarlo:**  
Cuando se quiera dejar trazabilidad de una entrega.

**Antes de tocarlo, revisa:**  
Commits recientes y docs de auditoria.

**Puede afectar a:**  
Comunicacion interna, no runtime.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Anotar una mejora visual o de seguridad.

## `CONTRIBUTING.md`

**Que hace:**  
Define pautas para contribuir al repo.

**Que contiene:**  
Instrucciones de colaboracion si estan documentadas.

**Cuando tocarlo:**  
Cuando cambie el proceso de PR, tests o ramas.

**Antes de tocarlo, revisa:**  
`.github/workflows/ci.yml`, `README.md`.

**Puede afectar a:**  
Flujo de equipo.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir checklist antes de abrir PR.

## `components.json`

**Que hace:**  
Configura convenciones estilo shadcn/ui.

**Que contiene:**  
Aliases, rutas de Tailwind/CSS y estilo `new-york`.

**Cuando tocarlo:**  
Cuando cambien aliases o ubicacion de componentes UI.

**Antes de tocarlo, revisa:**  
`tailwind.config.ts`, `src/app/globals.css`, `src/components/ui`.

**Puede afectar a:**  
Generacion/ubicacion de componentes UI.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Cambiar alias `ui` si se reorganiza `src/components/ui`.

## `drizzle.config.ts`

**Que hace:**  
Configura Drizzle Kit.

**Que contiene:**  
Schema `./src/db/schema/index.ts`, salida `./src/db/migrations`, dialecto PostgreSQL y `DATABASE_URL`.

**Cuando tocarlo:**  
Cuando cambie ubicacion de schema, migraciones o credenciales.

**Antes de tocarlo, revisa:**  
`src/db/schema/index.ts`, `src/db/migrations`, `.env.example`.

**Puede afectar a:**  
Generacion/aplicacion de migraciones y base de datos.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Mover migraciones a otra carpeta.

## `instrumentation.ts`

**Que hace:**  
Registra Sentry server en runtime Node si hay `SENTRY_DSN`.

**Que contiene:**  
Funcion `register()` que importa `sentry.server.config`.

**Cuando tocarlo:**  
Cuando cambie observabilidad server o instrumentacion global.

**Antes de tocarlo, revisa:**  
`sentry.server.config.ts`, `.env.example`, `src/lib/env.ts`.

**Puede afectar a:**  
Monitorizacion y arranque server.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir otra instrumentacion server condicional.

## `middleware.ts`

**Que hace:**  
Refresca sesion Supabase para rutas Next.

**Que contiene:**  
`middleware(request)` que llama a `updateSession` y matcher global con exclusiones de assets.

**Cuando tocarlo:**  
Cuando cambien reglas globales de middleware o exclusiones.

**Antes de tocarlo, revisa:**  
`src/lib/supabase/middleware.ts`, `src/lib/auth/session.ts`.

**Puede afectar a:**  
Auth, cookies, todas las rutas y rendimiento.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Excluir una nueva ruta estatica del middleware.

## `next.config.mjs`

**Que hace:**  
Configura Next.js.

**Que contiene:**  
`typedRoutes: true` y formatos de imagen AVIF/WebP.

**Cuando tocarlo:**  
Cuando cambien opciones Next, imagenes o build.

**Antes de tocarlo, revisa:**  
`package.json`, `tsconfig.json`, rutas en `src/app`.

**Puede afectar a:**  
Build, typegen, imagenes y routing.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Permitir dominios externos de imagen si se usan assets remotos.

## `postcss.config.mjs`

**Que hace:**  
Configura PostCSS para Tailwind.

**Que contiene:**  
Plugin Tailwind/PostCSS del proyecto.

**Cuando tocarlo:**  
Rara vez; solo si cambia pipeline CSS.

**Antes de tocarlo, revisa:**  
`tailwind.config.ts`, `src/app/globals.css`.

**Puede afectar a:**  
Build CSS.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir un plugin PostCSS necesario.

## `tailwind.config.ts`

**Que hace:**  
Define tokens Tailwind y rutas escaneadas.

**Que contiene:**  
Colores basados en CSS variables, radios, sombras y animaciones.

**Cuando tocarlo:**  
Cuando cambies sistema visual, tokens o contenido escaneado por Tailwind.

**Antes de tocarlo, revisa:**  
`src/app/globals.css`, `components.json`, `src/components/ui/*`.

**Puede afectar a:**  
Toda la UI, build CSS y clases disponibles.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir un token de color para un nuevo estado.

## `tsconfig.json`

**Que hace:**  
Configura TypeScript estricto para el proyecto.

**Que contiene:**  
`strict`, alias `@/*`, includes de Next y JSX preserve.

**Cuando tocarlo:**  
Cuando cambien aliases, target o reglas TS.

**Antes de tocarlo, revisa:**  
`tsconfig.typecheck.json`, `vitest.config.ts`, `next.config.mjs`.

**Puede afectar a:**  
Typecheck, IDE, build y tests.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir un alias nuevo.

## `tsconfig.typecheck.json`

**Que hace:**  
Configura el typecheck sin depender de `.next/types`.

**Que contiene:**  
Extiende `tsconfig.json`, incluye TS/TSX y excluye `.next`.

**Cuando tocarlo:**  
Cuando cambie estrategia de typecheck.

**Antes de tocarlo, revisa:**  
Script `typecheck` en `package.json`.

**Puede afectar a:**  
CI y verificacion local.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Excluir otro archivo generado.

## `vitest.config.ts`

**Que hace:**  
Configura Vitest.

**Que contiene:**  
Environment Node, include `src/**/*.test.ts` y alias `@`.

**Cuando tocarlo:**  
Cuando anadas tests con DOM, setup files o coverage.

**Antes de tocarlo, revisa:**  
Tests existentes y `tsconfig.json`.

**Puede afectar a:**  
`npm run test` y CI.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Cambiar environment a `jsdom` para tests de componentes.

## `sentry.client.config.ts`

**Que hace:**  
Inicializa Sentry en cliente si existe `NEXT_PUBLIC_SENTRY_DSN`.

**Que contiene:**  
`Sentry.init` con `tracesSampleRate: 0`.

**Cuando tocarlo:**  
Cuando cambie observabilidad frontend.

**Antes de tocarlo, revisa:**  
`.env.example`, `instrumentation.ts`, `sentry.server.config.ts`.

**Puede afectar a:**  
Telemetria del navegador.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Ajustar sample rate en produccion.

## `sentry.server.config.ts`

**Que hace:**  
Inicializa Sentry en servidor si existe `SENTRY_DSN`.

**Que contiene:**  
`Sentry.init` con sample rate 0.1 en produccion.

**Cuando tocarlo:**  
Cuando cambie observabilidad server.

**Antes de tocarlo, revisa:**  
`instrumentation.ts`, `.env.example`.

**Puede afectar a:**  
Errores server y trazas.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Cambiar sample rate segun coste/ruido.

## Rutas y pantallas

## `src/app/layout.tsx`

**Que hace:**  
Layout raiz de la aplicacion.

**Que contiene:**  
Metadata global, `html lang="es"` y carga de `globals.css`.

**Cuando tocarlo:**  
Para cambiar metadata global, idioma o wrappers globales.

**Antes de tocarlo, revisa:**  
`src/app/globals.css`, `next.config.mjs`.

**Puede afectar a:**  
Todas las paginas.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Cambiar titulo/descripccion global.

## `src/app/globals.css`

**Que hace:**  
Define estilos globales, tokens CSS y utilidades visuales.

**Que contiene:**  
CSS variables de color, foco, backgrounds, `control-grid`, superficies y motion reduced.

**Cuando tocarlo:**  
Para cambiar sistema visual global.

**Antes de tocarlo, revisa:**  
`tailwind.config.ts`, `src/components/ui/*`.

**Puede afectar a:**  
Toda la UI, accesibilidad y contraste.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Ajustar contraste de texto o color de estado critico.

## `src/app/not-found.tsx`

**Que hace:**  
Pantalla global 404.

**Que contiene:**  
Mensaje de ruta no encontrada y enlace al inicio.

**Cuando tocarlo:**  
Para cambiar experiencia 404.

**Antes de tocarlo, revisa:**  
Rutas `src/app`.

**Puede afectar a:**  
Usuarios que visitan rutas inexistentes.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir enlace a dashboard si hay sesion.

## `src/app/(marketing)/page.tsx`

**Que hace:**  
Landing publica de Controlla.

**Que contiene:**  
Hero, mockup visual, secciones de problema/producto/flujo, CTA y footer.

**Cuando tocarlo:**  
Para cambiar marketing, copy publico o CTAs.

**Antes de tocarlo, revisa:**  
`src/app/globals.css`, `src/components/ui/button.tsx`, `src/components/ui/card.tsx`.

**Puede afectar a:**  
Conversion, primera impresion y enlaces a auth.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Cambiar "Contratar" por otro CTA.

## `src/app/(auth)/layout.tsx`

**Que hace:**  
Layout visual comun para pantallas de auth.

**Que contiene:**  
Panel lateral informativo y contenedor de formulario.

**Cuando tocarlo:**  
Para cambiar estructura visual de login/registro/onboarding.

**Antes de tocarlo, revisa:**  
`src/components/forms/auth-forms.tsx`, `src/components/forms/company-form.tsx`.

**Puede afectar a:**  
Login, registro, recuperar password y onboarding.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Cambiar mensajes del panel de valor.

## `src/app/(auth)/login/page.tsx`

**Que hace:**  
Pantalla de login.

**Que contiene:**  
Card con `LoginForm` y enlace a recuperar password.

**Cuando tocarlo:**  
Para cambiar copy o composicion de la pantalla de login.

**Antes de tocarlo, revisa:**  
`src/components/forms/auth-forms.tsx`, `src/modules/auth/actions.ts`.

**Puede afectar a:**  
Entrada de usuarios existentes.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir enlace a registro.

## `src/app/(auth)/register/page.tsx`

**Que hace:**  
Pantalla de registro.

**Que contiene:**  
Card con `RegisterForm`.

**Cuando tocarlo:**  
Para cambiar copy o estructura de alta.

**Antes de tocarlo, revisa:**  
`src/components/forms/auth-forms.tsx`, `src/modules/auth/actions.ts`.

**Puede afectar a:**  
Altas nuevas y flujo hacia onboarding.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir texto legal antes de crear cuenta.

## `src/app/(auth)/forgot-password/page.tsx`

**Que hace:**  
Pantalla de recuperacion de password.

**Que contiene:**  
Card con `ForgotPasswordForm`.

**Cuando tocarlo:**  
Para cambiar copy o UX de recuperacion.

**Antes de tocarlo, revisa:**  
`src/components/forms/auth-forms.tsx`, `src/modules/auth/actions.ts`.

**Puede afectar a:**  
Usuarios que no pueden entrar.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Cambiar instrucciones de recuperacion.

## `src/app/(auth)/onboarding/page.tsx`

**Que hace:**  
Pantalla inicial para crear empresa.

**Que contiene:**  
Progreso visual y `CompanyForm` desactivado si faltan DB/Supabase.

**Cuando tocarlo:**  
Para cambiar onboarding inicial de empresa.

**Antes de tocarlo, revisa:**  
`src/components/forms/company-form.tsx`, `src/modules/companies/actions.ts`, `src/lib/env.ts`.

**Puede afectar a:**  
Primera configuracion de empresa y cookie activa.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir paso posterior para primera obligacion.

## `src/app/dashboard/layout.tsx`

**Que hace:**  
Layout privado de dashboard.

**Que contiene:**  
Obtiene usuario/empresa y monta `AppShell` con warnings runtime.

**Cuando tocarlo:**  
Para cambiar wrapper privado o datos globales del shell.

**Antes de tocarlo, revisa:**  
`src/components/layout/app-shell.tsx`, `src/lib/auth/session.ts`, `src/lib/env.ts`.

**Puede afectar a:**  
Todas las rutas privadas.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Pasar selector de empresa al shell.

## `src/app/dashboard/page.tsx`

**Que hace:**  
Dashboard principal.

**Que contiene:**  
Control room, metricas, radar de vencimientos, atencion y actividad.

**Cuando tocarlo:**  
Para cambiar experiencia del panel.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/lib/date/obligations.ts`, `src/features/*/components`.

**Puede afectar a:**  
Resumen ejecutivo, navegacion a obligaciones/documentos/activos.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir una metrica real nueva.

## `src/app/dashboard/loading.tsx`

**Que hace:**  
Estado de carga para dashboard.

**Que contiene:**  
Skeleton simple con cards.

**Cuando tocarlo:**  
Para mejorar loading visual privado.

**Antes de tocarlo, revisa:**  
`src/app/dashboard/layout.tsx`, componentes UI.

**Puede afectar a:**  
Percepcion de carga.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir skeleton de tabla.

## `src/app/dashboard/error.tsx`

**Que hace:**  
Error boundary de dashboard.

**Que contiene:**  
Mensaje de error y boton `reset`.

**Cuando tocarlo:**  
Para cambiar UX de errores privados.

**Antes de tocarlo, revisa:**  
Server actions y data loaders que pueden lanzar errores.

**Puede afectar a:**  
Recuperacion ante errores runtime.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir enlace a soporte.

## `src/app/dashboard/obligaciones/page.tsx`

**Que hace:**  
Pagina de listado/creacion de obligaciones.

**Que contiene:**  
`ObligationForm` y `ObligationBoard`.

**Cuando tocarlo:**  
Para cambiar composicion de la pantalla de obligaciones.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/components/forms/obligation-form.tsx`, `src/features/obligations/components/obligation-board.tsx`.

**Puede afectar a:**  
Creacion, filtrado y revision de obligaciones.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Mover el formulario a un panel separado.

## `src/app/dashboard/obligaciones/[obligationId]/page.tsx`

**Que hace:**  
Detalle de una obligacion.

**Que contiene:**  
Cabecera de expediente, datos, formulario de edicion, acciones, reglas, documentos e historial.

**Cuando tocarlo:**  
Para cambiar la vista expediente de una obligacion.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/modules/obligations/actions.ts`, `src/components/forms/obligation-form.tsx`.

**Puede afectar a:**  
Edicion, renovaciones, documentos asociados y percepcion de estado.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir una seccion de historial real filtrado por entity.

## `src/app/dashboard/activos/page.tsx`

**Que hace:**  
Pagina de listado/creacion de activos.

**Que contiene:**  
`AssetForm` y `AssetsList`.

**Cuando tocarlo:**  
Para cambiar pantalla de activos.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/components/forms/asset-form.tsx`, `src/features/assets/components/assets-list.tsx`.

**Puede afectar a:**  
Creacion y lectura de activos.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir filtro por responsable.

## `src/app/dashboard/activos/[assetId]/page.tsx`

**Que hace:**  
Detalle de activo.

**Que contiene:**  
Datos generales, obligaciones relacionadas, documentos e historial informativo.

**Cuando tocarlo:**  
Para cambiar el expediente de un activo.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/features/obligations/components/obligation-board.tsx`.

**Puede afectar a:**  
Relacion activo-obligaciones-documentos.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir indicador real de obligaciones vencidas por activo.

## `src/app/dashboard/documentos/page.tsx`

**Que hace:**  
Pagina de documentos.

**Que contiene:**  
Formulario de subida, biblioteca, descarga firmada y borrado.

**Cuando tocarlo:**  
Para cambiar UX de biblioteca/subida.

**Antes de tocarlo, revisa:**  
`src/components/forms/document-upload-form.tsx`, `src/modules/documents/actions.ts`, `src/app/api/documents/[documentId]/signed-url/route.ts`.

**Puede afectar a:**  
Documentos privados y Storage.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir filtro por tipo de documento.

## `src/app/dashboard/equipo/page.tsx`

**Que hace:**  
Pagina de equipo.

**Que contiene:**  
Formulario de invitacion y tabla de miembros con controles de rol/acceso.

**Cuando tocarlo:**  
Para cambiar gestion visual de miembros.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/components/forms/invite-member-form.tsx`, `src/features/members/components/member-access-controls.tsx`.

**Puede afectar a:**  
Invitaciones, roles y accesos.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir columna de estado de invitacion.

## `src/app/dashboard/configuracion/page.tsx`

**Que hace:**  
Pagina de configuracion de empresa.

**Que contiene:**  
`CompanyForm` con datos de empresa y lista de sedes.

**Cuando tocarlo:**  
Para cambiar configuracion visible de empresa.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/components/forms/company-form.tsx`, `src/modules/companies/actions.ts`.

**Puede afectar a:**  
Datos legales, timezone y settings.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir gestion CRUD de sedes.

## `src/app/dashboard/facturacion/page.tsx`

**Que hace:**  
Pagina de facturacion preparada.

**Que contiene:**  
Plan, estado, limites y aviso si Stripe no esta configurado.

**Cuando tocarlo:**  
Para cambiar vista de billing o conectar checkout/portal.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/modules/billing/service.ts`, `src/app/api/stripe/webhook/route.ts`.

**Puede afectar a:**  
Planes, limites y percepcion de cobro.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir boton a portal de cliente Stripe.

## `src/app/admin/page.tsx`

**Que hace:**  
Placeholder de administracion.

**Que contiene:**  
Pantalla informativa simple.

**Cuando tocarlo:**  
Cuando se implemente admin interno real.

**Antes de tocarlo, revisa:**  
Permisos, RLS y alcance de admin global.

**Puede afectar a:**  
Administracion futura.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Crear vista de auditoria para admins.

## `src/app/api/health/route.ts`

**Que hace:**  
Endpoint de health/configuracion.

**Que contiene:**  
GET que devuelve estado de DB/Supabase y warnings.

**Cuando tocarlo:**  
Para exponer mas señales de salud.

**Antes de tocarlo, revisa:**  
`src/lib/env.ts`.

**Puede afectar a:**  
Monitoreo y diagnostico.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Incluir estado de Resend o Stripe.

## `src/app/api/documents/[documentId]/signed-url/route.ts`

**Que hace:**  
Genera URL firmada para descargar documento privado.

**Que contiene:**  
GET que busca documento, exige `documents:read` y llama a Storage.

**Cuando tocarlo:**  
Para cambiar expiracion o respuesta de descarga.

**Antes de tocarlo, revisa:**  
`src/lib/storage/documents.ts`, `src/lib/auth/session.ts`, RLS de documentos.

**Puede afectar a:**  
Seguridad de documentos privados.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Cambiar duracion de URL firmada.

## `src/app/api/stripe/webhook/route.ts`

**Que hace:**  
Webhook de Stripe para suscripciones.

**Que contiene:**  
POST que valida firma, procesa eventos de subscription y actualiza `subscriptions`.

**Cuando tocarlo:**  
Para soportar mas eventos Stripe o completar billing real.

**Antes de tocarlo, revisa:**  
`src/modules/billing/service.ts`, `.env.example`, tabla `subscriptions`.

**Puede afectar a:**  
Facturacion y estado de planes.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Crear subscription si no existe al recibir `customer.subscription.created`.

## Componentes dashboard

## `src/components/layout/app-shell.tsx`

**Que hace:**  
Estructura principal de la app privada.

**Que contiene:**  
Sidebar desktop, topbar, mobile nav, usuario, empresa, logout, command palette y runtime warnings.

**Cuando tocarlo:**  
Para cambiar shell privado, marca, navegacion envolvente o acciones globales.

**Antes de tocarlo, revisa:**  
`src/app/dashboard/layout.tsx`, `src/components/layout/app-navigation.tsx`, `src/components/layout/command-palette.tsx`.

**Puede afectar a:**  
Todas las pantallas privadas y responsive mobile.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir selector real de empresa activa.

## `src/components/layout/app-navigation.tsx`

**Que hace:**  
Navegacion cliente de dashboard.

**Que contiene:**  
Items de nav, iconos Lucide, estado activo con `usePathname`, version compacta mobile.

**Cuando tocarlo:**  
Para añadir/quitar secciones de dashboard o cambiar orden de nav.

**Antes de tocarlo, revisa:**  
Rutas bajo `src/app/dashboard`.

**Puede afectar a:**  
Navegacion privada y mobile bottom nav.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir ruta `/dashboard/notificaciones`.

## `src/components/layout/command-palette.tsx`

**Que hace:**  
Paleta de comandos cliente.

**Que contiene:**  
Dialog, atajo Ctrl/Cmd+K, busqueda, Escape, Enter y navegacion con router.

**Cuando tocarlo:**  
Para cambiar UX de comandos o comportamiento teclado.

**Antes de tocarlo, revisa:**  
`src/components/layout/command-palette-data.ts`, `src/components/layout/command-palette.test.ts`.

**Puede afectar a:**  
Accesos rapidos y navegacion.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir comando "Ir a facturacion".

## `src/components/layout/command-palette-data.ts`

**Que hace:**  
Define comandos disponibles y filtrado.

**Que contiene:**  
`commandItems` y `filterCommandItems`.

**Cuando tocarlo:**  
Para cambiar comandos sin tocar UI.

**Antes de tocarlo, revisa:**  
Rutas destino y test de command palette.

**Puede afectar a:**  
Resultados de busqueda y navegacion.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir comando para subir documento.

## `src/features/assets/components/assets-list.tsx`

**Que hace:**  
Lista filtrable de activos.

**Que contiene:**  
Buscador, filtros por tipo/estado, vista mobile cards y tabla desktop.

**Cuando tocarlo:**  
Para cambiar filtros, columnas o responsive de activos.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/app/dashboard/activos/page.tsx`.

**Puede afectar a:**  
Listado de activos y navegacion a detalle.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir columna de documentos asociados.

## `src/features/obligations/components/obligation-board.tsx`

**Que hace:**  
Lista filtrable de obligaciones.

**Que contiene:**  
Filtros por texto/estado/sede/responsable, cards mobile y tabla desktop.

**Cuando tocarlo:**  
Para cambiar filtros, columnas, orden visual o responsive.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/lib/date/obligations.ts`, `src/components/shared/status-badge.tsx`.

**Puede afectar a:**  
Lectura operacional de obligaciones.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir filtro por prioridad.

## `src/components/dashboard/metric-card.tsx`

**Que hace:**  
Tarjeta de metrica del dashboard.

**Que contiene:**  
Icono, valor, tono visual, detalle y link opcional.

**Cuando tocarlo:**  
Para cambiar apariencia o comportamiento de KPIs.

**Antes de tocarlo, revisa:**  
`src/app/dashboard/page.tsx`, `src/components/ui/card.tsx`.

**Puede afectar a:**  
Dashboard principal.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir nuevo tono para informacion.

## `src/components/dashboard/page-header.tsx`

**Que hace:**  
Cabecera comun de paginas privadas.

**Que contiene:**  
Eyebrow, titulo, descripcion y acciones opcionales.

**Cuando tocarlo:**  
Para cambiar jerarquia visual de paginas privadas.

**Antes de tocarlo, revisa:**  
Paginas bajo `src/app/dashboard`.

**Puede afectar a:**  
Todas las pantallas que lo usan.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir breadcrumbs.

## `src/components/shared/status-badge.tsx`

**Que hace:**  
Traduce estado computado de obligacion a badge.

**Que contiene:**  
Labels y variantes para completed, expired, critical, warning, normal, cancelled.

**Cuando tocarlo:**  
Para cambiar textos o colores de estado.

**Antes de tocarlo, revisa:**  
`src/lib/date/obligations.ts`, `src/components/ui/badge.tsx`.

**Puede afectar a:**  
Dashboard, listas y detalle de obligaciones.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Cambiar "Urgente" por "Critico".

## `src/features/obligations/components/obligation-actions.tsx`

**Que hace:**  
Botones cliente para acciones de obligacion.

**Que contiene:**  
Completar, duplicar, cancelar y crear renovacion.

**Cuando tocarlo:**  
Para cambiar botones visibles o confirmaciones UI.

**Antes de tocarlo, revisa:**  
`src/modules/obligations/actions.ts`.

**Puede afectar a:**  
Estado real de obligaciones.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir confirmacion antes de cancelar.

## `src/features/documents/components/secure-download-button.tsx`

**Que hace:**  
Boton cliente para descargar documentos con URL firmada.

**Que contiene:**  
Fetch a `/api/documents/[documentId]/signed-url` y `window.open`.

**Cuando tocarlo:**  
Para cambiar UX de descarga o manejo de errores.

**Antes de tocarlo, revisa:**  
`src/app/api/documents/[documentId]/signed-url/route.ts`.

**Puede afectar a:**  
Descarga segura de documentos.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Mostrar toast en vez de texto inline.

## `src/features/documents/components/delete-document-button.tsx`

**Que hace:**  
Boton cliente para borrar documentos.

**Que contiene:**  
Confirmacion `window.confirm`, server action y refresh.

**Cuando tocarlo:**  
Para cambiar confirmacion o UX de borrado.

**Antes de tocarlo, revisa:**  
`src/modules/documents/actions.ts`, `src/lib/storage/documents.ts`.

**Puede afectar a:**  
Borrado en Storage y DB.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Sustituir confirm por modal accesible.

## `src/features/members/components/member-access-controls.tsx`

**Que hace:**  
Controles cliente de rol/acceso de miembros.

**Que contiene:**  
Select de rol, desactivar usuario y eliminar acceso.

**Cuando tocarlo:**  
Para cambiar UX de administracion de equipo.

**Antes de tocarlo, revisa:**  
`src/modules/members/actions.ts`, `src/lib/validations/member.ts`.

**Puede afectar a:**  
Permisos de usuarios y acceso a empresa.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Añadir confirmacion antes de eliminar acceso.

## Formularios

## `src/components/forms/auth-forms.tsx`

**Que hace:**  
Formularios cliente de login, registro y recuperar password.

**Que contiene:**  
Schemas cliente, React Hook Form y llamadas a auth server actions.

**Cuando tocarlo:**  
Para cambiar campos o UX de auth.

**Antes de tocarlo, revisa:**  
`src/modules/auth/actions.ts`.

**Puede afectar a:**  
Autenticacion y alta de usuarios.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir campo legal obligatorio en registro.

## `src/components/forms/company-form.tsx`

**Que hace:**  
Formulario cliente para crear/editar empresa.

**Que contiene:**  
Campos de empresa, timezone y llamada a `createInitialCompanyAction`/`updateCompanyAction`.

**Cuando tocarlo:**  
Para cambiar campos de empresa.

**Antes de tocarlo, revisa:**  
`src/lib/validations/company.ts`, `src/modules/companies/actions.ts`, `src/db/schema/index.ts`.

**Puede afectar a:**  
Onboarding, configuracion y empresa activa.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir campo logo o sector obligatorio.

## `src/components/forms/asset-form.tsx`

**Que hace:**  
Formulario cliente para crear activos.

**Que contiene:**  
Campos de activo, sede, responsable y llamada a `createAssetAction`.

**Cuando tocarlo:**  
Para cambiar captura de activos.

**Antes de tocarlo, revisa:**  
`src/lib/validations/asset.ts`, `src/modules/assets/actions.ts`.

**Puede afectar a:**  
Alta de activos y relaciones con obligaciones/documentos.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir tipo de activo nuevo.

## `src/components/forms/obligation-form.tsx`

**Que hace:**  
Formulario cliente para crear/editar obligaciones.

**Que contiene:**  
Campos de tipo, fecha, activo, sede, responsable, prioridad, recurrencia y descripcion.

**Cuando tocarlo:**  
Para cambiar captura de obligaciones.

**Antes de tocarlo, revisa:**  
`src/lib/validations/obligation.ts`, `src/modules/obligations/actions.ts`, `src/db/schema/index.ts`.

**Puede afectar a:**  
Nucleo del producto: vencimientos, recurrencias y recordatorios.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Mostrar reglas de recordatorio editables.

## `src/components/forms/document-upload-form.tsx`

**Que hace:**  
Formulario cliente de subida de documentos.

**Que contiene:**  
Dropzone, metadatos, relaciones con activo/obligacion y llamada a `uploadDocumentAction`.

**Cuando tocarlo:**  
Para cambiar UX de subida o metadatos.

**Antes de tocarlo, revisa:**  
`src/modules/documents/actions.ts`, `src/lib/validations/document.ts`, `src/lib/storage/documents.ts`.

**Puede afectar a:**  
Subida privada de documentos.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Mostrar progreso real de subida.

## `src/components/forms/invite-member-form.tsx`

**Que hace:**  
Formulario cliente para invitar miembros.

**Que contiene:**  
Email, rol y llamada a `inviteMemberAction`.

**Cuando tocarlo:**  
Para cambiar flujo de invitaciones.

**Antes de tocarlo, revisa:**  
`src/modules/members/actions.ts`, `src/lib/validations/member.ts`.

**Puede afectar a:**  
Acceso de equipo y roles.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir mensaje personalizado de invitacion.

## `src/components/forms/form-result.tsx`

**Que hace:**  
Muestra resultado de formularios.

**Que contiene:**  
Mensaje positivo o error con estilos.

**Cuando tocarlo:**  
Para cambiar feedback comun de formularios.

**Antes de tocarlo, revisa:**  
Formularios que lo usan.

**Puede afectar a:**  
Mensajes de exito/error en auth, empresa, activos, obligaciones, documentos y equipo.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir iconos de estado.

## Componentes compartidos y UI

## `src/components/shared/empty-state.tsx`

**Que hace:**  
Estado vacio reutilizable.

**Que contiene:**  
Icono, titulo, descripcion y estilos de superficie.

**Cuando tocarlo:**  
Para cambiar empty states globales.

**Antes de tocarlo, revisa:**  
Paginas que lo usan, especialmente documentos.

**Puede afectar a:**  
Pantallas sin datos.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir slot de acciones.

## `src/components/shared/runtime-warnings.tsx`

**Que hace:**  
Muestra avisos de configuracion faltante.

**Que contiene:**  
Alert con warnings de `src/lib/env.ts`.

**Cuando tocarlo:**  
Para cambiar presentacion de warnings runtime.

**Antes de tocarlo, revisa:**  
`src/lib/env.ts`, `src/app/dashboard/layout.tsx`.

**Puede afectar a:**  
Diagnostico local y entornos sin servicios.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Separar warnings por servicio.

## `src/components/ui/alert.tsx`

**Que hace:**  
Primitiva visual de alerta.

**Que contiene:**  
`Alert`, `AlertTitle`, `AlertDescription`.

**Cuando tocarlo:**  
Para cambiar estilo global de alertas.

**Antes de tocarlo, revisa:**  
`src/components/shared/runtime-warnings.tsx`.

**Puede afectar a:**  
Warnings y errores visuales.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir variante visual.

## `src/components/ui/badge.tsx`

**Que hace:**  
Badge reutilizable.

**Que contiene:**  
Variantes default, secondary, outline, success, warning, critical.

**Cuando tocarlo:**  
Para cambiar etiquetas de estado.

**Antes de tocarlo, revisa:**  
`src/components/shared/status-badge.tsx`, `src/app/globals.css`.

**Puede afectar a:**  
Estados de obligaciones, documentos y UI.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir variante informativa.

## `src/components/ui/button.tsx`

**Que hace:**  
Boton base del proyecto.

**Que contiene:**  
Variantes y tamaños con `class-variance-authority`.

**Cuando tocarlo:**  
Para cambiar estilo global de botones.

**Antes de tocarlo, revisa:**  
Todas las pantallas principales y contraste.

**Puede afectar a:**  
Acciones de toda la app.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Cambiar hover/focus de botones outline.

## `src/components/ui/card.tsx`

**Que hace:**  
Card base del proyecto.

**Que contiene:**  
`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

**Cuando tocarlo:**  
Para cambiar superficies globales.

**Antes de tocarlo, revisa:**  
`src/app/globals.css` y pantallas dashboard.

**Puede afectar a:**  
La mayor parte de la UI.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Ajustar sombra o borde global.

## `src/components/ui/input.tsx`

**Que hace:**  
Input base.

**Que contiene:**  
ForwardRef con clases Tailwind.

**Cuando tocarlo:**  
Para cambiar estilo de inputs.

**Antes de tocarlo, revisa:**  
Formularios en `src/components/forms`.

**Puede afectar a:**  
Todos los formularios.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Mejorar estado disabled.

## `src/components/ui/label.tsx`

**Que hace:**  
Label base.

**Que contiene:**  
Componente `label` con clases.

**Cuando tocarlo:**  
Para cambiar etiquetas de formularios.

**Antes de tocarlo, revisa:**  
Formularios.

**Puede afectar a:**  
Accesibilidad y lectura de campos.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Cambiar peso/tamaño de labels.

## `src/components/ui/select.tsx`

**Que hace:**  
Select base.

**Que contiene:**  
ForwardRef de `select` con clases.

**Cuando tocarlo:**  
Para cambiar estilo de selects.

**Antes de tocarlo, revisa:**  
Formularios y filtros.

**Puede afectar a:**  
Formularios, filtros de listas y roles.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Mejorar altura tactil mobile.

## `src/components/ui/separator.tsx`

**Que hace:**  
Separador visual.

**Que contiene:**  
`div` con borde horizontal.

**Cuando tocarlo:**  
Para cambiar separacion global.

**Antes de tocarlo, revisa:**  
`src/components/layout/app-shell.tsx`.

**Puede afectar a:**  
Layout visual.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Cambiar opacidad del borde.

## `src/components/ui/table.tsx`

**Que hace:**  
Primitivas de tabla.

**Que contiene:**  
`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`.

**Cuando tocarlo:**  
Para cambiar estilo de tablas.

**Antes de tocarlo, revisa:**  
Listados de obligaciones, activos, documentos, equipo.

**Puede afectar a:**  
Legibilidad de datos.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir zebra rows.

## `src/components/ui/tabs.tsx`

**Que hace:**  
Tabs controladas en cliente.

**Que contiene:**  
Context, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.

**Cuando tocarlo:**  
Para cambiar comportamiento o estilo de tabs.

**Antes de tocarlo, revisa:**  
Componentes que lo usan.

**Puede afectar a:**  
Navegacion interna de vistas.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir soporte de teclado mas completo.

## `src/components/ui/textarea.tsx`

**Que hace:**  
Textarea base.

**Que contiene:**  
ForwardRef de textarea con clases.

**Cuando tocarlo:**  
Para cambiar estilo de areas de texto.

**Antes de tocarlo, revisa:**  
Formularios de activos, obligaciones y documentos.

**Puede afectar a:**  
Campos largos.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Ajustar `min-height`.

## Base de datos

## `src/db/index.ts`

**Que hace:**  
Conecta Drizzle con PostgreSQL.

**Que contiene:**  
`getDb()` con cache de cliente `postgres`, `requireDb()` que falla si falta `DATABASE_URL`.

**Cuando tocarlo:**  
Para cambiar pool, opciones de conexion o comportamiento sin DB.

**Antes de tocarlo, revisa:**  
`src/lib/env.ts`, `.env.example`, `drizzle.config.ts`.

**Puede afectar a:**  
Todas las queries y server actions.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Ajustar `max` de conexiones.

## `src/db/schema/index.ts`

**Que hace:**  
Define el modelo Drizzle de la base.

**Que contiene:**  
Enums, tablas, indices, relaciones y tipos inferidos.

**Cuando tocarlo:**  
Para añadir tablas/campos/indices o cambiar relaciones.

**Antes de tocarlo, revisa:**  
`src/db/migrations/0000_initial.sql`, server actions, validaciones y RLS.

**Puede afectar a:**  
Toda la capa de datos, migraciones, RLS, formularios y build.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Añadir `lastNotifiedAt` a `obligations`.

## `src/db/migrations/0000_initial.sql`

**Que hace:**  
Migracion inicial SQL.

**Que contiene:**  
Extensiones, enums, tablas, indices, triggers, funciones de pertenencia/rol, RLS, bucket `company-documents`, politicas de Storage y tipos base.

**Cuando tocarlo:**  
Solo como referencia si ya esta aplicada. Para cambios nuevos, crea migracion nueva.

**Antes de tocarlo, revisa:**  
`src/db/schema/index.ts`, Supabase staging, seguridad multiempresa.

**Puede afectar a:**  
Base de datos completa, aislamiento multiempresa y documentos privados.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Crear una migracion nueva que anada policy para una tabla nueva.

## `src/db/queries/company-scope.ts`

**Que hace:**  
Comprueba membresia activa de usuario en empresa.

**Que contiene:**  
`userHasActiveCompanyMembership`.

**Cuando tocarlo:**  
Para reutilizar checks de pertenencia a nivel query.

**Antes de tocarlo, revisa:**  
`src/lib/auth/session.ts`, `src/db/schema/index.ts`.

**Puede afectar a:**  
Aislamiento multiempresa.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Extenderlo para devolver rol activo.

## `src/db/seed/seed.ts`

**Que hace:**  
Crea datos demo reales en DB/Supabase.

**Que contiene:**  
Usuarios demo via Supabase Admin, empresa Taller Garcia, miembros, sede, activos, obligaciones, reminder rules, documentos metadata y notificacion.

**Cuando tocarlo:**  
Para cambiar dataset demo local/staging.

**Antes de tocarlo, revisa:**  
`src/db/schema/index.ts`, `src/modules/demo/data.ts`, `src/lib/supabase/admin.ts`.

**Puede afectar a:**  
Datos reales de la base apuntada por `DATABASE_URL`.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir un activo demo nuevo.

## Librerias compartidas

## `src/lib/env.ts`

**Que hace:**  
Centraliza variables de entorno y warnings runtime.

**Que contiene:**  
`appEnv`, `hasDatabaseConfig`, `hasSupabaseConfig`, `getMissingRuntimeWarnings`.

**Cuando tocarlo:**  
Cuando anadas/quites variables de entorno o cambies avisos.

**Antes de tocarlo, revisa:**  
`.env.example`, `README.md`, servicios que usan la variable.

**Puede afectar a:**  
Arranque, modo demo, warnings, integraciones.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir `NEXT_PUBLIC_POSTHOG_KEY`.

## `src/lib/auth/session.ts`

**Que hace:**  
Gestiona usuario actual, empresa activa y autorizacion server-side.

**Que contiene:**  
Cookie `controla_company_id`, `getCurrentUser`, `getCurrentCompany`, `requireCurrentUser`, `requireCompanyMembership`, `requireCompanyRole`, `requirePermission`, `canCurrentUser`.

**Cuando tocarlo:**  
Para cambiar sesion, empresa activa o checks de permisos.

**Antes de tocarlo, revisa:**  
`src/lib/permissions/index.ts`, `src/lib/supabase/server.ts`, RLS en migracion.

**Puede afectar a:**  
Seguridad, aislamiento multiempresa y todas las server actions.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Permitir selector de empresa y persistir cookie.

## `src/lib/permissions/index.ts`

**Que hace:**  
Define la matriz rol-permiso.

**Que contiene:**  
Tipos `Permission`, ranking de roles, permisos minimos y helpers `roleCan`, `assertSameCompany`, `assertRoleCan`.

**Cuando tocarlo:**  
Para cambiar que rol puede hacer cada accion.

**Antes de tocarlo, revisa:**  
`src/lib/permissions/index.test.ts`, `src/lib/auth/session.ts`, server actions, RLS.

**Puede afectar a:**  
Seguridad funcional y acceso de usuarios.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Permitir que `member` gestione documentos.

## `src/lib/supabase/server.ts`

**Que hace:**  
Crea cliente Supabase server con cookies.

**Que contiene:**  
`getSupabaseServerClient`.

**Cuando tocarlo:**  
Para cambiar auth server-side o gestion de cookies.

**Antes de tocarlo, revisa:**  
`src/lib/supabase/middleware.ts`, `middleware.ts`, `src/modules/auth/actions.ts`.

**Puede afectar a:**  
Login, registro, recuperacion y sesion.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Actualizar API de `@supabase/ssr`.

## `src/lib/supabase/browser.ts`

**Que hace:**  
Crea cliente Supabase para client components.

**Que contiene:**  
`getSupabaseBrowserClient` condicionado a URL/anon key.

**Cuando tocarlo:**  
Si se empieza a usar Supabase en cliente.

**Antes de tocarlo, revisa:**  
Variables publicas de Supabase y componentes cliente.

**Puede afectar a:**  
Auth/browser si se usa en el futuro.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Usar cliente browser para realtime.

## `src/lib/supabase/admin.ts`

**Que hace:**  
Crea cliente Supabase Admin con service role.

**Que contiene:**  
`getSupabaseAdminClient`.

**Cuando tocarlo:**  
Para operaciones privilegiadas de Auth/Storage.

**Antes de tocarlo, revisa:**  
`.env.example`, `src/modules/members/actions.ts`, `src/lib/storage/documents.ts`, `src/db/seed/seed.ts`.

**Puede afectar a:**  
Invitaciones, seed, Storage y resolucion de emails.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Cambiar opciones de auth admin.

## `src/lib/supabase/middleware.ts`

**Que hace:**  
Refresca sesion Supabase desde middleware.

**Que contiene:**  
`updateSession(request)` con cookies get/set.

**Cuando tocarlo:**  
Para cambiar refresco global de sesion.

**Antes de tocarlo, revisa:**  
`middleware.ts`, `src/lib/supabase/server.ts`.

**Puede afectar a:**  
Autenticacion en toda la app.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Actualizar firma de cookies por cambio en Supabase SSR.

## `src/lib/storage/documents.ts`

**Que hace:**  
Abstrae Storage privado de documentos.

**Que contiene:**  
`sanitizeFileName`, `buildDocumentStoragePath`, `uploadDocument`, `getSignedDocumentUrl`, `deleteDocument`.

**Cuando tocarlo:**  
Para cambiar paths, bucket, validacion previa o expiracion de URLs.

**Antes de tocarlo, revisa:**  
`src/lib/validations/document.ts`, `src/modules/documents/actions.ts`, Storage policies.

**Puede afectar a:**  
Privacidad, subida, descarga y borrado de documentos.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Cambiar estructura de path de Storage.

## `src/lib/date/obligations.ts`

**Que hace:**  
Gestiona fechas date-only, estado de obligaciones, recordatorios y recurrencias.

**Que contiene:**  
`getTodayDateOnly`, `getDaysUntilDueDate`, `getObligationStatus`, `isReminderDue`, `calculateNextDueDate`, formatters.

**Cuando tocarlo:**  
Para cambiar umbrales de urgente/proximo o calculo de recurrencias.

**Antes de tocarlo, revisa:**  
`src/lib/date/obligations.test.ts`, dashboard, reminder services.

**Puede afectar a:**  
Dashboard, alertas, recordatorios, emails y estado visual.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Cambiar `CRITICAL_DAYS` de 7 a 5.

## `src/lib/email/client.ts`

**Que hace:**  
Envia emails con Resend.

**Que contiene:**  
`sendEmail` que devuelve resultado sent/disabled/error.

**Cuando tocarlo:**  
Para cambiar proveedor o manejo de errores de email.

**Antes de tocarlo, revisa:**  
`src/lib/email/templates.ts`, `src/trigger/send-reminders.ts`, `.env.example`.

**Puede afectar a:**  
Recordatorios y reportes por email.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir headers o reply-to.

## `src/lib/email/templates.ts`

**Que hace:**  
Construye asuntos/texto/html de emails.

**Que contiene:**  
`reminderEmailTemplate` y `monthlyReportEmailTemplate`.

**Cuando tocarlo:**  
Para cambiar contenido de emails.

**Antes de tocarlo, revisa:**  
`src/lib/email/client.ts`, `src/trigger/*`.

**Puede afectar a:**  
Comunicacion con usuarios.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir link directo a la obligacion.

## `src/lib/utils/cn.ts`

**Que hace:**  
Combina clases Tailwind.

**Que contiene:**  
Helper `cn` con `clsx` y `tailwind-merge`.

**Cuando tocarlo:**  
Casi nunca; solo si cambia estrategia de clases.

**Antes de tocarlo, revisa:**  
Todos los componentes UI.

**Puede afectar a:**  
Estilos de toda la app.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir wrapper para clases condicionales globales.

## `src/lib/validations/shared.ts`

**Que hace:**  
Helpers Zod compartidos.

**Que contiene:**  
UUID, fecha date-only, texto opcional/requerido y `zodFieldErrors`.

**Cuando tocarlo:**  
Para cambiar validaciones comunes.

**Antes de tocarlo, revisa:**  
Todos los schemas en `src/lib/validations`.

**Puede afectar a:**  
Todas las server actions/formularios.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Permitir fechas vacias en un nuevo flujo.

## `src/lib/validations/company.ts`

**Que hace:**  
Valida datos de empresa.

**Que contiene:**  
`companySchema` y `CompanyInput`.

**Cuando tocarlo:**  
Para cambiar campos o requisitos de empresa.

**Antes de tocarlo, revisa:**  
`src/components/forms/company-form.tsx`, `src/modules/companies/actions.ts`, schema DB.

**Puede afectar a:**  
Onboarding y configuracion.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Hacer obligatorio el CIF.

## `src/lib/validations/asset.ts`

**Que hace:**  
Valida activos.

**Que contiene:**  
`assetSchema` y `AssetInput`.

**Cuando tocarlo:**  
Para cambiar campos de activo.

**Antes de tocarlo, revisa:**  
`src/components/forms/asset-form.tsx`, `src/modules/assets/actions.ts`, schema DB.

**Puede afectar a:**  
Alta de activos.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Limitar longitud de referencia interna.

## `src/lib/validations/obligation.ts`

**Que hace:**  
Valida obligaciones y reglas de recordatorio.

**Que contiene:**  
`reminderRuleInputSchema`, `obligationSchema`, `ObligationInput`.

**Cuando tocarlo:**  
Para cambiar campos, recurrencia o reglas de obligacion.

**Antes de tocarlo, revisa:**  
`src/components/forms/obligation-form.tsx`, `src/modules/obligations/actions.ts`, tests de fechas.

**Puede afectar a:**  
Creacion/edicion de obligaciones y recordatorios.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Permitir avisos hasta 730 dias.

## `src/lib/validations/document.ts`

**Que hace:**  
Valida documentos y metadata.

**Que contiene:**  
Bucket `company-documents`, limite 10 MB, MIME permitidos, extensiones y `documentMetadataSchema`.

**Cuando tocarlo:**  
Para cambiar formatos, tamaño o metadata de documentos.

**Antes de tocarlo, revisa:**  
`src/lib/validations/document.test.ts`, `src/lib/storage/documents.ts`, migracion Storage.

**Puede afectar a:**  
Subida y seguridad de documentos.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Permitir XLSX con validacion de extension.

## `src/lib/validations/member.ts`

**Que hace:**  
Valida invitaciones y cambios de acceso.

**Que contiene:**  
Schemas que impiden asignar `owner` desde acciones normales.

**Cuando tocarlo:**  
Para cambiar roles asignables o payloads de equipo.

**Antes de tocarlo, revisa:**  
`src/modules/members/actions.ts`, `src/lib/validations/member.test.ts`, permisos.

**Puede afectar a:**  
Seguridad de equipo.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Permitir invitar solo como `viewer` en cierto plan.

## `src/lib/validations/location.ts`

**Que hace:**  
Valida sedes/localizaciones.

**Que contiene:**  
`locationSchema` y `LocationInput`.

**Cuando tocarlo:**  
Si se implementa CRUD completo de sedes.

**Antes de tocarlo, revisa:**  
`src/modules/locations/service.ts`, schema DB.

**Puede afectar a:**  
Sedes asociadas a activos/obligaciones.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir provincia obligatoria.

## `src/lib/validations/obligation-type.ts`

**Que hace:**  
Valida tipos de obligacion.

**Que contiene:**  
`obligationTypeSchema` y `ObligationTypeInput`.

**Cuando tocarlo:**  
Si se crea UI para gestionar tipos personalizados.

**Antes de tocarlo, revisa:**  
`src/modules/obligation-types/service.ts`, schema DB.

**Puede afectar a:**  
Catalogo de obligaciones.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Permitir iconos predefinidos.

## Modulos de servidor

## `src/modules/auth/actions.ts`

**Que hace:**  
Server actions de autenticacion.

**Que contiene:**  
Login, registro, recuperar password, logout y alta de profile si hay DB.

**Cuando tocarlo:**  
Para cambiar comportamiento real de auth.

**Antes de tocarlo, revisa:**  
`src/components/forms/auth-forms.tsx`, `src/lib/supabase/server.ts`, `src/db/schema/index.ts`.

**Puede afectar a:**  
Acceso de usuarios, perfiles y onboarding.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir redirect URL en reset password.

## `src/modules/companies/actions.ts`

**Que hace:**  
Crea empresa inicial y actualiza empresa.

**Que contiene:**  
Inserta company, owner membership, subscription free, cookie activa y activity log.

**Cuando tocarlo:**  
Para cambiar onboarding de empresa o settings.

**Antes de tocarlo, revisa:**  
`src/components/forms/company-form.tsx`, `src/lib/validations/company.ts`, `src/lib/auth/session.ts`.

**Puede afectar a:**  
Aislamiento multiempresa y empresa activa.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Crear sede por defecto al crear empresa.

## `src/modules/assets/actions.ts`

**Que hace:**  
Crea activos.

**Que contiene:**  
Validacion Zod, permiso `assets:manage`, checks de sede/responsable en misma empresa, insert y audit log.

**Cuando tocarlo:**  
Para cambiar escritura de activos.

**Antes de tocarlo, revisa:**  
`src/lib/validations/asset.ts`, `src/db/schema/index.ts`, RLS.

**Puede afectar a:**  
Activos, responsables y auditoria.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Guardar coste o referencia extra.

## `src/modules/obligations/actions.ts`

**Que hace:**  
Gestiona server actions de obligaciones.

**Que contiene:**  
Crear, completar, editar, crear renovacion, cancelar y duplicar; validacion de referencias, permisos, reminder rules y audit log.

**Cuando tocarlo:**  
Para cambiar el nucleo de vencimientos.

**Antes de tocarlo, revisa:**  
`src/lib/validations/obligation.ts`, `src/lib/date/obligations.ts`, `src/modules/reminders/service.ts`, RLS.

**Puede afectar a:**  
Obligaciones, recurrencias, recordatorios, auditoria y dashboard.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Cambiar comportamiento de auto-renovacion al completar.

## `src/modules/documents/actions.ts`

**Que hace:**  
Sube y borra documentos.

**Que contiene:**  
Validacion de archivo/metadata, permiso `documents:manage`, checks de activo/obligacion, subida Storage, insert DB, rollback Storage si falla DB, borrado y audit log.

**Cuando tocarlo:**  
Para cambiar workflow de documentos.

**Antes de tocarlo, revisa:**  
`src/lib/validations/document.ts`, `src/lib/storage/documents.ts`, `src/db/schema/index.ts`.

**Puede afectar a:**  
Privacidad, integridad DB/Storage y documentos.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Guardar hash del archivo subido.

## `src/modules/members/actions.ts`

**Que hace:**  
Gestiona invitaciones, roles y acceso de miembros.

**Que contiene:**  
Invitar via Supabase Admin, actualizar rol, desactivar, eliminar acceso, protecciones contra owner/self.

**Cuando tocarlo:**  
Para cambiar gestion de equipo.

**Antes de tocarlo, revisa:**  
`src/lib/validations/member.ts`, `src/lib/auth/session.ts`, permisos, RLS.

**Puede afectar a:**  
Acceso de usuarios y seguridad de empresa.

**Nivel de riesgo:**  
Critico.

**Ejemplo de cambio tipico:**  
Evitar que admin rebaje a otro admin.

## `src/modules/dashboard/data.ts`

**Que hace:**  
Carga datos para pantallas privadas.

**Que contiene:**  
Queries de dashboard, activos, obligaciones, documentos, equipo, configuracion, billing, opciones de formulario y detalle de obligacion; fallback demo si falta DB/empresa.

**Cuando tocarlo:**  
Para cambiar datos mostrados en pantallas dashboard.

**Antes de tocarlo, revisa:**  
`src/db/schema/index.ts`, `src/lib/auth/session.ts`, pantallas que consumen cada funcion.

**Puede afectar a:**  
Todas las pantallas privadas.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir conteo real de obligaciones por activo.

## `src/modules/demo/data.ts`

**Que hace:**  
Datos demo locales cuando no hay DB/empresa.

**Que contiene:**  
Empresa, miembros, sedes, tipos, activos, obligaciones, documentos, notificaciones y actividad demo.

**Cuando tocarlo:**  
Para cambiar experiencia local sin servicios.

**Antes de tocarlo, revisa:**  
`src/modules/dashboard/data.ts`, `src/db/seed/seed.ts`.

**Puede afectar a:**  
Modo demo local.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir obligacion demo vencida.

## `src/modules/billing/service.ts`

**Que hace:**  
Centraliza Stripe client y limites de plan.

**Que contiene:**  
`getStripeClient` y `getPlanLimits`.

**Cuando tocarlo:**  
Para cambiar planes/limites o configuracion Stripe server.

**Antes de tocarlo, revisa:**  
`src/app/api/stripe/webhook/route.ts`, `src/app/dashboard/facturacion/page.tsx`, `.env.example`.

**Puede afectar a:**  
Facturacion preparada y limites.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Cambiar limite de activos del plan starter.

## `src/modules/audit-log/service.ts`

**Que hace:**  
Inserta logs de actividad.

**Que contiene:**  
Tipo `ActivityAction` y `createActivityLog`.

**Cuando tocarlo:**  
Para añadir acciones auditables.

**Antes de tocarlo, revisa:**  
Server actions que llaman al servicio y tabla `activity_logs`.

**Puede afectar a:**  
Auditoria y actividad reciente.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir accion `asset.updated`.

## `src/modules/notifications/service.ts`

**Que hace:**  
Crea notificaciones por reglas de vencimiento.

**Que contiene:**  
`createDueNotificationsForCompany`, seleccion de obligaciones activas, recipients, idempotencia y deliveries email.

**Cuando tocarlo:**  
Para cambiar destinatarios, severidad o creacion de notificaciones.

**Antes de tocarlo, revisa:**  
`src/modules/reminders/service.ts`, `src/lib/date/obligations.ts`, `src/trigger/check-expirations.ts`.

**Puede afectar a:**  
Recordatorios, emails pendientes y duplicados.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Enviar solo a responsable y admins.

## `src/modules/reminders/service.ts`

**Que hace:**  
Define reglas por defecto e idempotencia de recordatorios.

**Que contiene:**  
`DEFAULT_REMINDER_DAYS`, `buildReminderType`, `buildDefaultReminderRules`, `isDuplicateReminderNotification`.

**Cuando tocarlo:**  
Para cambiar reglas base de aviso.

**Antes de tocarlo, revisa:**  
`src/modules/reminders/service.test.ts`, `src/modules/notifications/service.ts`, `src/modules/obligations/actions.ts`.

**Puede afectar a:**  
Nuevas obligaciones y notificaciones.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Quitar aviso de 90 dias.

## `src/modules/locations/service.ts`

**Que hace:**  
Lee sedes de una empresa.

**Que contiene:**  
`getLocationsForCompany`.

**Cuando tocarlo:**  
Si se amplia gestion de sedes.

**Antes de tocarlo, revisa:**  
`src/db/schema/index.ts`, `src/lib/validations/location.ts`.

**Puede afectar a:**  
Selects de sede y configuracion.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Ordenar por ciudad y nombre.

## `src/modules/obligation-types/service.ts`

**Que hace:**  
Lee tipos de obligacion visibles.

**Que contiene:**  
`getVisibleObligationTypes` con tipos globales o de empresa.

**Cuando tocarlo:**  
Para cambiar catalogo visible.

**Antes de tocarlo, revisa:**  
`src/db/schema/index.ts`, `src/lib/validations/obligation-type.ts`.

**Puede afectar a:**  
Formulario de obligaciones.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Filtrar por categoria.

## `src/modules/reports/service.ts`

**Que hace:**  
Resume estados de obligaciones para reportes.

**Que contiene:**  
`buildObligationStatusSummary`.

**Cuando tocarlo:**  
Para cambiar calculos de reportes.

**Antes de tocarlo, revisa:**  
`src/lib/date/obligations.ts`.

**Puede afectar a:**  
Reportes futuros y resumen mensual si se reutiliza.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Separar vencidas de criticas.

## Trigger y tareas programadas

## `src/trigger/check-expirations.ts`

**Que hace:**  
Tarea preparada para revisar vencimientos diariamente.

**Que contiene:**  
Schedule `0 7 * * *`, `checkExpirationsTask`, `checkSingleCompanyExpirations`.

**Cuando tocarlo:**  
Para cambiar frecuencia o batch de creacion de notificaciones.

**Antes de tocarlo, revisa:**  
`src/modules/notifications/service.ts`, `src/lib/env.ts`.

**Puede afectar a:**  
Notificaciones por vencimiento.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Ejecutar tambien a mediodia.

## `src/trigger/send-reminders.ts`

**Que hace:**  
Tarea preparada para enviar emails pendientes.

**Que contiene:**  
Schedule cada 15 minutos, resolucion de email via Supabase Admin, envio Resend y actualizacion de deliveries.

**Cuando tocarlo:**  
Para cambiar limite, destinatarios o plantillas de recordatorio.

**Antes de tocarlo, revisa:**  
`src/lib/email/client.ts`, `src/lib/email/templates.ts`, `src/modules/notifications/service.ts`.

**Puede afectar a:**  
Entregabilidad y duplicados de emails.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Aumentar `limit` o reintentos.

## `src/trigger/monthly-report.ts`

**Que hace:**  
Tarea preparada para enviar resumen mensual.

**Que contiene:**  
Schedule dia 1 a las 8:00, consulta de obligaciones/documentos y envio a owners/admins.

**Cuando tocarlo:**  
Para cambiar reportes mensuales.

**Antes de tocarlo, revisa:**  
`src/lib/email/templates.ts`, `src/lib/date/obligations.ts`, schema DB.

**Puede afectar a:**  
Emails mensuales y consultas batch.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Incluir activos sin obligaciones.

## Tipos compartidos

## `src/types/index.ts`

**Que hace:**  
Define tipos/enums compartidos de dominio.

**Que contiene:**  
Roles, estados de miembro, activos, obligaciones, prioridades, frecuencias, canales, severidades, planes y `ActionResult`.

**Cuando tocarlo:**  
Cuando se anada un estado, rol, plan o forma comun de respuesta.

**Antes de tocarlo, revisa:**  
`src/db/schema/index.ts`, `src/lib/permissions/index.ts`, validaciones Zod y server actions.

**Puede afectar a:**  
Tipos de toda la app, validaciones, permisos y DB.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir plan `pro`.

## Tests

## `src/components/layout/command-palette.test.ts`

**Que hace:**  
Prueba la logica de filtrado de command palette.

**Que contiene:**  
Tests de busqueda por label/hint y sin resultados.

**Cuando tocarlo:**  
Cuando cambien comandos o filtrado.

**Antes de tocarlo, revisa:**  
`src/components/layout/command-palette-data.ts`.

**Puede afectar a:**  
Confianza en navegacion rapida.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir test para comando nuevo.

## `src/lib/date/obligations.test.ts`

**Que hace:**  
Prueba helpers de fechas/estados.

**Que contiene:**  
Casos de vencido, urgente, proximo, formatos y recurrencias.

**Cuando tocarlo:**  
Cuando cambien umbrales o calculos de fechas.

**Antes de tocarlo, revisa:**  
`src/lib/date/obligations.ts`.

**Puede afectar a:**  
Dashboard, recordatorios y estados visuales.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Actualizar expectativa al cambiar `CRITICAL_DAYS`.

## `src/lib/permissions/index.test.ts`

**Que hace:**  
Prueba matriz de permisos.

**Que contiene:**  
Casos de roles, permisos y `assertSameCompany`.

**Cuando tocarlo:**  
Cuando cambie `src/lib/permissions/index.ts`.

**Antes de tocarlo, revisa:**  
Server actions y RLS.

**Puede afectar a:**  
Seguridad funcional.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Probar nuevo permiso `notifications:manage`.

## `src/lib/validations/document.test.ts`

**Que hace:**  
Prueba validacion de archivos.

**Que contiene:**  
Casos de MIME, tamaño y extension.

**Cuando tocarlo:**  
Cuando cambien formatos permitidos o limite de archivo.

**Antes de tocarlo, revisa:**  
`src/lib/validations/document.ts`, Storage policies.

**Puede afectar a:**  
Subida de documentos.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Añadir test para XLSX.

## `src/lib/validations/member.test.ts`

**Que hace:**  
Prueba validaciones de miembros.

**Que contiene:**  
Casos que impiden asignar `owner` y validan payloads.

**Cuando tocarlo:**  
Cuando cambien roles asignables.

**Antes de tocarlo, revisa:**  
`src/lib/validations/member.ts`, `src/modules/members/actions.ts`.

**Puede afectar a:**  
Seguridad de equipo.

**Nivel de riesgo:**  
Alto.

**Ejemplo de cambio tipico:**  
Añadir caso para rol no permitido por plan.

## `src/modules/reminders/service.test.ts`

**Que hace:**  
Prueba reglas de recordatorio.

**Que contiene:**  
Default reminder days y deteccion de duplicados.

**Cuando tocarlo:**  
Cuando cambien reglas o tipos de recordatorio.

**Antes de tocarlo, revisa:**  
`src/modules/reminders/service.ts`, `src/modules/notifications/service.ts`.

**Puede afectar a:**  
Notificaciones y emails.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
Actualizar lista esperada al cambiar dias por defecto.

## Documentacion

## `docs/IMPLEMENTATION_AUDIT.md`

**Que hace:**  
Recoge auditoria inicial, riesgos, cambios implementados, limitaciones y checklist beta.

**Que contiene:**  
Resumen tecnico, cambios de seguridad/calidad y tareas manuales Supabase/Vercel/Stripe/Resend/Trigger.

**Cuando tocarlo:**  
Cuando se cierre una limitacion o cambie checklist beta.

**Antes de tocarlo, revisa:**  
Estado real del repo y configuraciones externas.

**Puede afectar a:**  
Planificacion y traspaso, no runtime.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Marcar como resuelta una limitacion de Stripe.

## `docs/PROJECT_MAP.md`

**Que hace:**  
Mapa de carpetas y responsabilidades.

**Que contiene:**  
Arbol simplificado y explicacion por carpeta.

**Cuando tocarlo:**  
Cuando cambie estructura del repo.

**Antes de tocarlo, revisa:**  
`rg --files --hidden -g '!node_modules' -g '!.next' -g '!.git'`.

**Puede afectar a:**  
Orientacion del equipo.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Documentar una nueva carpeta `src/jobs`.

## `docs/FILE_GUIDE.md`

**Que hace:**  
Guia archivo por archivo.

**Que contiene:**  
Funcion, contenido, casos de cambio, relaciones, impacto y riesgo.

**Cuando tocarlo:**  
Cuando se anadan archivos relevantes o cambie responsabilidad de uno existente.

**Antes de tocarlo, revisa:**  
El codigo real del archivo documentado.

**Puede afectar a:**  
Orientacion del equipo.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir entrada para una nueva server action.

## `docs/COMMANDS.md`

**Que hace:**  
Chuleta de comandos reales.

**Que contiene:**  
Instalacion, dev, build, tests, DB, Trigger, CI y comandos peligrosos.

**Cuando tocarlo:**  
Cuando cambie `package.json` o CI.

**Antes de tocarlo, revisa:**  
`package.json`, `.github/workflows/ci.yml`, README.

**Puede afectar a:**  
Onboarding y verificacion local.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir comando de coverage si existe script.

## `docs/WHERE_TO_CHANGE_THINGS.md`

**Que hace:**  
Guia de cambios por objetivo.

**Que contiene:**  
Tablas de "quiero hacer X", rutas a tocar, riesgos y diagnosticos.

**Cuando tocarlo:**  
Cuando se creen nuevas areas de producto o cambien rutas criticas.

**Antes de tocarlo, revisa:**  
`docs/PROJECT_MAP.md`, `docs/FILE_GUIDE.md`.

**Puede afectar a:**  
Velocidad y seguridad al modificar el repo.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Añadir seccion para centro de notificaciones.

## Public

## `public/images/controla-hero.png`

**Que hace:**  
Asset publico de imagen.

**Que contiene:**  
Imagen PNG servida desde `/images/controla-hero.png`.

**Cuando tocarlo:**  
Si una pantalla publica vuelve a usar ese asset o se reemplaza la imagen.

**Antes de tocarlo, revisa:**  
`src/app/(marketing)/page.tsx`, `next.config.mjs`.

**Puede afectar a:**  
Peso visual publico y cache de navegador.

**Nivel de riesgo:**  
Bajo.

**Ejemplo de cambio tipico:**  
Sustituir hero por una imagen optimizada.

## Archivos generados o de bajo contacto

## `next-env.d.ts`

**Que hace:**  
Archivo generado por Next para tipos.

**Que contiene:**  
Referencias TypeScript de Next.

**Cuando tocarlo:**  
No deberias editarlo manualmente.

**Antes de tocarlo, revisa:**  
`next.config.mjs`, comandos de Next.

**Puede afectar a:**  
TypeScript si se edita mal.

**Nivel de riesgo:**  
Medio.

**Ejemplo de cambio tipico:**  
No aplica; generado automaticamente.
