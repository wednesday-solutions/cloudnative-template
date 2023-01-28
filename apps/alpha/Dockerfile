# syntax=docker/dockerfile:1.4

# References: 
# 1. https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile
# 2. Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

FROM node:alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
RUN yarn global add turbo
WORKDIR /app
COPY . .
COPY turbo.json turbo.json
RUN turbo prune --scope=@fastify-postgres-template/alpha --docker
CMD echo "test"

FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm
RUN npm install --global turbo
COPY .gitignore .gitignore

# install dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
# build
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN turbo run build --filter=@fastify-postgres-template/alpha...

FROM node:alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 app-alpha
RUN adduser --system --uid 1001 app-alpha
USER app-alpha
COPY --from=installer /app .

CMD node apps/alpha/dist/src/index.js
