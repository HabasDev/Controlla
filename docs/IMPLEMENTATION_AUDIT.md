# Implementation Audit

Fecha: 2026-06-25

## Auditoria inicial

- Stack confirmado: Next.js App Router, TypeScript estricto, Tailwind, Supabase, Drizzle, Zod, React Hook Form, Stripe, Resend, Trigger.dev, Sentry opcional y Vitest.
- Rutas publicas: marketing (`/`), login, registro, recuperacion de password y onboarding.
- Rutas privadas previstas: `/dashboard`, activos, obligaciones, documentos, equipo, configuracion y facturacion.
- APIs: health, webhook Stripe y URL firmada de documentos.
- Server actions revisadas: activos, obligaciones, documentos, miembros, empresas y auth.
- Modelo multiempresa: `company_id` en tablas de negocio, membresia activa por usuario y politicas RLS en la migracion inicial.
- Storage privado: bucket `company-documents`, rutas `companies/{company_id}/documents/{document_id}/{filename}` y descargas con URL firmada.
- Tests iniciales: permisos, fechas y recordatorios.

## Riesgos encontrados

- `npm run typecheck` fallaba si `.next/types` no existia antes de ejecutar TypeScript.
- `npm run lint` fallaba por una referencia generada en `next-env.d.ts`.
- El webhook de Stripe respondia `200` cuando Stripe no estaba configurado, ocultando una configuracion rota.
- La validacion de documentos comprobaba MIME y tamano, pero no extension coherente ni longitud de nombre.
- Las acciones de equipo dependian demasiado del tipado TypeScript del cliente y no validaban el payload runtime con Zod.
- Las acciones de equipo permitian intentar operar sobre el propietario; la base/RLS ayuda, pero la app necesitaba fallo explicito.
- Borrar documentos no pedia confirmacion.
- El dashboard ejecutivo no separaba claramente vencido, vence hoy, 7 dias, 30 dias y documentos.
- `npm ci` quedo bloqueado inicialmente por un `next dev` activo manteniendo SWC abierto en Windows.

## Cambios implementados

- `typecheck` ahora ejecuta `next typegen` antes de `tsc --noEmit`.
- ESLint ignora `next-env.d.ts`, que es generado por Next.
- Se anadio `engines` en `package.json` y `.nvmrc` con Node 20.
- Se anadio CI en GitHub Actions con `npm ci`, typecheck, lint, test y build.
- Se endurecio `validateDocumentFile`:
  - MIME permitido;
  - tamano maximo 10 MB;
  - archivo no vacio;
  - nombre entre 1 y 180 caracteres;
  - extension coherente con MIME.
- Se limito el nombre sanitizado que se envia a Storage.
- Las acciones de miembros ahora validan payload con Zod.
- No se puede asignar `owner` por invitacion ni cambio de rol.
- No se puede cambiar, desactivar o eliminar al propietario desde las acciones de equipo.
- El webhook de Stripe falla cerrado con `503` si Stripe no esta configurado.
- La eliminacion de documentos pide confirmacion en el navegador.
- El dashboard muestra vencidas, vence hoy, 7 dias, 30 dias y documentos, con accesos rapidos a obligacion, activo y documento.
- Se mejoro `.env.example` con separacion de variables obligatorias, opcionales y server-only.
- Se anadieron tests para validacion de documentos y roles de miembros.

## Cambios descartados y por que

- No se modificaron migraciones RLS ya aplicadas: son extensas y coherentes con el modelo actual; cambiarlas sin una base Supabase real puede ser mas arriesgado que beneficioso.
- No se implementaron pagos reales: faltan claves, productos/precios de Stripe y decisiones comerciales finales.
- No se implemento Trigger.dev real: las tareas existen, pero registrar jobs depende del runtime y entorno final.
- No se anadio OCR, WhatsApp, ERP ni integraciones externas: requieren claves, alcance de producto y coste operativo.
- No se hizo una reescritura de UI o arquitectura: el objetivo era elevar seguridad/calidad sin romper el stack.

## Limitaciones abiertas

- No hay pruebas de integracion contra Supabase real con RLS. La validacion actual es unitaria y de build.
- El modelo de suscripciones sigue preparado, no operativo para cobros reales.
- Algunas rutas de dashboard usan datos demo si faltan Supabase o base de datos; esto es util en desarrollo, pero produccion debe configurar variables obligatorias.
- Las notificaciones y entregas de email necesitan entorno Resend real para validar entregabilidad.
- Falta un centro de notificaciones completo con marcar como leida.
- Falta vista de auditoria para administradores, aunque `activity_logs` y escrituras de acciones principales ya existen.
- Algunas acciones de dominio siguen sin paginacion avanzada para grandes volumenes.

## Instrucciones manuales

### Supabase

1. Crear proyecto y configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Configurar `DATABASE_URL` con la cadena de conexion Postgres.
3. Ejecutar `npm run db:migrate`.
4. Verificar que el bucket privado `company-documents` existe y que no es publico.
5. Revisar politicas RLS en Supabase antes de beta con dos usuarios de empresas distintas.

### Vercel

1. Importar el repo.
2. Usar Node 20.
3. Configurar variables de entorno reales.
4. Ejecutar build y validar rutas privadas tras login.

### Stripe

1. Crear productos/precios reales.
2. Configurar `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Apuntar webhook a `/api/stripe/webhook`.
4. Probar firmas con Stripe CLI antes de produccion.

### Resend

1. Verificar dominio.
2. Configurar `RESEND_API_KEY` y `EMAIL_FROM`.
3. Probar recordatorios con una empresa demo.

### Trigger.dev

1. Registrar las tareas de `src/trigger`.
2. Configurar cron y `TRIGGER_SECRET_KEY`.
3. Validar idempotencia de recordatorios.

### GitHub

1. Confirmar que Actions queda habilitado.
2. Proteger `main` cuando empiece la beta.

## Checklist beta privada

- [ ] Ejecutar migraciones en Supabase de staging.
- [ ] Crear dos empresas y probar aislamiento con usuarios distintos.
- [ ] Probar subida, descarga firmada y borrado de documento.
- [ ] Probar invitacion y cambio de rol.
- [ ] Probar alta de obligacion recurrente y renovacion.
- [ ] Probar build en Vercel con variables reales.
- [ ] Probar webhook Stripe con firma valida e invalida.
- [ ] Probar Resend con dominio verificado.
- [ ] Configurar backups de base de datos.
- [ ] Revisar textos legales, privacidad y terminos antes de cobrar.

## Siguiente semana

1. Tests de integracion con Supabase local/staging para RLS y aislamiento multiempresa.
2. Centro de notificaciones con marcar como leida y enlace a obligacion.
3. Vista de auditoria para admins con filtros por entidad/usuario.
4. Flujo de checkout/portal Stripe real con productos configurados por entorno.
5. Paginacion y filtros server-side en obligaciones, documentos y activos.
