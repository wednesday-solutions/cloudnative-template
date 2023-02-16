# syntax=docker/dockerfile:1.4

# References: 
# 1. Missing packages in alpine - https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# 2. Why prune ? - https://turbo.build/repo/docs/handbook/deploying-with-docker#the-lockfile-changes-too-often

# Stage #1
# Run turbo prune
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat git
RUN apk add --no-cache --virtual builds-deps build-base python3
RUN apk update
RUN corepack enable
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN pnpm add -g turbo
WORKDIR /app
COPY . .
COPY turbo.json turbo.json
RUN turbo prune --scope=@fastify-postgres-template/alpha --docker

# Stage #2
# 1. Copy pruned app from stage #1
# 2. Install dependencies
# 3. Build
FROM builder AS installer
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm i
RUN turbo run build --filter=@fastify-postgres-template/alpha...

# Stage #3
# Copy build from Stage #2
# run the application
FROM node:18-alpine AS runner
WORKDIR /app
RUN corepack enable
RUN addgroup --system --gid 1001 fastify-postgres
RUN adduser --system --uid 1001 app-alpha
USER app-alpha
COPY --from=installer /app .
COPY /dev/health-check.js /app/health-check.js

HEALTHCHECK --interval=30s \
    CMD node health-check.js 5000 localhost
CMD pnpm --filter=@fastify-postgres-template/alpha start:prod
