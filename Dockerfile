# 🦊 BotMaRe Unified Dockerfile
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias necesarias para better-sqlite3 y compilación
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDeps para el build)
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar el Frontend y el Servidor
RUN npm run build

# --- ETAPA DE PRODUCCIÓN ---
FROM node:20-slim

WORKDIR /app

# Copiar solo lo necesario desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/out ./out
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env.example ./.env.example

# Instalar tsx globalmente para el arranque o usar npx
RUN npm install -g tsx

# Exponer el puerto del Monolito
EXPOSE 8000

# Comando de arranque
CMD ["tsx", "src/server.ts"]
