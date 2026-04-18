# Wamasivos AI - Individual Edition 🚀

Plataforma inteligente de automatización de WhatsApp, recordatorios y difusión con inteligencia artificial. Esta versión está optimizada para ser ligera, segura y rápida.

## 📋 Requisitos Previos

- **Node.js**: Versión 18 o superior.
- **Git**: Para clonar el repositorio.
- **API Keys**: Necesitarás al menos una llave de (Groq, Gemini, OpenAI o OpenRouter).

---

## 🛠️ Guía de Instalación Paso a Paso

### 1. Clonar el repositorio
Abre una terminal y ejecuta:
```bash
git clone https://github.com/LedezmaSune/BotMaRe.git
cd BotMaRe
```

### 2. Instalar dependencias
Instala todas las piezas del sistema con este comando en la raíz:
```bash
npm run install-all
```
*(Si no tienes ese comando, hazlo manualmente):*
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Configurar las Variables de Entorno
Crea un archivo llamado `.env` dentro de la carpeta `backend/` y añade tus llaves:
```env
PORT=3001
# Elige al menos una:
GROQ_API_KEY=tu_llave_aqui
GEMINI_API_KEY=tu_llave_aqui
OPENAI_API_KEY=tu_llave_aqui
```

### 4. Iniciar el Sistema
Vuelve a la raíz del proyecto y arranca todo:
```bash
npm run dev
```

---

## 📱 Cómo Vincular tu WhatsApp

1. Una vez ejecutado el comando `dev`, abre tu navegador en: **http://localhost:3001**
2. Verás una interfaz con un **Código QR**.
3. Abre WhatsApp en tu celular -> Dispositivos Vinculados -> Vincular un dispositivo.
4. Escanea el código QR de la pantalla.
5. ¡Listo! Tu bot ya estará en línea.

---

## 🤖 Funciones Principales

- **Cerebro IA**: Configura el nombre y la personalidad de tu bot desde el panel.
- **Aprendizaje Web**: Pega una URL en la sección de "Personalidad" y el bot aprenderá el contenido de esa web automáticamente.
- **Difusión**: Sube una lista de números y envía mensajes masivos con soporte multimedia.
- **Recordatorios**: Programa mensajes para que se envíen en una fecha y hora específica.

## 🔒 Seguridad y Rendimiento
- **Sesión SQLite**: Tus datos de conexión se guardan en una base de datos local cifrada dentro de `backend/data/whatsapp_auth.db`.
- **Privacidad**: El archivo `.gitignore` está configurado para que tus contraseñas y sesiones nunca se suban a GitHub.

---
Desarrollado con ❤️ usando **Antigravity Engine**.
