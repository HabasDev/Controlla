import postgres from "postgres";

import { loadEnvFiles } from "@/server/env/load-env-files";

loadEnvFiles();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL no esta configurado.");
    process.exitCode = 1;
    return;
  }

  const client = postgres(databaseUrl, {
    max: 1,
    prepare: false
  });

  try {
    await client`select 1`;
    console.log("Conexion a base de datos OK.");
  } catch (error) {
    console.error(error instanceof Error ? `No se pudo conectar a la base de datos: ${error.message}` : "No se pudo conectar a la base de datos.");
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

void main();
