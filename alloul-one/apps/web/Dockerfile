FROM node:22-alpine AS base
WORKDIR /app
RUN npm i -g pnpm
COPY ../.. ./
RUN pnpm install --no-frozen-lockfile
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm","dev"]
