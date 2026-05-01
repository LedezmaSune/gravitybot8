import OpenAI from "openai";

function getApiKeys(envValue: string | undefined): string[] {
    if (!envValue) return [];
    return envValue.split(',').map(k => k.trim().replace(/^["']|["']$/g, ''));
}

const LLM_TIMEOUT_MS = 15000;        // 15s para la mayoría de proveedores
const LLM_TIMEOUT_NVIDIA_MS = 5000;  // 5s para NVIDIA (suele estar congestionado)

async function tryProvider(
    providerName: string,
    keys: string[],
    config: any,
    messages: any[],
    tools: any[] | undefined,
    hasVision: boolean
): Promise<any> {
    for (const key of keys) {
        try {
            const client = new OpenAI({ ...config, apiKey: key });
            const payload: any = {
                model: config.model,
                messages: messages,
                max_tokens: config.max_tokens || 300,
                ...(tools && tools.length > 0 && !(hasVision && providerName === 'Groq') ? { tools } : {}),
            };
            
            if (config.extraBody) {
                payload.extra_body = config.extraBody;
            }
            if (config.temperature) payload.temperature = config.temperature;
            if (config.top_p) payload.top_p = config.top_p;

            // Race between the LLM call and a timeout (NVIDIA gets a shorter timeout)
            const timeout = providerName === 'Nvidia' ? LLM_TIMEOUT_NVIDIA_MS : LLM_TIMEOUT_MS;
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
            );

            const response = await Promise.race([
                client.chat.completions.create(payload),
                timeoutPromise
            ]) as any;

            console.log(`[LLM] ${providerName} (${config.model}) Responded successfully.`);
            return response.choices[0]?.message;
        } catch (error: any) {
            console.warn(`[LLM] ${providerName} Key Failed: ${error.message}`);
            // Always continue to next key on any error
            continue;
        }
    }
    throw new Error(`All ${providerName} keys failed or timed out`);
}

function cleanMessages(messages: any[]): any[] {
    return messages.map((msg: any) => {
        let content = msg.content;
        
        // Fix for Groq expecting text parts with images, or non-null content
        if (Array.isArray(content)) {
            const hasText = content.some((c: any) => c.type === 'text');
            if (!hasText) {
                content = [...content, { type: 'text', text: 'Imagen adjunta' }];
            }
        } else if (!content && msg.role !== 'assistant') {
            content = " "; // Prevent empty content errors for users
        }

        return {
            role: msg.role,
            content: content,
            ...(msg.name && { name: msg.name }),
            ...(msg.tool_calls && { tool_calls: msg.tool_calls }),
            ...(msg.tool_call_id && { tool_call_id: msg.tool_call_id }),
        };
    });
}

export async function callLLM(
    messages: any[],
    tools?: any[]
): Promise<any> {
    const cleanedMessages = cleanMessages(messages);
    const hasVision = messages.some(m => Array.isArray(m.content) && m.content.some((c: any) => c.type === 'image_url'));

    // 0. Try Nvidia (DeepSeek)
    const nvidiaKeys = getApiKeys(process.env.NVIDIA_API_KEY);
    if (nvidiaKeys.length > 0) {
        try {
            return await tryProvider('Nvidia', nvidiaKeys, {
                baseURL: "https://integrate.api.nvidia.com/v1",
                model: process.env.NVIDIA_MODEL || "deepseek-ai/deepseek-v4-pro",
                max_tokens: 4000,
                temperature: 1,
                top_p: 0.95,
                extraBody: { chat_template_kwargs: { thinking: false } }
            }, cleanedMessages, tools, hasVision);
        } catch (e) {}
    }

    // 1. Try Groq
    const groqKeys = getApiKeys(process.env.GROQ_API_KEY);
    if (groqKeys.length > 0) {
        try {
            return await tryProvider('Groq', groqKeys, {
                baseURL: "https://api.groq.com/openai/v1",
                model: hasVision ? "llama-3.2-11b-vision-instant" : "llama-3.3-70b-versatile"
            }, cleanedMessages, tools, hasVision);
        } catch (e) {}
    }

    // 2. Try Gemini
    const geminiKeys = getApiKeys(process.env.GEMINI_API_KEY);
    if (geminiKeys.length > 0) {
        try {
            return await tryProvider('Gemini', geminiKeys, {
                baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
                model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
            }, cleanedMessages, tools, hasVision);
        } catch (e) {}
    }

    // 3. Try OpenAI
    const openaiKeys = getApiKeys(process.env.OPENAI_API_KEY);
    if (openaiKeys.length > 0) {
        try {
            return await tryProvider('OpenAI', openaiKeys, {
                model: process.env.OPENAI_MODEL || "gpt-4o-mini"
            }, cleanedMessages, tools, hasVision);
        } catch (e) {}
    }

    const orKeys = getApiKeys(process.env.OPENROUTER_API_KEY);
    if (orKeys.length > 0) {
        try {
            return await tryProvider('OpenRouter', orKeys, {
                baseURL: "https://openrouter.ai/api/v1",
                model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free",
                defaultHeaders: {
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "BotFree AI",
                }
            }, cleanedMessages, tools, hasVision);
        } catch (e) {}
    }

    throw new Error("No LLM provider configured or all providers failed.");
}

export async function transcribeAudio(audioBuffer: Buffer) {
    const groqKeys = getApiKeys(process.env.GROQ_API_KEY);
    if (groqKeys.length === 0) throw new Error("Groq API key required for transcription");
    
    try {
        const client = new OpenAI({ apiKey: groqKeys[0], baseURL: "https://api.groq.com/openai/v1" });
        const response = await client.audio.transcriptions.create({
            file: await OpenAI.toFile(audioBuffer, "voice.ogg"),
            model: "whisper-large-v3",
        });
        return response.text;
    } catch (error: any) {
        console.error("Transcription error:", error.message);
        throw error;
    }
}
