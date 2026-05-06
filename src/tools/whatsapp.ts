import { MessageService } from "../modules/messages/message.service";

let waService: MessageService;

export function initWhatsAppTools(service: MessageService) {
    waService = service;
}

export const whatsappTools = {
    list_groups: {
        definition: {
            name: "list_groups",
            description: "Lista todos los grupos de WhatsApp donde el bot está presente. Útil para encontrar IDs de grupos.",
            parameters: {
                type: "object",
                properties: {}
            }
        },
        handler: async () => {
            if (!waService) return "Servicio de WhatsApp no inicializado.";
            try {
                const groups = await waService.getGroups();
                const groupList = Object.values(groups).map((g: any) => ({
                    id: g.id,
                    subject: g.subject
                }));
                
                if (groupList.length === 0) return "El bot no está en ningún grupo.";
                
                return "Grupos encontrados:\n" + groupList.map(g => `- ${g.subject} (ID: ${g.id})`).join('\n');
            } catch (error: any) {
                return `Error al obtener grupos: ${error.message}`;
            }
        }
    }
};
