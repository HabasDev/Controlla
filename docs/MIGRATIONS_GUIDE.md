# Migrations Guide

## Flujo correcto

1. Cambia `src/db/schema/index.ts`.
2. Genera migracion:

```bash
npm run db:generate
```

3. Revisa el SQL generado en `src/db/migrations`.
4. Comprueba que no hay operaciones destructivas no deseadas.
5. Si Drizzle genera otra migracion `0000_*` que duplica `0000_initial.sql`, no la apliques. La
   migracion inicial contiene SQL manual de RLS/Storage que debe conservarse.
6. Verifica conexion:

```bash
npm run db:check
```

7. Aplica migracion local/staging:

```bash
npm run db:migrate
```

8. Ejecuta checks:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

9. Prueba UI y permisos.
10. Solo despues aplica a produccion con backup.

## RLS

Si anades una tabla multiempresa, la migracion debe incluir:

- `company_id` si corresponde.
- Foreign keys.
- Indices por `company_id`.
- `alter table ... enable row level security`.
- Policies de select/insert/update/delete.
- Tests/manual QA con dos empresas.

## Storage

Si cambias documentos:

- Revisa bucket `company-documents`.
- Revisa `src/lib/storage/documents.ts`.
- Revisa `src/lib/validations/document.ts`.
- Revisa policies de `storage.objects`.

## Comandos peligrosos

```bash
npm run db:migrate
```

Aplica cambios reales a la DB de `DATABASE_URL`.

```bash
npm run db:seed
```

Crea usuarios/datos demo reales. No usar en produccion.

## No existe actualmente

No existe script:

```bash
npm run db:studio
```

No lo documentes como disponible hasta añadirlo y verificarlo.
