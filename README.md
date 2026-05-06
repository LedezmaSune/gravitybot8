<h1 align="center">🦊 BotMaRe - Monolito Unificado</h1>

<p align="center">
  <strong>La plataforma definitiva de automatización para WhatsApp impulsada por IA, ahora más simple, robusta y rápida.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Next.js%20(Export)-15-000000?logo=nextdotjs" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/DeepSeek-Ready-blue?logo=openai" alt="DeepSeek"/>
</p>

---

## 📖 ¿Qué es BotMaRe?

**BotMaRe** es un sistema de automatización modular para WhatsApp que combina el poder de múltiples modelos de IA (DeepSeek, Groq, Gemini, OpenAI) con un Dashboard administrativo premium. 

Esta versión **Monolito Unificado** elimina la complejidad de procesos separados, sirviendo toda la plataforma desde un solo puerto (**8000**), simplificando el despliegue y mejorando la estabilidad.

### ✨ Características Principales
- 🚀 **Arquitectura Unificada:** Todo el sistema (Motor + Dashboard) corre en un solo proceso.
- 🤖 **IA Multi-Proveedor:** Soporte nativo para **DeepSeek**, Groq, Gemini, OpenAI y OpenRouter con failover automático.
- 🇪🇸 **Arranque Estructurado:** Proceso de inicio en 5 fases (0-4) con logs detallados en español.
- 🛡️ **Seguridad Blindada:** Dashboard protegido con credenciales y sesiones de WhatsApp aisladas.
- ✈️ **Telegram Link:** Control remoto y notificaciones de respaldo vía Telegram.
- 🎨 **Dashboard Premium:** Interfaz Glassmorphism ultrarrápida (Next.js 15).

---

## 🚀 Instalación Rápida

### Requisitos Previos
- **Node.js v20+** (Recomendado)
- **Git**

### Paso 1 — Preparación
```bash
git clone https://github.com/LedezmaSune/BotMaRe.git
cd BotMaRe
npm install
```

### Paso 2 — Configuración
Copia el archivo de ejemplo y rellena tus API Keys:
```bash
cp .env.example .env
```
*Edita el archivo `.env` con tu llave de **DeepSeek**, Groq o Gemini.*

### Paso 3 — Iniciar
```bash
# Para desarrollo (con recarga en vivo)
npm run dev

# Para producción (Recomendado)
npm start
```

---

## 🛠️ Estructura del Proyecto (Monolito)
```
BotMaRe/
├── src/
│   ├── core/             # Cerebro del sistema (IA, Memoria, Config)
│   ├── infrastructure/   # Conectividad (WhatsApp, Telegram, Túneles)
│   ├── modules/          # Lógica de Negocio (Mensajes, IA, Calendario)
│   ├── routes/           # Endpoints de la API
│   └── server.ts         # Punto de entrada unificado
├── out/                  # Interfaz compilada (Static Export)
├── data/                 # Base de datos SQLite y Sesiones (Ignorado en Git)
└── .env                  # Configuración privada
```

---

## 🔑 Proveedores de IA Soportados
BotMaRe intenta conectar en este orden (Failover automático):
1. **Groq** (Llama 3.3 - Velocidad extrema)
2. **DeepSeek** (Inteligencia pura y económica) ⭐ *NUEVO*
3. **Google Gemini** (Excelente visión y contexto)
4. **OpenAI** (El estándar de la industria)
5. **OpenRouter / NVIDIA** (Respaldo total)

---

## ❓ Preguntas Frecuentes

**¿Por qué la pantalla se queda en blanco?**
Asegúrate de haber ejecutado `npm run build` al menos una vez para generar la carpeta `out/`. El modo `npm start` sirve estos archivos estáticos.

**¿Cómo cambio el puerto?**
Edita la variable `PORT` en tu archivo `.env`. Por defecto es el **8000**.

**¿Cómo resetear la sesión de WhatsApp?**
Borra el archivo `data/whatsapp_auth.db` y reinicia el bot para escanear un nuevo código QR.

---

<p align="center">
  Desarrollado con ❤️ por <strong><a href="https://github.com/LedezmaSune">LedezmaSune</a></strong><br/>
  Impulsado por el motor <strong>Kitsune Unified</strong> 🦊
</p>
