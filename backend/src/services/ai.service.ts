import { callLLM } from '../core/llm';

export class AIService {
    async reviewMessage(text: string) {
        const prompt = `Eres un experto en comunicación y marketing. Corrige la ortografía y mejora el siguiente texto, agregando emojis apropiados para WhatsApp sin cambiar la intención original. IMPORTANTÍSIMO: Si el texto contiene la etiqueta {nombre} o {{nombre}}, consérvala EXACTAMENTE IGUAL en el lugar donde esté, ya que es una variable de sistema. Solo devuelve el texto corregido, sin explicaciones ni comillas extra:\n\n${text}`;
        const response = await callLLM([{ role: 'user', content: prompt }]);
        return response.content;
    }
}
