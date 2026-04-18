# Wamasivos AI - Individual Edition

Plataforma inteligente de automatización de WhatsApp, recordatorios y difusión con inteligencia artificial.

## 🚀 Características
- **WhatsApp Engine**: Conectividad robusta con reconexión automática.
- **Cerebro IA**: Personalidad configurable (System Prompt) y base de conocimientos externa.
- **Aprendizaje Automático**: Capacidad de leer sitios web y aprender de ellos instantáneamente.
- **Gestión de Recordatorios**: Programa mensajes con texto y multimedia.
- **Difusión Masiva**: Envío a listas de contactos con velocidad controlada.
- **Almacenamiento Optimizado**: Uso de SQLite para sesiones y base de datos (Ultra rápido).

## 🛠️ Tecnologías
- **Backend**: Node.js, Express, Baileys, SQLite (better-sqlite3).
- **Frontend**: Next.js 15, Tailwind CSS, Lucide Icons.
- **IA**: Soporte para Groq, Gemini, OpenAI y OpenRouter.

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone <tu-repo>
   cd wamasivos
   ```

2. Instala las dependencias en la raíz:
   ```bash
   npm install
   ```

3. Instala dependencias en backend y frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

4. Configura las variables de entorno:
   - Crea un archivo `backend/.env` basado en las necesidades de los proveedores de IA.

## 🏃 Modo Desarrollo
Desde la raíz del proyecto, ejecuta:
```bash
npm run dev
```

El sistema iniciará el Frontend en el puerto **3000** y el Backend en el puerto **3001**.
Visita **http://localhost:3001** para la experiencia completa integrada.

---
© 2026 Developed with Antigravity
