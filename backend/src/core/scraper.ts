import axios from 'axios';

export async function scrapeUrl(url: string): Promise<string> {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = response.data as string;
        
        // Basic cleanup: remove script, style tags and then get text
        const cleanText = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "")
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, "")
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 5000); // Allow more context for knowledge base

        return cleanText;
    } catch (error: any) {
        throw new Error(`Failed to scrape ${url}: ${error.message}`);
    }
}
