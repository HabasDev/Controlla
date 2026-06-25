# Contributing

## Local setup

1. Use Node 20 (`.nvmrc`).
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` and fill only the services you need.
4. Run `npm run dev`.

## Before opening a PR

Run:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Engineering rules

- Keep tenant isolation server-side; never trust `company_id`, `user_id`, role or permissions from the client.
- Do not expose server secrets through `NEXT_PUBLIC_*`.
- Validate server actions with Zod.
- Prefer small, focused changes with tests for security-sensitive behavior.
- If an external service is missing, degrade clearly and safely.
