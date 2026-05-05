<h1 align="center">🦊 BotMaRe - Gravity Dashboard</h1>

<p align="center">
  <strong>La plataforma definitiva de automatización para WhatsApp impulsada por Inteligencia Artificial.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Next.js%20(App%20Router)-16-000000?logo=nextdotjs" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/License-ISC-blue" alt="License"/>
</p>

---

## 📖 ¿Qué es BotMaRe?

**BotMaRe** (powered by **Kitsune Engine**) transforma tu WhatsApp en una herramienta de negocios inteligente. Combina múltiples modelos de IA, automatización de mensajes y un panel de control premium con diseño **Glassmorphism**.

### Novedades Recientes (v2.5)
- 📊 **Nuevos Módulos de UI:** Integración de pestañas para **Auditorías**, **Personalidad de IA**, **Plantillas** y **Programación** directa.
- 🧩 **Arquitectura Modular (Frontend):** Nuevo `BotDataProvider` para una sincronización en tiempo real perfecta entre el backend y los componentes del dashboard.
- 🔒 **Respaldos Cifrados:** Tus datos viajan a Telegram protegidos con encriptación de grado militar (AES-256-CBC) en formato `.zip.enc`.
- ⚡ **Express 5 & Next.js:** Migración a Express 5 para el motor de la API y Next.js App Router para el Dashboard. Incluye fix de rutas dinámicas `/.*/`.
- 🚀 **Control Panel Pro:** Nuevo `manager.bat` para gestionar instalaciones, builds, y servicios de forma profesional con soporte automático de PM2.
- 🌐 **Optimización de Puertos:** Acceso hiperrápido a través del puerto `8001` (versión compilada/producción) con auto-build integrado.
- 📦 **Estabilidad PM2:** Configuración de contexto `cwd` optimizada para garantizar la persistencia de sesiones de WhatsApp.

### Arquitectura
<p align="center">
  <img src="docs/images/architecture.png" alt="Arquitectura del Sistema" width="700"/>
</p>

---

## ✨ Características

| Módulo | Funcionalidades |
| :--- | :--- |
| 🧠 **IA Multi-Proveedor** | Groq, Gemini, OpenAI, DeepSeek (NVIDIA), OpenRouter — con failover automático |
| 🎭 **Personalidad IA** | Ajusta el tono, reglas y comportamiento del agente dinámicamente desde el dashboard |
| 📱 **WhatsApp Bot** | Respuestas inteligentes, imágenes, audio, documentos |
| 📢 **Difusión Masiva** | Envía mensajes personalizados a listas de contactos |
| 📅 **Programación (Scheduling)** | Programa mensajes en grupos o privados con lógica de reintento |
| 🗓️ **Calendario Gravity** | Vista interactiva para gestionar y auditar recordatorios y eventos |
| 📝 **Plantillas** | Crea y gestiona plantillas predefinidas para acelerar tus flujos de mensajería |
| 📊 **Auditorías (Logs)** | Registro completo de actividad, errores y eventos del sistema en tiempo real |
| ✈️ **Telegram Bot** | Controla el sistema remotamente y recibe respaldos diarios |
| 🛡️ **Respaldos AES-256**| Backup diario encriptado (`.zip.enc`) a Telegram, con restauración segura |
| 🎨 **Dashboard Premium** | Next.js App Router, Glassmorphism, modo oscuro/claro, micro-animaciones |

---

## 🚀 Instalación Rápida

