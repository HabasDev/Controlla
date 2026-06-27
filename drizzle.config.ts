import { defineConfig } from "drizzle-kit";

import { loadEnvFiles } from "./src/server/env/load-env-files";

loadEnvFiles();

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? ""
  },
  strict: true,
  verbose: true
});
