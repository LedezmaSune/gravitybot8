export interface ParsedContact {
    number: string;
    name: string;
}

/**
 * Parses a list of contacts from a multi-line string.
 * Supports "Number, Name", "Name, Number", or "Number Name" (without comma).
 */
export function parseContacts(contactsStr: string): ParsedContact[] {
    if (!contactsStr) return [];

    return contactsStr
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Case 0: WhatsApp JID (Group or User)
            if (line.endsWith('@g.us') || line.endsWith('@s.whatsapp.net') || line.endsWith('@lid')) {
                return { number: line, name: '' };
            }

            // Case 1: Comma separated
            if (line.includes(',')) {
                const parts = line.split(',');
                const part1 = parts[0].trim();
                const part2 = parts.slice(1).join(',').trim();

                // Guess which one is the number
                if (/\d{8,}/.test(part1) || part1.endsWith('@s.whatsapp.net') || part1.endsWith('@lid')) {
                    return { number: part1, name: part2 };
                } else {
                    return { number: part2, name: part1 };
                }
            }

            // Case 2: No comma, look for a number within the string
            // Match typical phone formats: +5218181234567, 8181234567, etc.
            const numberMatch = line.match(/\+?\d{8,15}/);
            if (numberMatch) {
                const number = numberMatch[0];
                // Remove the number from the line to get the name
                const name = line.replace(number, '').replace(/^[-\s]+|[-\s]+$/g, '').trim();
                return { number, name };
            }

            // Fallback: Use the whole line as number
            return { number: line, name: '' };
        });
}
