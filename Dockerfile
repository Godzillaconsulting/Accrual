# --- STAGE 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias del sistema y pnpm
RUN apk add --no-cache git
RUN npm install -g pnpm

# Copiar archivos de dependencias (sin lockfile para que resuelva desde package.json fresco)
COPY package.json ./

# Instalar dependencias completas (incluidas devDependencies)
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copiar código necesario para compilar el frontend
COPY vite.config.js postcss.config.js tailwind.config.js index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Compilar frontend React
RUN pnpm build

# --- STAGE 2: Runtime ---
FROM node:20-alpine AS runtime

WORKDIR /app

# Instalar dependencias del sistema y pnpm
RUN apk add --no-cache git
RUN npm install -g pnpm

# Copiar archivos de dependencias (sin lockfile)
COPY package.json ./

# Instalar solo dependencias de producción
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Copiar el frontend compilado
COPY --from=builder /app/dist ./dist

# Copiar el backend y archivos operacionales
COPY server/ ./server/
COPY bot/ ./bot/
COPY api/ ./api/
COPY database/ ./database/
COPY credentials.json ./

# Crear los directorios para cargas locales y sesiones
RUN mkdir -p media-uploads bot_sessions

# Exponer el puerto del API (3002) y del scanner de WhatsApp (3001)
EXPOSE 3002
EXPOSE 3001

# Por defecto corremos el API
CMD ["node", "server/index.js"]
