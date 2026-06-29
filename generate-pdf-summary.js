import fs from 'fs';
import path from 'path';

const outFile = path.join(process.cwd(), 'project-file-summary.pdf');
const lines = [
  'Controla Project File Summary',
  '',
  '.env.example - Plantilla de variables de entorno que describe las claves necesarias para Supabase, database, storage, email y servicios externos.',
  'package.json - Define scripts de desarrollo, test, build y DB, además de dependencias y engines de Node.',
  'package-lock.json - Bloquea las versiones exactas de todos los paquetes npm para builds reproducibles.',
  'tsconfig.json - Configura TypeScript para Next.js, habilita strict, paths alias @/* y noEmit.',
  'vitest.config.ts - Configura Vitest para ejecutar tests en entorno Node con include de src/**/*.test.ts y alias @.',
  'next.config.mjs - Configuración de Next.js con typedRoutes y formatos de imagen AVIF/WebP.',
  'drizzle.config.ts - Configura Drizzle Kit para generar y aplicar migraciones PostgreSQL usando DATABASE_URL.',
  'README.md - Documentación principal del proyecto con instrucciones de instalación, despliegue y arquitecturas clave.',
  'docs/FILE_GUIDE.md - Guía práctica que explica qué hace cada archivo importante y cuándo cambiarlo.',
  'docs/DATABASE_SETUP.md - Guía de configuración de la base de datos y Supabase para este proyecto.',
  'components.json - Configuración para componentes UI y convenciones de shadcn/ui.',
  'src/app/dashboard/facturacion/page.tsx - Página de facturación del dashboard; ejemplo de ruta y UI en la app.',
  'src/db/schema/index.ts - Esquema principal de Drizzle ORM para las tablas y relaciones de PostgreSQL.',
  'src/db/migrations/0000_initial.sql - Migración inicial que crea tablas, RLS y bucket Storage para Supabase.',
];

function escapePdfText(text) {
  return text.replace(/([\\()])/g, '\\$1');
}

const pdfLines = [
  '%PDF-1.3',
  '1 0 obj',
  '<< /Type /Catalog /Pages 2 0 R >>',
  'endobj',
  '2 0 obj',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  'endobj',
  '3 0 obj',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
  'endobj',
  '4 0 obj',
  `<< /Length ${lines.reduce((acc, line) => acc + line.length + 5, 0)} >>`,
  'stream',
  'BT',
  '/F1 12 Tf',
  '50 740 Td',
  ...lines.flatMap((line, index) => {
    const escaped = escapePdfText(line);
    return [`(${escaped}) Tj`, '0 -18 Td'];
  }).slice(0, -1),
  'ET',
  'endstream',
  'endobj',
  '5 0 obj',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  'endobj',
];

let pdfContent = pdfLines.join('\n') + '\n';
const xrefOffset = Buffer.byteLength(pdfContent, 'utf8');
const xref = [
  'xref',
  '0 6',
  '0000000000 65535 f ',
  '0000000010 00000 n ',
  '0000000060 00000 n ',
  '0000000113 00000 n ',
  '0000000200 00000 n ',
  '0000000305 00000 n ',
].join('\n');
pdfContent += xref + '\n';
pdfContent += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
fs.writeFileSync(outFile, pdfContent, 'binary');
console.log('PDF generated at', outFile);
