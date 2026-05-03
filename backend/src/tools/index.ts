import { timeTool } from "./time";
import { remindersTool } from "./reminders";
import { webBrowserTool } from "./web_browser";
import { whatsappTools, initWhatsAppTools } from "./whatsapp";
import { WhatsAppService } from "../services/whatsapp.service";

export const allTools = [
    timeTool,
    remindersTool,
    webBrowserTool,
    whatsappTools.list_groups
];

export const restrictedTools = [
    timeTool,
    webBrowserTool,
    whatsappTools.list_groups
];

export function initTools(waService: WhatsAppService) {
    initWhatsAppTools(waService);
}

export const allToolsDefinition = allTools.map(t => ({
    type: "function",
    function: t.definition
}));

export const restrictedToolsDefinition = restrictedTools.map(t => ({
    type: "function",
    function: t.definition
}));

export async function executeTool(name: string, args: any, userId: string, chatId: string) {
    const tool = allTools.find(t => t.definition.name === name);
    if (!tool) throw new Error(`Tool ${name} not found`);
    return await (tool.handler as any)(args, userId, chatId);
}
