# 🦊 BotFree AI - Individual Edition 🚀

> **La plataforma definitiva de automatización para WhatsApp impulsada por Inteligencia Artificial.**

BotFree AI (powered by **Kitsune Engine**) es una solución integral diseñada para transformar tu WhatsApp en una herramienta de negocios inteligente. Combina potencia, velocidad y una interfaz de usuario premium para ofrecerte el control total sobre tus comunicaciones.

---

## ✨ Características Principales

### 🧠 Cerebro IA Avanzado
- **Multi-Modelo**: Soporte nativo para Groq, Gemini, OpenAI y OpenRouter.
- **Personalización Total**: Define el nombre, personalidad y reglas de comportamiento (Prompt) desde el panel.
- **RAG (Retrieval-Augmented Generation)**: Tu bot aprende de tus datos.

### 🌐 Aprendizaje Inteligente
- **Jina Reader Integration**: Pega una URL y el bot procesará el contenido, incluso en sitios complejos (React/Next.js).
- **Document Knowledge Base**: Sube archivos (PDF, TXT, CSV, Markdown) para que la IA responda basándose en tu propia documentación.

### 📢 Difusión y Marketing
- **Envíos Masivos con Variables Dinámicas**: Personaliza mensajes al instante usando etiquetas automáticas (`{NOMBRE}`, `{FECHA}`, `{HORA_12}`, etc.) con menú de autocompletado inteligente.
- **Programación Avanzada de Recordatorios**: Define rutinas con extrema flexibilidad (cada hora, día, saltando fines de semana, semanalmente o mensualmente).
- **Multi-Destinatario en Recordatorios**: Envía la misma tarea programada a varios grupos o contactos simultáneamente separando los números por coma.

### 🎨 Experiencia de Usuario Premium
- **Kitsune Dashboard**: Interfaz moderna con modo oscuro/claro, efectos de glassmorphism y micro-animaciones.
- **Control en Tiempo Real**: Monitorea el estado de la conexión y las estadísticas desde una consola intuitiva.

### 📱 Panel de Control Vía Telegram
- **Modo Administrador de Bolsillo**: Vincula un bot de Telegram como panel de control exclusivo y privado.
- **Menú Principal Interactivo**: Escribe `/start` para desplegar un menú con botones navegables para controlar todo el sistema.
- **Asistentes Paso a Paso**: Olvídate de comandos complejos. Toca "Crear Nuevo" en Recordatorios o "Difusión Masiva" y el bot te guiará preguntando destinatarios, mensaje, fecha y opciones de repetición con botones visuales.
- **Paridad Total**: Permite enviar mensajes masivos, programar e interactuar con recordatorios, revisar bitácoras de auditoría (`/auditoria`) y editar el "Cerebro" de la IA (`/cerebro`) directo desde tu chat de Telegram de forma interactiva.

---

