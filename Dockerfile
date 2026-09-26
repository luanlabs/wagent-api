# syntax=docker/dockerfile:1

# ---- Builder: install all deps and compile TypeScript ----
FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runner: production image with only what's needed at runtime ----
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only (respects the uuid override too).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Compiled application.
COPY --from=builder /app/dist ./dist

# swagger-jsdoc parses the JSDoc annotations from the TypeScript sources at
# runtime (apis: ['./src/swagger/**/*.ts']), so they must exist in the image.
COPY src/swagger ./src/swagger

# Run as the unprivileged `node` user that ships with the base image.
USER node

EXPOSE 5000

# Liveness probe against the /health endpoint (PORT defaults to 5000).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