### Requisitos Previos
| Software | Versión Mínima | Enlace |
| :--- | :--- | :--- |
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **Git** | Cualquiera | [git-scm.com](https://git-scm.com) |
| **API Key** | Al menos 1 | Ver [Proveedores de IA](#-proveedores-de-ia) |

### Paso 1 — Clonar el repositorio
```bash
git clone https://github.com/LedezmaSune/BotMaRe.git
cd BotMaRe
```

### Paso 2 — Instalar dependencias
<details open>
<summary>⭐ <strong>Instalación Manual</strong> (Recomendada)</summary>

Ejecuta los siguientes comandos en la terminal desde la raíz del proyecto:
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```
Luego configura tus variables de entorno:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Edita `backend/.env` con tus API Keys y `frontend/.env` con tus credenciales del dashboard.

> **💡 Tip:** También puedes usar el archivo **`setup.bat`** en Windows para automatizar todo este paso.
</details>

<details>
<summary>🐳 <strong>Docker</strong> (Servidores 24/7)</summary>

```bash
docker-compose up -d --build
```
Ideal para despliegues en producción con VPS.
</details>

<details>
<summary>🧪 <strong>Scripts Automáticos & Portable</strong></summary>

**Windows — `npm_run_dev.bat`**:
Inicia rápidamente el entorno de desarrollo del backend y frontend simultáneamente.

**Windows — `build_exe.bat`**:
Genera un archivo ejecutable (.exe) portátil en la carpeta `En_Desarrollo_Portable`.
</details>

### Paso 3 — Iniciar el sistema
```bash
npm run dev
```
O utiliza el nuevo script **`manager.bat`** (Recomendado). Esto te permite elegir entre Modo Desarrollo o Modo Producción (PM2) y acceder rápidamente al Dashboard en el puerto `8001`.

### Paso 4 — Vincular WhatsApp
1. Abre **http://localhost:8001** en tu navegador (Versión rápida de producción).
2. Verás el Dashboard de Gravity.
3. Aparecerá un **código QR** — escanéalo con tu celular:
   - WhatsApp → ⋮ Menú → Dispositivos vinculados → Vincular dispositivo.
4. ¡Listo! El estado cambiará a **Conectado** 🟢.

---

## 🔑 Proveedores de IA
BotMaRe soporta 5 proveedores con failover automático. Solo necesitas al menos 1:

| Proveedor | Gratuito | Obtener Key | Variable en `.env` |
| :--- | :--- | :--- | :--- |
| **Groq** ⭐ (Prioridad 1) | ✅ Sí | [console.groq.com](https://console.groq.com/keys) | `GROQ_API_KEY` |
| **Google Gemini** | ✅ Sí | [aistudio.google.com](https://aistudio.google.com/app/apikey) | `GEMINI_API_KEY` |
| **OpenAI** | ❌ Pago | [platform.openai.com](https://platform.openai.com/api-keys) | `OPENAI_API_KEY` |
| **OpenRouter** | ✅ Sí | [openrouter.ai](https://openrouter.ai/keys) | `OPENROUTER_API_KEY` |
| **DeepSeek (NVIDIA)** | ❌ Pago | [nvidia.com](https://integrate.api.nvidia.com) | `NVIDIA_API_KEY` |

---

## ⚙️ Configuración del Sistema
BotMaRe ofrece dos formas de configurarse. La pestaña de **Configuración** en el Dashboard es el método recomendado.

### Método 1 — Panel de Control (Recomendado)
Desde la pestaña ⚙️ **Configuración** puedes editar API Keys, módulos de personalidad, plantillas y puertos, o importar tu `.env` arrastrándolo.

### Método 2 — Configuración Manual (.env)
Edita `backend/.env` con tus llaves y `frontend/.env` con tu usuario de acceso.

---

## 📁 Estructura del Proyecto
```
BotMaRe/
├── backend/                  # API + Motor de IA
│   ├── src/
│   │   ├── core/             # Agente IA, LLM, memoria, voz
│   │   ├── whatsapp/         # Conexión Baileys, handlers
│   │   ├── telegram/         # Bot de Telegram
│   │   ├── services/         # Lógica de negocio (Backups, etc)
│   │   └── index.ts          # Punto de entrada
│   ├── data/                 # Base de datos SQLite
│   └── .env.example          # Plantilla de referencia
├── frontend/                 # Dashboard Next.js
│   ├── app/                  # Rutas (audits, calendar, personality, settings...)
│   └── components/           # UI Components (DashboardLayout, etc)
├── setup.bat                 # Setup rápido Windows
├── npm_run_dev.bat           # Launcher de desarrollo rápido
├── build_exe.bat             # Generador de EXE portátil
└── package.json              # Scripts raíz
```

---

## 🏷️ Variables Inteligentes
Usa estas etiquetas en tus mensajes y plantillas: `{NOMBRE}`, `{NOMBRE_PILA}`, `{APELLIDO}`, `{FECHA}`, `{HORA_12}`, `{HORA_24}`, `{DIA_SEMANA}`.

---

## ❓ Solución de Problemas
<details>
<summary><strong>El QR no aparece</strong></summary>
Verifica que el puerto 8001 esté libre e intenta borrar `backend/data/whatsapp_auth.db`.
</details>

<details>
<summary><strong>El bot no responde</strong></summary>
Verifica que tienes al menos 1 API Key válida en el Dashboard o el archivo `.env`.
</details>

---

<p align="center">
  Desarrollado con ❤️ por <strong><a href="https://github.com/LedezmaSune">LedezmaSune</a></strong><br/>
  Impulsado por <strong>Kitsune Engine</strong> 🦊
</p>
