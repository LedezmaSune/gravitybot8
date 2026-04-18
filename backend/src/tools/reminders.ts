import { createReminder, listReminders, deleteReminder } from "../core/memory";

export const remindersTool = {
    definition: {
        name: "manage_reminders",
        description: "Permite crear, listar o borrar recordatorios y mensajes programados.",
        parameters: {
            type: "object",
            properties: {
                action: { type: "string", enum: ["create", "list", "delete"] },
                text: { type: "string", description: "El mensaje a recordar o pie de foto" },
                time: { type: "string", description: "Fecha y hora (ISO o natural, ej: 'mañana a las 10am')" },
                mediaPath: { type: "string", description: "Ruta local o URL de la imagen o archivo a enviar (opcional)" },
                mediaType: { type: "string", enum: ["image", "video", "audio", "document"], description: "Tipo de archivo (opcional)" },
                id: { type: "number", description: "ID del recordatorio para borrar" }
            },
            required: ["action"]
        }
    },
    handler: async (args: any, userId: string, chatId: string) => {
        switch (args.action) {
            case "create":
                if (!args.text || !args.time) return "Faltan texto o hora para el recordatorio.";
                const id = await createReminder(userId, chatId, args.text, args.time, args.mediaPath, args.mediaType);
                return `✅ Recordatorio programado con ID: ${id}. ${args.mediaPath ? '(Incluye multimedia)' : ''}`;

            case "list":
                const list = await listReminders(userId);
                if (list.length === 0) return "No tienes recordatorios pendientes.";
                return list.map((r: any) => `[${r.id}] ${r.time}: ${r.text}`).join('\n');
            case "delete":
                if (!args.id) return "Falta el ID del recordatorio.";
                await deleteReminder(args.id);
                return `✅ Recordatorio ${args.id} borrado.`;
            default:
                return "Acción no reconocida.";
        }
    }
};
