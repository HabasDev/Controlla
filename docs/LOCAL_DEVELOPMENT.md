# Local Development

## Que instalar

- Node.js 20 o superior.
- npm.
- Docker Desktop si quieres Supabase local.
- Supabase CLI si quieres Supabase local.

En este entorno actual no se encontro:

- `supabase`
- `docker`
- `psql`

## Variables

Crea `.env.local` desde `.env.example`:

```powershell
Copy-Item .env.example .env.local
```

Minimo para app real:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Levantar Next.js

```bash
npm run dev
```

Abre:

```text
http://localhost:3000
```

En PowerShell, si `npm.ps1` esta bloqueado:

```powershell
npm.cmd run dev
```

## Comprobar DB

```bash
npm run db:check
```

Si falta `DATABASE_URL`, veras:

```text
DATABASE_URL no esta configurado.
```

## Migrar y seed

```bash
npm run db:migrate
npm run db:seed
```

No ejecutes seed contra produccion.

## Tests y build

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Si Docker no esta activo

Supabase local no arrancara. Abre Docker Desktop y espera a que el motor este listo.

## Si Supabase CLI no existe

Instala Supabase CLI y verifica:

```bash
supabase --version
```

## Si el puerto esta ocupado

En PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen
```

Si sabes que el proceso es el dev server que quieres cerrar:

```powershell
Stop-Process -Id <PID>
```

## Si `.next` da problemas en Windows

1. Para `next dev`.
2. Comprueba que no quedan procesos en puerto 3000.
3. Borra `.next`.
4. Ejecuta de nuevo `npm run dev`.

No borres `.next` mientras `next dev` este activo.
