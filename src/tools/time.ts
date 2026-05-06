export const timeTool = {
    definition: {
        name: "get_current_time",
        description: "Obtiene la fecha y hora actual del sistema.",
        parameters: { type: "object", properties: {} }
    },
    handler: async () => {
        return new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    }
};
