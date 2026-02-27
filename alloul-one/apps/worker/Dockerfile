FROM node:22-alpine
WORKDIR /app
RUN npm i -g pnpm
COPY ../.. ./
RUN pnpm install --no-frozen-lockfile
WORKDIR /app/apps/worker
CMD ["pnpm","dev"]
