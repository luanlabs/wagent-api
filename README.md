# wagent-api

REST API for **wagent**, a Stellar-based payment service. It handles merchant
accounts, API-key authentication, payment orders, supported tokens, currency
conversion, JWT auth with optional TOTP two-factor, and transactional email.

## Tech stack

- **Runtime:** Node.js 20+ (Docker image uses Node 24 LTS), TypeScript 5.9
- **Web:** Express 4
- **Database:** MongoDB via Mongoose 9
- **Auth:** JWT (`jsonwebtoken`), bcrypt password hashing (`bcryptjs`), TOTP 2FA (`speakeasy`)
- **Validation:** Zod
- **Stellar:** `@stellar/stellar-sdk` (address validation)
- **Email:** Nodemailer (SMTP)
- **Logging:** Bunyan
- **API docs:** Swagger / OpenAPI (`swagger-jsdoc` + `swagger-ui-express`)

## Prerequisites

- Node.js **>= 20** and npm
- A running **MongoDB** instance (local or remote)

## Getting started (local development)

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
#    then edit .env and fill in real values (see Environment variables below)

# 3. Start MongoDB (any local instance works), e.g. via Docker:
docker network create wagentapi # once, if it does not already exist
docker compose up -d mongo-wagent
#    set DB_URI=mongodb://localhost:27016 in .env for this Compose database

# 4. Run in watch mode (recompiles + restarts on change)
npm run dev
```

The server listens on `PORT` (default `5000`). Environment variables are loaded
from `.env` automatically (via `dotenv`) and validated on startup — the process
exits immediately if a required variable is missing.

## npm scripts

| Script                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Watch-compile (`tsc --watch`) and restart via nodemon |
| `npm run build`        | Compile TypeScript to `dist/`                         |
| `npm start`            | Run the compiled app (`node dist/index.js`)           |
| `npm run typecheck`    | Type-check without emitting                           |
| `npm test`             | Build and run logger and HTTP route tests             |
| `npm run lint`         | Lint with ESLint (flat config)                        |
| `npm run lint:fix`     | Lint and auto-fix                                     |
| `npm run format`       | Format with Prettier                                  |
| `npm run format:check` | Check formatting without writing                      |

## Build & run for production

```bash
npm ci
npm run build
NODE_ENV=production npm start
```

Logs always go to stdout, including in production. Production also writes the
same logs to `LOG_FILE_PATH`. HTTP request logs include the method, route template,
status, duration and request ID. Request bodies, headers, query strings and URL
tokens are excluded from these request logs.

`npm test` uses a temporary MongoDB instance with fresh data. Install `mongod`
locally, or set `MONGOD_BIN` to its executable path. Blux and SMTP are simulated;
tests never use the configured application database or send real emails.

## Docker

The API and MongoDB 7.0 are defined together in `compose.yaml`. The API waits for
MongoDB's health check before starting. Both use the external `wagentapi` network,
which is also shared with the transaction monitor.

Set `LOG_DIRNAME` and `LOG_FILENAME` in `.env` if needed. They default to `./logs`
and `api.log`.

```bash
# 1. Create the shared network once
docker network create wagentapi

# 2. Prepare the API log directory (use LOG_DIRNAME if customized)
mkdir -p ./logs
sudo chown 1000:1000 ./logs

