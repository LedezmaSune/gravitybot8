export interface Audit {
    id: number;
    userId: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface Reminder {
    id: number;
    userId: string;
    chatId: string;
    title?: string;
    text: string;
    time: string;
    status: 'pending' | 'processing' | 'sent' | 'failed';
    mediaPath?: string;
    mediaType?: string;
    repeat?: string;
    repeatInterval?: number;
    repeatUnit?: string;
}

export interface Settings {
    bot_name: string;
    system_prompt: string;
    possible_responses: string;
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected';

export interface Template {
    id: number;
    name: string;
    content: string;
    timestamp: string;
}
