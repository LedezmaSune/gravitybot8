#!/bin/bash

echo "🦊 Iniciando instalacion automatica de BotMaRe (Linux/Mac)..."
echo "------------------------------------------------------------"

# 1. Verificar Node.js
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js no esta instalado."
    echo "Por favor, instalalo desde https://nodejs.org/ antes de continuar."
    exit 1
fi

# 2. Instalar dependencias raiz
echo "[1/5] Instalando dependencias de la raiz..."
npm install

# 3. Instalar dependencias Backend
echo "[2/5] Instalando dependencias del Backend..."
cd backend
npm install
cd ..

# 4. Instalar dependencias Frontend
echo "[3/5] Instalando dependencias del Frontend..."
cd frontend
npm install
cd ..

# 5. Configurar archivos .env
echo "[4/5] Configurando archivos de entorno (.env)..."

if [ ! -f "backend/.env" ]; then
    echo "Creando backend/.env desde el ejemplo..."
    cp backend/.env.example backend/.env
else
    echo "El archivo backend/.env ya existe, saltando..."
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creando frontend/.env desde el ejemplo..."
    cp frontend/.env.example frontend/.env
else
    echo "El archivo frontend/.env ya existe, saltando..."
fi

echo "[5/5] Finalizando..."
echo ""
echo "------------------------------------------------------------"
echo "✅ INSTALACION COMPLETADA CON EXITO"
echo ""
echo "📝 PROXIMOS PASOS:"
echo "1. Abre backend/.env y pon tus API Keys (Groq, Gemini, etc.)"
echo "2. Ejecuta 'npm run dev' para iniciar el bot."
echo "------------------------------------------------------------"
