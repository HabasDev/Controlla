import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

type LoadEnvOptions = {
  cwd?: string;
  files?: string[];
};

function parseEnvLine(line: string) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const normalized = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
  const separator = normalized.indexOf("=");

  if (separator <= 0) {
    return null;
  }

  const key = normalized.slice(0, separator).trim();
  let value = normalized.slice(separator + 1).trim();

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    return null;
  }

  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

export function loadEnvFiles(options: LoadEnvOptions = {}) {
  const cwd = options.cwd ?? process.cwd();
  const files = options.files ?? [".env", ".env.local"];
  const shellKeys = new Set(Object.keys(process.env));
  const loaded: string[] = [];

  for (const file of files) {
    const path = resolve(cwd, file);

    if (!existsSync(path)) {
      continue;
    }

    const content = readFileSync(path, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);

      if (!parsed || shellKeys.has(parsed.key)) {
        continue;
      }

      process.env[parsed.key] = parsed.value;
    }

    loaded.push(file);
  }

  return loaded;
}
