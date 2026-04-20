# BotFree AI - Individual Edition 🚀

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

- **Plantilla 100% Personalizable**: Edita los textos y la marca de la interfaz fácilmente desde `frontend/config.ts`.
- **Cerebro IA**: Configura el nombre, instrucciones (Prompt) y comportamiento del bot desde el panel.
- **Aprendizaje Web Inteligente**: Pega una URL y el bot extraerá todo su conocimiento. Utiliza el motor de **Jina Reader**, por lo que es capaz de leer sin problemas páginas complejas (React, Next.js) que requieren JavaScript.
- **Aprendizaje por Documentos**: Sube manuales o reglas en formato **PDF, TXT, CSV o Markdown**. El sistema leerá el archivo automáticamente offline (usando pdf.js) y se lo enseñará a tu IA.
- **Difusión Masiva Flexibe**: Sube una base de datos o pega los números para mandar mensajes automáticos. Su algoritmo inteligente de Regex detecta automáticamente el número y el nombre de tus contactos, sin importar si los separas por tabuladores, comas o espacios.
- **Programación de Mensajes**: Organiza recordatorios o cobros programando envíos precisos en una fecha y hora específica.

## 🔒 Seguridad y Rendimiento
- **Sesión SQLite**: Tus datos de conexión se guardan en una base de datos local cifrada dentro de `backend/data/whatsapp_auth.db`.
- **Privacidad**: El archivo `.gitignore` está configurado para que tus contraseñas y sesiones nunca se suban a GitHub.

---
Desarrollado con ❤️ usando **Kitsune Engine**.
