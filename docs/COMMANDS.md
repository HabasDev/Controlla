# Commands

Chuleta de comandos reales del proyecto. Solo se incluyen comandos presentes en `package.json`, README o configuracion del repositorio.

## Primera instalacion

```bash
npm install
```

Instala dependencias. Para CI o una instalacion reproducible usa `npm ci` si ya existe `package-lock.json`.

```bash
cp .env.example .env.local
```

Crea el archivo local de variables. En Windows PowerShell puedes usar:

```powershell
Copy-Item .env.example .env.local
```

Despues rellena, como minimo para entorno real:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` si necesitas invitaciones, Storage o seed.

```bash
npm run dev
```

Levanta Next.js en desarrollo.

## Levantar el proyecto

```bash
npm run dev
```

Arranca el servidor de desarrollo. Abre:

```text
http://localhost:3000
```

```bash
npm run build
```

Crea el build de produccion.

```bash
npm run start
```

Sirve el build de produccion local. Antes debe existir un build generado con `npm run build`.

Para detener el servidor si esta en la terminal activa, usa `Ctrl+C`.

Si lo lanzaste en segundo plano en Windows y necesitas localizarlo:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen
```

Despues puedes detener el proceso asociado con cuidado:

```powershell
Stop-Process -Id <PID>
```

No hay script especifico de limpieza de cache en `package.json`. Si sospechas de cache de Next, para desarrollo local puedes borrar `.next`, pero no lo hagas mientras `next dev` este usando archivos en Windows.

## Comprobar que no has roto nada

```bash
npm run typecheck
```

Ejecuta `next typegen` y despues TypeScript con `tsconfig.typecheck.json`. Usalo tras tocar rutas, server actions, tipos, formularios, DB o imports.

```bash
npm run lint
```

Ejecuta ESLint. Usalo tras tocar React/Next/TypeScript.

```bash
npm run test
```

Ejecuta Vitest una vez. Actualmente cubre fechas, permisos, validaciones, recordatorios y command palette.

```bash
npm run build
```

Compila Next.js en modo produccion. Es el comando que mejor detecta problemas de server/client components, rutas dinamicas y prerender.

Orden recomendado antes de push:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Base de datos

```bash
npm run db:check
```

Ejecuta `tsx src/db/check.ts` y comprueba que `DATABASE_URL` existe y responde con `select 1`. No imprime secretos.

```bash
npm run db:generate
```

Ejecuta `drizzle-kit generate`. Genera migraciones a partir de `src/db/schema/index.ts` usando `drizzle.config.ts`.

```bash
npm run db:migrate
```

Ejecuta `drizzle-kit migrate`. Aplica migraciones de `src/db/migrations` contra `DATABASE_URL`.

```bash
npm run db:seed
```

Ejecuta `tsx src/db/seed/seed.ts`. Crea usuarios/empresa/datos demo reales usando DB y Supabase Admin.

No existe script `db:studio` en `package.json`. Drizzle Studio no esta expuesto como comando del proyecto.

## Trigger.dev

No hay comandos de Trigger.dev en `package.json`.

Las funciones preparadas estan en:

- `src/trigger/check-expirations.ts`
- `src/trigger/send-reminders.ts`
- `src/trigger/monthly-report.ts`

Existe base tecnica, falta configuracion/registro en el runtime final de Trigger.dev.

## Tests

```bash
npm run test
```

Ejecuta todos los tests incluidos por `vitest.config.ts`: `src/**/*.test.ts`.

```bash
npm run test:watch
```

Ejecuta Vitest en modo watch.

Para lanzar un archivo concreto, no hay script dedicado, pero puedes usar el binario instalado:

```bash
npx vitest run src/lib/date/obligations.test.ts
```

No existe script de coverage en `package.json`.

Tests actuales:

- `src/components/layout/command-palette.test.ts`
- `src/lib/date/obligations.test.ts`
- `src/lib/permissions/index.test.ts`
- `src/lib/validations/document.test.ts`
- `src/lib/validations/member.test.ts`
- `src/modules/reminders/service.test.ts`

## Git y CI

La CI esta en:

```text
.github/workflows/ci.yml
```

Se ejecuta en `push` y `pull_request`:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Si falla CI:

- Fallo en `npm ci`: revisa `package-lock.json`, version de Node y dependencias.
- Fallo en `typecheck`: revisa tipos, imports, rutas Next y server/client boundaries.
- Fallo en `lint`: revisa reglas de ESLint y codigo no usado.
- Fallo en `test`: revisa el test indicado y el cambio de logica relacionado.
- Fallo en `build`: revisa paginas de `src/app`, APIs, uso de server-only/client components y variables necesarias para build.

## Comandos que no debes usar a la ligera

```bash
npm run db:migrate
```

Aplica cambios reales a la base indicada por `DATABASE_URL`. En produccion puede cambiar tablas, RLS, funciones y Storage policies.

```bash
npm run db:seed
```

Crea datos demo reales y usuarios Supabase Admin. No lo ejecutes contra produccion salvo decision consciente.

```bash
npm run db:generate
```

Genera migraciones desde el schema actual. Revisa el SQL resultante antes de aplicarlo.

```bash
npm run build
```

No es peligroso para datos, pero puede consumir tiempo y generar `.next`. Si hay un `next dev` activo en Windows, evita borrar `.next` al mismo tiempo.

## Variables y configuracion relacionadas

- `.env.example`: plantilla de variables.
- `src/lib/env.ts`: lectura centralizada y avisos runtime.
- `drizzle.config.ts`: usa `DATABASE_URL`.
- `src/lib/supabase/*`: usa Supabase URL/keys.
- `src/lib/email/client.ts`: usa `RESEND_API_KEY`.
- `src/modules/billing/service.ts` y `src/app/api/stripe/webhook/route.ts`: usan Stripe.
- `instrumentation.ts` y `sentry.*.config.ts`: usan Sentry.
