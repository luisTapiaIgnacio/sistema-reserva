# ---------- 1. Dependencias ----------
FROM node:24-alpine AS dependencias
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- 2. Compilación ----------
FROM node:24-alpine AS compilacion
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencias /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- 3. Imagen final (solo lo necesario para correr) ----------
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S web && adduser -S web -G web
COPY --from=compilacion --chown=web:web /app/.next/standalone ./
COPY --from=compilacion --chown=web:web /app/.next/static ./.next/static
COPY --from=compilacion --chown=web:web /app/public ./public
USER web

EXPOSE 3000
# API_URL (dirección de la API) se lee al arrancar: la pone docker-compose.yml
CMD ["node", "server.js"]
