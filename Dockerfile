FROM node:20-alpine AS base

# Install OpenSSL and libc6-compat for Prisma & Sharp
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies and generate prisma client
RUN npm ci
RUN npx prisma generate

# Copy project source
COPY . .

# Set build-time environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/data/portfolio.db"

# Create directories before build
RUN mkdir -p /app/data /app/public/uploads

# Build Next.js application
RUN npm run build

# Production runner stage
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/portfolio.db"

# Create persistent storage directories
RUN mkdir -p /app/data /app/public/uploads

# Copy application artifacts
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/prisma ./prisma

EXPOSE 3000
EXPOSE 80

CMD ["sh", "-c", "mkdir -p /app/data /app/public/uploads && (chmod -R 777 /app/data /app/public/uploads 2>/dev/null || true) && npx prisma db push --accept-data-loss --skip-generate && npx next start -H 0.0.0.0 -p ${PORT:-3000}"]
