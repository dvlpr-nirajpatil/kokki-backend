# Environment setup

The API has three configuration files. Each command loads one file directly:

| Environment | Configuration file | Start command              | Migration command             |
| ----------- | ------------------ | -------------------------- | ----------------------------- |
| Development | `.env.development` | `npm run dev`              | `npm run migrate:development` |
| UAT         | `.env.uat`         | `npm run start:uat`        | `npm run migrate:uat`         |
| Production  | `.env.production`  | `npm run start:production` | `npm run migrate:production`  |

The files do not contain `NODE_ENV` or another environment selector. The npm
command selects the environment with the `--env` argument, and the application
loads only that environment's file. There are no `.env` or `.local` fallbacks.
When no `--env` argument is present, the application does not load any file and
uses the values already available in `process.env`.

## Create the files

Copy each committed template once, then replace every placeholder:

```sh
cp .env.development.example .env.development
cp .env.uat.example .env.uat
cp .env.production.example .env.production
```

The three working files are ignored by Git because they contain secrets. The
`.example` templates are safe to commit and should be updated when a new
configuration key is added.

Tests use `.env.development` and keep Jest's internal `test` runtime mode.

## Vercel deployment

Do not upload or create `.env.*` files on Vercel. Add every configuration key
and value under Project Settings → Environment Variables; do not create one
multiline variable named `.env`. Vercel injects those values directly into the
application, so the file loader is skipped during builds and function execution.

The Vercel environments map to this project as follows:

| Vercel environment | Application environment |
| ------------------ | ----------------------- |
| Development        | Development             |
| Preview            | UAT                     |
| Custom `uat`       | UAT                     |
| Production         | Production              |

Assign UAT credentials to Vercel's Preview environment (or a custom `uat`
environment) and production credentials only to Production. Redeploy after
adding or changing variables because existing deployments are not updated. Keep
Vercel's “Automatically expose System Environment Variables” setting enabled so
the application receives `VERCEL_ENV` and `VERCEL_TARGET_ENV`.

Vercel deployments write structured logs to stdout/stderr and do not create
local log files. View UAT output in the project's Logs tab with the environment
or deployment filter set to Preview. UAT request logs, including `/health`, are
emitted at the `info` level; production health requests remain suppressed.

## Database configuration

Development can use the individual `DB_HOST`, `DB_PORT`, `DB_USER`,
`DB_PASSWORD`, and `DB_NAME` fields shown in `.env.development.example`.

UAT and production should normally use their own `DATABASE_URL`. Their templates
explicitly enable SSL with `DB_SSL=true`. Keep
`DB_SSL_REJECT_UNAUTHORIZED=true` unless the database provider explicitly
requires a different setting.

Run production migrations as a controlled release step from one process only.
Take a database backup before destructive migrations, and never run development
seeds against UAT or production.
