import { timeTool } from "./time";
import { remindersTool } from "./reminders";
import { webBrowserTool } from "./web_browser";

export const tools = [
    timeTool,
    remindersTool,
    webBrowserTool
];

export const toolsDefinition = tools.map(t => ({
    type: "function",
    function: t.definition
}));

export async function executeTool(name: string, args: any, userId: string, chatId: string) {
    const tool = tools.find(t => t.definition.name === name);
    if (!tool) throw new Error(`Tool ${name} not found`);
    return await tool.handler(args, userId, chatId);
}
