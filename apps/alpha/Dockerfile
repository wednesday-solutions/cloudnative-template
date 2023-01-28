# syntax=docker/dockerfile:1.4

# References: 
# 1. Missing packages in alpine - https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# 2. Why prune ? - https://turbo.build/repo/docs/handbook/deploying-with-docker#the-lockfile-changes-too-often

# Stage #1
# Run turbo prune
FROM node:alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
RUN yarn global add turbo
WORKDIR /app
COPY . .
COPY turbo.json turbo.json
RUN turbo prune --scope=@fastify-postgres-template/alpha --docker

# Stage #2
# 1. Copy pruned app from stage #1
# 2. Install dependencies
# 3. Build
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN yarn global add pnpm
RUN yarn global add turbo
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN turbo run build --filter=@fastify-postgres-template/alpha...

# Stage #3
# Copy build from Stage #2
# run the application
FROM node:alpine AS runner
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN addgroup --system --gid 1001 fastify-postgres
RUN adduser --system --uid 1001 app-alpha
USER app-alpha
COPY --from=installer /app .
# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s \
    CMD node healthcheck.js
CMD node apps/alpha/dist/index.js
