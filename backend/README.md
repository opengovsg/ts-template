## DB Quick Guide

Migrations are stored in `./src/database/migrations`.

Seed data is stored in `./src/database/seeds`.

### Quick Start

Common commands:

- `npm run migration:show` - show status of current migrations database (Readonly action)
- `npm run migration:run` - sync your database to the existing schema with the
  migrations in `./src/database/migrations`.
- `npm run migration:revert` - revert a migration
- `npm run seed` - populate your data on a fresh database

Commands can be prefixed with `ENV={environment} ...`, eg `ENV=uat npm run migration:status` to target a particular
environment.

### How To Create DB Migrations

Prerequisite: make sure that your database is synced with the current schema (
in `./src/database/entities`) with `npm run migration:run`.

1. Edit the entities in `entities` according to your new requirements.
2. Run `npm run migration:gen <migration-name>`, which will generate a migration file of the diff of the edited schema
   and the existing database schema
   into `./src/database/migrations/<timestamp>-<migration-name>`.
3. Run `npm run migration:run` to sync your database to the new schema.

## `.env` file loading

`dotenv` is used to load env variables
according to the environment name. This is to reduce the need for
editing one common `.env` file when working across environments.

### How to use

You should have a single `.env` file for each environment.

```
./
 ├── .env.development
 ├── .env.staging
 ├── .env.uat
 └── .env.prod (in the future)
```

Prefix your bash commands with `ENV={ENV}` to load the correct file. Eg. `ENV=staging npm run ...` will load values
from `.env.staging` and `ENV=uat npm run ... ` will load `.env.uat`.

Similarly for migrations, prefix your desired environment `ENV=uat npm run migration:run`.

By default, `ENV=development` is selected when `ENV` is not specified in the bash command.

### Loading precedence

Env files are loaded in order of:

- `.env` # avoid using this as it is loaded for all environments
- `.env.local` # avoid using this as it is loaded for all environments
- `.env.<environment>`
- `.env.<environment>.local`
  where the variables in the last file overrides all else.

We should avoid using `.env` and `.env.local` as they are loaded for all environments but can be overwritten
by other files, which can cause confusion and ENV variable pollution.

You can have your own environment specific manual overrides by editing `.env.<environment>.local`.

### Pulling from AWS

Use `ENV=${env} npm run env:sync`, to pull
latest env vars from AWS into `.env.${env}` file.

Eg. `ENV=uat npm run env:sync` to generate `.env.uat`.

Note that you will need to configure your AWS credentials within the CLI.
