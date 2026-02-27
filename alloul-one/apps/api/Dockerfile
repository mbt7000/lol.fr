FROM node:22-alpine AS base
WORKDIR /app
COPY package.json ./
RUN npm i -g pnpm

FROM base AS deps
COPY ../.. ./
RUN pnpm install --no-frozen-lockfile

FROM deps AS build
WORKDIR /app/apps/api
RUN pnpm prisma:generate || true
RUN pnpm build || true

FROM node:22-alpine AS run
WORKDIR /app
COPY --from=deps /app /app
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["pnpm","dev"]
