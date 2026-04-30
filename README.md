# 🦊 BotMaRe - Gravity Dashboard 🚀

> **La plataforma definitiva de automatización para WhatsApp impulsada por Inteligencia Artificial.**

BotMaRe (powered by **Kitsune Engine**) es una solución integral diseñada para transformar tu WhatsApp en una herramienta de negocios inteligente. Combina potencia, velocidad y una interfaz de usuario premium con efectos de **Glassmorphism** y **Gravity Design**.

---

## ✨ Características Principales

### 🧠 Inteligencia Artificial Avanzada
- **Personalización Dinámica**: Define el nombre, la personalidad y las reglas del bot desde el panel.
- **Perfeccionamiento con IA**: Un botón mágico en cada cuadro de texto para mejorar la redacción de tus mensajes antes de enviarlos.
- **RAG & Aprendizaje**: Sube documentos (PDF, TXT, MD) o pega URLs para que el bot aprenda y responda basado en tu conocimiento.

### 📢 Gestión de Mensajes y Plantillas
- **Sistema de Plantillas Profesional**: Crea, edita y elimina plantillas de mensajes. Úsalas al instante en Difusión o Recordatorios.
- **Variables Inteligentes**: Usa etiquetas como `{NOMBRE}`, `{FECHA}`, `{HORA}` con un selector asistido.
- **Detección Inteligente de Contactos**: Soporta formatos como `Nombre Número`, `Número, Nombre`, etc. El bot detecta automáticamente quién es quién.

### 📅 Recordatorios y Calendario
- **Programación Flexible**: Rutinas horarias, diarias, semanales, mensuales o personalizadas (ej: cada 3 días).
- **Calendario "Gravity"**: Una vista profesional tipo Google Calendar para gestionar tus tareas programadas visualmente.
- **Multi-Destinatario**: Programa un solo mensaje para múltiples contactos a la vez.

### 🎨 UI/UX de Nueva Generación
- **Dashboard Refactorizado**: Código limpio, rápido y optimizado con React Hooks modernos.
- **Modo Oscuro/Claro**: Adaptado a tus preferencias visuales.
- **Efectos Premium**: Desenfoques de fondo (Backdrop Blur), micro-animaciones y sombras suaves.

---

## 🛠️ Instalación Rápida (Windows)

Si estás en Windows, hemos simplificado todo el proceso a dos clics:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/LedezmaSune/BotMaRe.git
   cd BotMaRe
   ```
2. **Instala todo**: Ejecuta el archivo `instalar.bat`. Este script instalará Node.js (si no lo tienes), creará las carpetas necesarias y bajará todas las dependencias.
3. **Configura tu IA**: Abre el archivo `backend/.env` y pon tu `OPENAI_API_KEY`.
4. **Inicia el sistema**: Ejecuta el archivo `iniciar.bat`.

---

## 📋 Requisitos Previos (Manual)

Si prefieres instalarlo manualmente o estás en Linux/Mac:

- **Node.js**: v18 o superior.
- **Git**: Para clonar el código.
- **API Key**: Groq, Gemini, OpenAI o DeepSeek (vía NVIDIA).

### Pasos Manuales:
1. `npm run install-all` (Instala dependencias en raíz, backend y frontend).
2. Configura `backend/.env` basado en `.env.example`.
3. `npm run dev` para arrancar ambos servidores.

---

## 📱 Cómo Vincular tu WhatsApp

1. Abre tu navegador en: **[http://localhost:3000](http://localhost:3000)** (Frontend).
2. Verás el **Dashboard de Gravity**.
3. Si no estás vinculado, aparecerá un **Código QR** en la esquina superior.
4. En tu celular: Ve a Dispositivos Vinculados y escanea el código.
5. El estado cambiará a **Conectado** y el bot estará vivo.

---

## 🏷️ Variables Disponibles
Al redactar mensajes, puedes usar las siguientes variables (aparecen automáticamente al escribir `{`):
- `{NOMBRE}`: Nombre completo del contacto.
- `{NOMBRE_PILA}`: Primer nombre.
- `{APELLIDO}`: Apellidos.
- `{FECHA}`: Fecha actual (DD/MM/YYYY).
- `{HORA_12}` / `{HORA_24}`: Hora actual.
- `{DIA_SEMANA}`: Lunes, Martes, etc.

---

## 🐳 Docker (Servidores)
Para despliegues 24/7 en servidores Linux:
```bash
docker-compose up -d --build
```

---

## ❓ FAQ / Solución de Problemas
- **¿Por qué dice "Usuario" en mis mensajes?**: Asegúrate de poner el nombre del contacto en la lista (ej: `Juan 521...`). Si no hay nombre, el bot usa "Usuario" por defecto.
- **El QR no aparece**: Verifica que el puerto 3001 esté libre y el backend esté corriendo.
- **Error de API Key**: Revisa que tu llave de OpenAI/DeepSeek tenga créditos y esté bien escrita en el `.env`.

---

Desarrollado con ❤️ por **LedezmaSune** | Impulsado por **Kitsune Engine**.