## 🛠️ Tecnologías

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **[Node.js](https://nodejs.org/)**: Versión 18 o superior (Recomendado 20+).
- **[Git](https://git-scm.com/)**: Para clonar el repositorio.
- **[Docker](https://www.docker.com/)**: (Opcional) Si prefieres usar contenedores.
- **API Keys**: Necesitarás al menos una llave de Groq, Gemini, OpenAI o OpenRouter.

---

## 🛠️ Guía de Instalación Paso a Paso

Sigue estos pasos en orden para tener tu bot funcionando en menos de 5 minutos:

### 1️⃣ Clonar el Proyecto
Abre una terminal (PowerShell, CMD o Bash) y ejecuta:
```bash
git clone https://github.com/LedezmaSune/BotMaRe.git
cd BotMaRe
```

### 2️⃣ Instalar Dependencias
Este proyecto es un monorepositorio. Hemos creado un comando para instalar todo (raíz, backend y frontend) de una sola vez:
```bash
npm run install-all
```
> [!TIP]
> Si este comando falla, puedes instalar manualmente entrando en cada carpeta: `npm install`, luego `cd backend && npm install`, y finalmente `cd ../frontend && npm install`.

### 3️⃣ Configurar Variables de Entorno
1. Ve a la carpeta `backend/`.
2. Renombra el archivo `.env.example` a `.env` (o crea uno nuevo).
3. Pega tus llaves API:
```env
PORT=3001

# --- IA PROVIDERS ---
GROQ_API_KEY=tu_llave_aqui
GEMINI_API_KEY=tu_llave_aqui
OPENAI_API_KEY=tu_llave_aqui
OPENROUTER_API_KEY=tu_llave_aqui

# --- TELEGRAM BOT (Opcional) ---
TELEGRAM_BOT_TOKEN="tu_token_de_botfather_aqui"
TELEGRAM_ALLOWED_USER_IDS="tu_id_de_telegram_aqui"
```

4. Ve a la carpeta `frontend/` y crea o edita el archivo `.env`.
5. Configura la contraseña de tu panel de control (Dashboard):
```env
DASHBOARD_USER="admin"
DASHBOARD_PASS="admin123"
```

> [!NOTE]
> Para usar Telegram: Crea un bot usando a [@BotFather](https://t.me/BotFather) en Telegram para obtener el `TELEGRAM_BOT_TOKEN`. Para obtener tu ID numérico y ponerlo en `TELEGRAM_ALLOWED_USER_IDS`, puedes usar bots como @userinfobot. Puedes separar varios IDs con comas.

### 4️⃣ Iniciar el Sistema
Regresa a la raíz del proyecto (`BotMaRe`) y arranca el motor:
```bash
npm run dev
```
Esto iniciará el backend y el frontend simultáneamente. Verás logs en diferentes colores indicando que todo está listo.

---

## 📱 Cómo Vincular tu WhatsApp

1. Una vez el sistema esté corriendo, abre tu navegador en: **[http://localhost:3001](http://localhost:3001)**.
2. Verás el **Panel de Control de Kitsune**.
3. Haz clic en el botón de **Vincular WhatsApp**.
4. Aparecerá un **Código QR**.
5. En tu celular: Abre WhatsApp -> Menú (tres puntos) -> Dispositivos Vinculados -> Vincular un dispositivo.
6. Escanea el código de la pantalla.
7. **¡Listo!** El estado cambiará a "Conectado" y tu bot empezará a responder.

---

## 🐳 Despliegue con Docker (Recomendado para Servidores)

Si quieres correr el bot 24/7 en un VPS o servidor, Docker es tu mejor aliado:

1. **Configura el .env** en la carpeta `backend/` como se explicó arriba.
2. **Lanza los contenedores**:
   ```bash
   docker-compose up -d --build
   ```
3. **Accede**: El panel estará disponible en el puerto 3001 de tu servidor.

> [!IMPORTANT]
> Docker crea volúmenes automáticos para que tu sesión de WhatsApp no se cierre aunque reinicies el servidor.

---

## ❓ Solución de Problemas Comunes

- **Error al instalar dependencias**: Asegúrate de tener Node v18+ y haber cerrado otros procesos que usen el puerto 3000 o 3001.
- **El QR no carga**: Verifica que el backend esté corriendo correctamente y que no haya errores de "Address already in use" en la terminal.
- **El bot no responde**: Revisa que tu `API_KEY` sea válida y tengas créditos en el proveedor seleccionado.

## 🔒 Seguridad y Privacidad

- **Sesiones Locales**: Tu conexión de WhatsApp se cifra y almacena en `backend/data/`.
- **Zero Cloud Storage**: No almacenamos tus mensajes ni llaves API en servidores externos; todo corre en tu infraestructura.
- **Protección Anti-Ban**: Incluye lógica de presencia dinámica y retrasos aleatorios en envíos masivos.

---

## 🌐 Exposición Segura (Cloudflare)

El sistema incluye soporte para **Cloudflare Quick Tunnels**, permitiéndote exponer tu backend a una URL pública segura de forma automática sin configurar puertos en tu router.

---

Desarrollado con ❤️ por **LedezmaSune** | Impulsado por **Kitsune Engine**.
