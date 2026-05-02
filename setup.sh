#!/bin/bash
# ============================================================
#  BotMaRe - Setup Rapido (Linux/Mac)
#  Uso: chmod +x setup.sh && ./setup.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

ok()   { echo -e "  ${GREEN}[OK]${NC} $1"; }
warn() { echo -e "  ${YELLOW}[!]${NC}  $1"; }
err()  { echo -e "  ${RED}[X]${NC}  $1"; }
step() { echo -e "  ${CYAN}-->${NC} $1"; }

echo ""
echo "  ======================================================"
echo "           BOTMARE - SETUP RAPIDO"
echo "  ======================================================"
echo ""

# 1. Verificar Node.js
step "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    err "Node.js no encontrado."
    echo "      Instala con: https://nodejs.org"
    echo "      O con nvm:   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"
    exit 1
fi
ok "Node.js $(node -v) detectado"

# 2. Crear directorios
step "Preparando estructura..."
mkdir -p backend/data/uploads

# 3. Instalar dependencias
step "Instalando dependencias (esto puede tardar)..."
echo "        Raiz..."
npm install --quiet > /dev/null 2>&1
echo "        Backend..."
cd backend && npm install --quiet > /dev/null 2>&1 && cd ..
echo "        Frontend..."
cd frontend && npm install --quiet > /dev/null 2>&1 && cd ..
ok "Todas las dependencias instaladas."

# 4. Configurar .env
step "Configurando variables de entorno..."
echo ""

ENV_FILE="backend/.env"
ENV_FRONT="frontend/.env"

if [ -f "$ENV_FILE" ]; then
    warn "Ya existe backend/.env - conservando configuracion actual."
else
    echo "  Necesitas al menos 1 API Key de IA para que el bot funcione."
    echo "  Recomendado: Groq es gratis en https://console.groq.com/keys"
    echo ""
    read -p "  [Groq] API Key (Enter para omitir): " GROQ_KEY
    read -p "  [Gemini] API Key (Enter para omitir): " GEMINI_KEY
    read -p "  [OpenAI] API Key (Enter para omitir): " OPENAI_KEY
    echo ""
    read -p "  Usar Telegram Bot? (s/n): " USE_TG
    TG_TOKEN=""
    TG_ID=""
    if [ "$USE_TG" = "s" ]; then
        read -p "  Token de BotFather: " TG_TOKEN
        read -p "  Tu ID numerico: " TG_ID
    fi

    cat > "$ENV_FILE" << EOF
PORT=3001

# IA Providers
GROQ_API_KEY=$GROQ_KEY
GEMINI_API_KEY=$GEMINI_KEY
OPENAI_API_KEY=$OPENAI_KEY
NVIDIA_API_KEY=
OPENROUTER_API_KEY=

# Dashboard
DASHBOARD_URL=http://localhost:3000
NODE_ENV=development
LOGGER_LEVEL=error
EOF

    if [ "$USE_TG" = "s" ]; then
        cat >> "$ENV_FILE" << EOF

# Telegram
TELEGRAM_BOT_TOKEN=$TG_TOKEN
TELEGRAM_ALLOWED_USER_IDS=$TG_ID
EOF
    fi
    ok "backend/.env creado."
fi

if [ ! -f "$ENV_FRONT" ]; then
    cat > "$ENV_FRONT" << EOF
DASHBOARD_USER="admin"
DASHBOARD_PASS="admin123"
EOF
    ok "frontend/.env creado (usuario: admin / pass: admin123)"
else
    warn "Ya existe frontend/.env - conservando configuracion actual."
fi

echo ""
echo "  ======================================================"
echo "   INSTALACION COMPLETADA"
echo "  ======================================================"
echo ""
echo "  Para iniciar el sistema ejecuta:"
echo "     npm run dev"
echo ""
echo "  Dashboard: http://localhost:3000"
echo "  Backend:   http://localhost:3001"
echo ""
