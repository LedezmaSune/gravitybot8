# 📜 Master Project Context & AI Prompt

Este documento contiene la descripción completa del proyecto **BotFree AI / Wamasivos (Kitsune Engine)**. Puedes usar este contenido para darle contexto a cualquier IA (como Claude, GPT o Gemini) sobre cómo funciona este sistema y cómo debe ayudarte a desarrollarlo.

---

## 🚀 1. Resumen del Proyecto
**BotFree AI** es una plataforma de automatización de WhatsApp de alto nivel. No es solo un bot, sino un ecosistema completo que incluye:
- **Backend**: Servidor en Node.js/TypeScript utilizando **Baileys** para la conexión con WhatsApp.
- **Frontend**: Dashboard premium en Next.js con **Kitsune Engine** (estética Glassmorphism).
- **IA**: Motor agéntico capaz de usar herramientas (tools) y razonar con múltiples proveedores (Groq, Gemini, OpenAI).
- **Base de Datos**: SQLite para persistencia local de mensajes, configuraciones y recordatorios.

---

## 🛠️ 2. Arquitectura Técnica

### Backend (Express + TypeScript)
- **Patrón**: Controller-Service.
- **WhatsApp**: Gestión de conexión en `src/whatsapp/connection.ts` y manejo de eventos en `src/whatsapp/handler.ts`.
- **IA Agent**: El núcleo está en `src/core/agent.ts`, donde se construye el prompt dinámico y se ejecutan las herramientas.
- **Tools**: Sistema modular de herramientas en `src/tools/` (difusión, recordatorios, búsqueda, etc.).
- **Memoria**: `src/core/memory.ts` gestiona el historial de chat y las configuraciones en SQLite.

### Frontend (Next.js + TailwindCSS)
- **UI**: Componentes modulares para gestión de personalidad, difusión masiva, recordatorios y logs de auditoría.
- **Comunicación**: Socket.io para actualizaciones en tiempo real (QR, estado de conexión, mensajes).

---

## 🤖 3. Lógica del Agente IA (System Prompt)

Cuando el bot recibe un mensaje, el agente construye el siguiente contexto:
1. **Personalidad**: Configurable por el usuario (Settings).
2. **Conocimiento Externo**: Extraído de URLs (Jina Reader) o documentos subidos (PDF/TXT).
3. **Reglas de Oro**: Brevedad extrema, respuestas directas y seguridad contra "prompt injections".
4. **Herramientas**: Capacidad de programar recordatorios, enviar mensajes masivos o consultar datos de auditoría.

---

## 📝 4. Instrucciones para el Desarrollador IA

Si vas a ayudarme a modificar este proyecto, sigue estas reglas:

1. **Mantén el Estilo**: El código debe seguir el patrón de tipos estricto de TypeScript.
2. **Seguridad Anti-Ban**: Todas las funciones de envío masivo deben incluir retrasos aleatorios (`setTimeout`) y actualizaciones de presencia (`composing`).
3. **Persistencia**: Cualquier configuración nueva debe guardarse en la tabla `settings` de SQLite mediante `src/core/memory.ts`.
4. **UI Premium**: Si creas componentes nuevos, usa la paleta de colores de Kitsune (fondos oscuros, bordes sutiles, efectos de cristal).
5. **Logs**: Usa `logAudit` para registrar acciones críticas (ejecución de herramientas, cambios de configuración).

---

## 📂 5. Estructura de Archivos Clave
- `backend/src/index.ts`: Punto de entrada y orquestador.
- `backend/src/whatsapp/connection.ts`: Lógica de socket de WhatsApp.
- `backend/src/services/whatsapp.service.ts`: Puente entre el bot y la IA.
- `backend/src/core/agent.ts`: El "cerebro" del sistema.
- `frontend/app/page.tsx`: Dashboard principal.
- `docker-compose.yml`: Configuración de despliegue.

---

**Usa este contexto para entender cómo interactúan las piezas antes de proponer cambios.**
