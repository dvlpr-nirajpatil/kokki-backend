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
