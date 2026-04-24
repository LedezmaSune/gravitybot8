import { scrapeUrl } from '../core/scraper';

export const webBrowserTool = {
    definition: {
        name: "scrape_web",
        description: "Obtiene el contenido de una página web a partir de su URL para obtener información actualizada.",
        parameters: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "La URL completa de la página web (debe empezar con http:// o https://)."
                }
            },
            required: ["url"]
        }
    },
    handler: async (args: { url: string }) => {
        try {
            console.log(`[Tool: WebBrowser] Fetching URL: ${args.url}`);
            const content = await scrapeUrl(args.url);
            return `Contenido de ${args.url}:\n\n${content.substring(0, 3000)}`;
        } catch (error: any) {
            console.error(`[Tool: WebBrowser] Error fetching ${args.url}:`, error.message);
            return `Error al intentar acceder a la web: ${error.message}. Asegúrate de que la URL sea correcta y accesible.`;
        }
    }
};
