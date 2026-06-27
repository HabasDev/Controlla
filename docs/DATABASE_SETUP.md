# Database Setup

Guia practica para conectar Controlla a Supabase + PostgreSQL + Drizzle.

## Estado actual

El proyecto esta preparado para DB real, pero este entorno no tiene credenciales configuradas:

- `DATABASE_URL` vacia.
- Supabase URL/anon key vacias.
- Service role vacia.
- Supabase CLI no instalada.
- Docker no instalado o no disponible en PATH.

## Opcion A: Supabase local

Requisitos:

- Docker Desktop activo.
- Supabase CLI instalada.

En este entorno no se pudo verificar `supabase start` porque `supabase` y `docker` no existen en PATH.

Cuando lo tengas instalado:

```bash
npm install
supabase start
supabase status
```

Copia las variables que muestre `supabase status` a `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Despues:

```bash
npm run db:check
npm run db:migrate
npm run db:seed
npm run dev
```

No ejecutes `supabase db reset` salvo que quieras borrar y recrear la DB local.

## Opcion B: Supabase remoto de desarrollo

1. Crea un proyecto Supabase de desarrollo, no produccion.
2. Copia Project URL a `NEXT_PUBLIC_SUPABASE_URL`.
3. Copia anon public key a `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copia service role key a `SUPABASE_SERVICE_ROLE_KEY`. No la expongas como `NEXT_PUBLIC_*`.
5. Copia la connection string Postgres a `DATABASE_URL`.
6. Guarda todo en `.env.local`.
7. Verifica conexion:

```bash
npm run db:check
```

8. Aplica migraciones:

```bash
npm run db:migrate
```

9. Revisa en Supabase que existe el bucket privado `company-documents`.
10. Ejecuta seed solo si el entorno es local/staging:

```bash
npm run db:seed
```

11. Levanta la app:

```bash
npm run dev
```

12. Crea usuario de prueba.
13. Crea dos empresas.
14. Comprueba que usuario A no ve datos de empresa B.

## Produccion

Antes de produccion:

1. Usa un proyecto Supabase separado.
2. Haz backup o snapshot antes de migrar.
3. Revisa SQL generado antes de aplicarlo.
4. Configura variables en Vercel.
5. Ejecuta migraciones contra produccion con cuidado.
6. Verifica RLS con dos usuarios de empresas distintas.
7. Verifica que `company-documents` no es publico.
8. Configura Stripe/Resend/Trigger.dev solo con claves reales.

## Comandos reales del proyecto

```bash
npm run db:check
npm run db:generate
npm run db:migrate
npm run db:seed
```

Nota: no apliques una migracion generada sin revisar el SQL. En este repo, la migracion inicial es
manual y contiene RLS/Storage; si `db:generate` produce otra `0000_*` que duplica tablas, hay que
descartarla o rehacer la baseline de Drizzle antes de migrar.

No existe `npm run db:studio` en este momento.
