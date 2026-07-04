FROM oven/bun:1.3.13-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PORTAL_URL
ARG NEXT_PUBLIC_LOGIN_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PORTAL_URL=$NEXT_PUBLIC_PORTAL_URL
ENV NEXT_PUBLIC_LOGIN_URL=$NEXT_PUBLIC_LOGIN_URL

COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/portal/package.json ./apps/portal/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/types/package.json ./packages/types/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

RUN bun install --frozen-lockfile

COPY . .

# Run bun install again to ensure all workspace symlinks and binaries (like next and prisma) are properly linked
RUN bun install --frozen-lockfile


RUN cd apps/api && bunx --bun prisma generate


RUN bun run build

FROM node:20-alpine AS web
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/web/server.js"]

FROM node:20-alpine AS portal
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/.next/static ./apps/portal/.next/static

USER nextjs
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "apps/portal/server.js"]

FROM oven/bun:1.3.13-alpine AS api
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 expressjs

COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/apps/api ./apps/api
COPY --from=builder --chown=expressjs:nodejs /app/packages ./packages
COPY --from=builder --chown=expressjs:nodejs /app/package.json ./package.json

USER expressjs
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "cd apps/api && bunx --bun prisma db push --accept-data-loss && bun src/server.ts"]
