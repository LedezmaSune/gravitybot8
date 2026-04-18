export interface Reminder {
    id: number;
    userId: string;
    chatId: string;
    text: string;
    time: string;
    mediaPath?: string;
    mediaType?: string;
    status: 'pending' | 'processing' | 'sent' | 'failed';
    timestamp: string;
}

export interface Settings {
    bot_name: string;
    system_prompt: string;
    possible_responses: string;
    [key: string]: string;
}

export interface Audit {
    id: number;
    userId: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface Contact {
    number: string;
    name: string;
}

export interface WhatsAppStatus {
    state: 'connecting' | 'connected' | 'disconnected';
    qr: string | null;
}