# 3. Pull MongoDB, then build and start both services
docker compose pull mongo-wagent
docker compose up -d --build
```

If upgrading from the separate MongoDB Compose file, follow the data migration
below before running these commands.

The image is a multi-stage build on `node:24-alpine`, runs as the non-root
`node` user, ships only production dependencies, and defines a `HEALTHCHECK`
against `/health`.

Notes:

- Because the API runs as a **non-root** user, the host directory mounted for
  logs (`LOG_DIRNAME`) must be writable by UID `1000` (the `node` user).
- `swagger-jsdoc` reads its annotations from the TypeScript sources at runtime,
  so `src/swagger/**` is included in the runtime image on purpose.

### MongoDB version

Compose uses `mongo:7.0`. After changing the image version, run the pull and
startup commands above to recreate the container.

If MongoDB 8.0 already initialized the data directory, do not reuse those files
with 7.0. Community Edition does not support an in-place binary downgrade.
Restore a compatible MongoDB 7.0 backup into a separate data directory and keep
the original files. See [MongoDB's downgrade policy](https://www.mongodb.com/docs/v8.0/release-notes/8.0-downgrade/).

### Existing MongoDB container

The old file mounted the host data directory at `/data/db/data`, but MongoDB
stores its database at `/data/db` by default. The combined file corrects this to
`~/storage/mongodb/data:/data/db`. If the old container has data, it may be in an
anonymous Docker volume instead of the host directory.

Before recreating the old container, stop it and inspect its mounts:

```bash
docker stop mongo-wagent
docker inspect mongo-wagent --format '{{json .Mounts}}'
```

If it contains existing data, copy `/data/db` to a new backup directory while the
container is stopped:

```bash
mkdir -p ~/storage/mongodb/backup-before-merge
docker cp -a mongo-wagent:/data/db/. ~/storage/mongodb/backup-before-merge/
```

For a database last used by MongoDB 7.0, verify the backup and restore its files
into `~/storage/mongodb/data` before recreating the container. For 8.0 data, follow
the version notes above. Keep the backup and old volume until the API connects
and the expected records are confirmed. If the old container never initialized
and has no data, no restore is needed.

After checking or restoring the data, remove only the old container so Compose
can recreate it under the combined project:

```bash
docker rm mongo-wagent
docker compose pull mongo-wagent
docker compose up -d --build
```

## Environment variables

All variables are documented in [`.env.example`](./.env.example). The required
ones are validated at startup in [`src/config/envs.ts`](./src/config/envs.ts).
Highlights:

| Variable                   | Required | Purpose                                            |
| -------------------------- | -------- | -------------------------------------------------- |
| `PORT`                     | yes      | HTTP port                                          |
| `NODE_ENV`                 | yes      | `development` or `production`                      |
| `DB_URI`, `DB_NAME`        | yes      | MongoDB connection                                 |
| `JWT_SECRET`               | yes      | Signs 30-day JWTs — use a long random value        |
| `EMAIL_USER`, `EMAIL_PASS` | yes      | SMTP credentials (smtp.hostinger.com:587)          |
| `FRONTEND_URL`             | yes      | Base URL for email links                           |
| `PAYMENT_URL`              | yes      | Base URL returned for created orders               |
| `SWAGGER_API_URL`          | yes      | Server URL shown in Swagger UI                     |
| `LOG_FILE_PATH`            | yes      | Log file used in production                        |
| `ADMIN_PASSWORD`           | yes      | Currently required but unused (vestigial)          |
| `CORS_ORIGIN`              | no       | Comma-separated allowlist; defaults to all origins |

## API documentation

Interactive Swagger UI is served at:

```
GET /swagger
```

Two authentication schemes are used:

- **`apiKeyAuth`** — an `apiKey` request header (merchant API key). Used by
  `POST /orders`.
- **`bearerAuth`** — `Authorization: Bearer <JWT>`. Used by the authenticated
  user/admin endpoints.

## Health check

```
GET /health  ->  { "status": "ok", "db": "connected", "uptime": <seconds> }
```

Always returns `200` while the process is responsive; the `db` field reports the
Mongoose connection state. Used by the Docker `HEALTHCHECK`.

## Project structure

```
src/
  config/        env validation, db, logger
  constants/     static config (tokens, currencies, dates, email)
  middlewares/   auth, api-key, admin, validation, response envelope, asyncHandler
  models/        Mongoose models (User, Order, Token, Transaction, ...)
  routes/        HTTP route handlers (orders, tokens, users, users/auth, swagger)
  swagger/       OpenAPI JSDoc annotations (read at runtime)
  templates/     HTML email templates
  utils/         helpers (jwt, email, currency conversion, authenticator, ...)
  index.ts       app bootstrap
```

## Known limitations

These are pre-existing behaviours intentionally left unchanged. Review before
relying on them:

- **`src/utils/contract/getTransactionDetails.ts` is a stub** (returns hardcoded
  values) and is not imported anywhere.
- **Public payment endpoints have no JWT auth by design:** `GET/PUT/DELETE
/orders/:id` and `PUT /users/subscription` are reachable with only an order id
  / capability token, which the public payment page relies on. If you need to
  lock these down, do so deliberately and update the payment frontend.
