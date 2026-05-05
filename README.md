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

### Novedades Recientes (v2.6)
- 🌐 **Acceso Multi-Equipo:** Detección automática de IP LAN y configuración de orígenes permitidos para acceder al dashboard desde cualquier dispositivo de la red.
- 🚀 **Kitsune Engine Pro:** El motor ahora sirve el frontend automáticamente en el puerto `8001` (Modo Producción), simplificando el despliegue a un solo puerto.
- 📊 **Logs Inteligentes:** Nueva interfaz de consola que muestra URLs de acceso Local, LAN y Túnel Cloudflare al iniciar.
- 🧩 **Arquitectura Modular (Frontend):** Sincronización en tiempo real mejorada entre el backend y los componentes del dashboard.
- 🔒 **Respaldos Cifrados:** Backup AES-256-CBC automático enviado a Telegram.
- ⚡ **Express 5 & Next.js:** Optimización de rendimiento y compatibilidad con las últimas versiones de Node.js.

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
O utiliza el nuevo script **`manager.bat`** (Recomendado). Esto te permite elegir entre Modo Desarrollo o Modo Producción (PM2).

### Paso 4 — Acceso Remoto y Despliegue
Si has instalado BotMaRe en un servidor o en una computadora diferente a la que usas normalmente:

1.  **Detección de IP:** Al iniciar el bot, la consola mostrará tu IP de red local (ej. `http://192.168.1.50:8001`).
2.  **Firewall:** Asegúrate de que el puerto `8001` esté permitido en el Firewall de Windows para conexiones entrantes.
3.  **Túnel Cloudflare:** Si necesitas acceso desde fuera de tu casa/oficina, usa la **Opción T** en el `manager.bat` para generar una URL pública segura.

### Paso 5 — Vincular WhatsApp
1. Abre el Dashboard en tu navegador (usa la IP que mostró la consola o `localhost:8001` si estás en la misma PC).
2. Aparecerá un **código QR** — escanéalo con tu celular:
   - WhatsApp → ⋮ Menú → Dispositivos vinculados → Vincular dispositivo.
3. ¡Listo! El estado cambiará a **Conectado** 🟢.

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
