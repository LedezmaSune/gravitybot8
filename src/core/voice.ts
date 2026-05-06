import { getAudioBase64 } from 'google-tts-api';

export async function textToSpeech(text: string): Promise<Buffer | null> {
    try {
        const b64 = await getAudioBase64(text, {
            lang: 'es',
            slow: false,
            host: 'https://translate.google.com',
        });
        
        return Buffer.from(b64, 'base64');
    } catch (error) {
        console.error("TTS Error:", error);
        return null;
    }
}
