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
- **Push:** Firebase Admin (see [Known limitations](#known-limitations))
- **Logging:** Bunyan
- **API docs:** Swagger / OpenAPI (`swagger-jsdoc` + `swagger-ui-express`)

## Prerequisites

- Node.js **>= 20** and npm
- A running **MongoDB** instance (local or remote)
- A **Firebase** service-account JSON file (its path is a required env var)
- API key for **CurrencyBeacon** (used as the currency-rate fallback)

## Getting started (local development)

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
#    then edit .env and fill in real values (see Environment variables below)

# 3. Start MongoDB (any local instance works), e.g. via Docker:
docker compose -f compose.mongodb.yaml up -d   # requires the external network (see Docker section)

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

In production (`NODE_ENV=production`) logs are written to `LOG_FILE_PATH`;
otherwise they go to stdout.

## Docker

The app and database are defined as **two separate compose files** that share an
external Docker network named `wagentapi`.

```bash
# 1. Create the shared network once
docker network create wagentapi

# 2. Start MongoDB
docker compose -f compose.mongodb.yaml up -d

# 3. Build and start the API
docker compose up -d --build
```

The image is a multi-stage build on `node:24-alpine`, runs as the non-root
`node` user, ships only production dependencies, and defines a `HEALTHCHECK`
against `/health`.

Notes:

- Because the API runs as a **non-root** user, the host directory mounted for
  logs (`LOG_DIRNAME`) must be writable by UID `1000` (the `node` user).
- `swagger-jsdoc` reads its annotations from the TypeScript sources at runtime,
  so `src/swagger/**` is included in the runtime image on purpose.

> Docker builds could not be executed in the environment where this was last
> updated — run `docker compose up --build` once to confirm in your setup.

## Environment variables

All variables are documented in [`.env.example`](./.env.example). The required
ones are validated at startup in [`src/config/envs.ts`](./src/config/envs.ts).
Highlights:

| Variable                    | Required | Purpose                                            |
| --------------------------- | -------- | -------------------------------------------------- |
| `PORT`                      | yes      | HTTP port                                          |
| `NODE_ENV`                  | yes      | `development` or `production`                      |
| `DB_URI`, `DB_NAME`         | yes      | MongoDB connection                                 |
| `JWT_SECRET`                | yes      | Signs 30-day JWTs — use a long random value        |
| `EMAIL_USER`, `EMAIL_PASS`  | yes      | SMTP credentials (smtp.hostinger.com:587)          |
| `FRONTEND_URL`              | yes      | Base URL for email links                           |
| `PAYMENT_URL`               | yes      | Base URL returned for created orders               |
| `SWAGGER_API_URL`           | yes      | Server URL shown in Swagger UI                     |
| `CURRENCY_BEACON_API_KEY`   | yes      | Fallback currency-rate provider                    |
| `LOG_FILE_PATH`             | yes      | Log file used in production                        |
| `FIREBASE_CONFIG_FILE_PATH` | yes      | Path to the Firebase service-account JSON          |
| `ADMIN_PASSWORD`            | yes      | Currently required but unused (vestigial)          |
| `CORS_ORIGIN`               | no       | Comma-separated allowlist; defaults to all origins |

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
  config/        env validation, db, logger, firebase
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

- **Push notifications are not wired up.** `src/utils/sendNotification.ts` is
  never imported, and its Firebase message payload is malformed (no
  `notification`/`data` field), so notifications would not be delivered even if
  called. `firebase-admin` is therefore effectively unused at runtime. Decide
  whether to finish wiring this up (and fix the payload) or remove it (which
  would also let you drop the `firebase-admin` dependency and the
  `FIREBASE_CONFIG_FILE_PATH` requirement).
- **`src/utils/contract/getTransactionDetails.ts` is a stub** (returns hardcoded
  values) and is not imported anywhere.
- **Public payment endpoints have no JWT auth by design:** `GET/PUT/DELETE
/orders/:id` and `PUT /users/subscription` are reachable with only an order id
  / capability token, which the public payment page relies on. If you need to
  lock these down, do so deliberately and update the payment frontend.
