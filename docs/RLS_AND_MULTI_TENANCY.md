# RLS And Multi Tenancy

## Modelo multiempresa

La separacion principal es por `company_id`.

Tablas multiempresa:

- `companies`
- `company_members`
- `locations`
- `assets`
- `obligation_types` cuando `company_id` no es null
- `obligations`
- `reminder_rules`
- `documents`
- `notifications`
- `activity_logs`
- `subscriptions`

Tablas auxiliares:

- `profiles`: perfil por usuario Supabase.
- `notification_deliveries`: cuelga de `notifications`.

## Usuarios, empresas y membresias

- Supabase Auth gestiona usuarios.
- `profiles.id` coincide con `auth.users.id`.
- `company_members` relaciona usuario con empresa, rol y estado.
- La empresa activa se guarda en cookie `controla_company_id`.
- `getCurrentCompany()` solo devuelve empresas donde el usuario es miembro activo.

Archivos clave:

- `src/lib/auth/session.ts`
- `src/lib/permissions/index.ts`
- `src/db/schema/index.ts`
- `src/db/migrations/0000_initial.sql`

## Permisos de aplicacion

Las server actions no deben confiar en `companyId`, `userId` ni `role` enviados desde cliente.

Patron obligatorio:

```ts
await requirePermission(companyId, "obligations:manage");
```

Despues se validan referencias: activo, sede, responsable, obligacion o documento deben pertenecer a la misma empresa.

## Donde esta RLS

RLS esta en:

```text
src/db/migrations/0000_initial.sql
```

Funciones SQL importantes:

- `public.is_company_member`
- `public.has_company_role`
- `public.can_access_notification`
- `public.storage_company_id`

## Proteccion por tabla

- `companies`: miembros leen, admins actualizan, owner borra.
- `company_members`: miembros leen; admins insertan/actualizan/borran con restricciones.
- `locations`: miembros leen; manager+ gestiona; admin+ borra.
- `assets`: miembros leen; manager/member permitidos segun policy; admin+ borra.
- `obligation_types`: globales visibles; tipos de empresa protegidos por membresia/rol.
- `obligations`: miembros leen; manager/member permitidos segun policy; admin+ borra.
- `reminder_rules`: miembros leen; manager+ gestiona.
- `documents`: miembros leen; manager/member permitidos segun policy; admin/manager/member borra segun policy.
- `notifications`: usuario destinatario lee/actualiza; inserts protegidos por membresia.
- `activity_logs`: miembros leen e insertan logs de su empresa.
- `subscriptions`: miembros leen; owner/admin inserta/actualiza.

## Documentos y Storage

Bucket:

```text
company-documents
```

Ruta:

```text
companies/{company_id}/documents/{document_id}/{filename}
```

La URL publica permanente no se usa. Las descargas pasan por:

```text
src/app/api/documents/[documentId]/signed-url/route.ts
```

Esa API:

1. Busca el documento.
2. Exige `documents:read` sobre `document.companyId`.
3. Genera URL firmada con `src/lib/storage/documents.ts`.

## Como probar aislamiento

1. Crea usuario A.
2. Crea empresa A.
3. Crea obligacion/documento/activo A.
4. Crea usuario B.
5. Crea empresa B.
6. Inicia sesion como B.
7. Intenta abrir URLs directas de recursos A.
8. Debe devolver no encontrado, sin permisos o no mostrar datos.
9. Repite para signed URL de documentos.

No basta con ocultar elementos en UI. Debe fallar server action/API/query/RLS.

## Riesgos

- Cualquier query sin filtro por `companyId` puede exponer datos si se ejecuta con service role o fuera de RLS.
- Cualquier uso de `SUPABASE_SERVICE_ROLE_KEY` debe quedarse en servidor.
- Cualquier cambio de RLS requiere prueba con dos empresas.
- No cambies `storage_company_id` sin revisar paths de `src/lib/storage/documents.ts`.
