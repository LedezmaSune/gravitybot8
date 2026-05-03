/**
 * Utilidades para procesamiento de datos en el Frontend
 */

export interface Contact {
    number: string;
    name: string;
}

/**
 * Procesa una cadena de texto con contactos (uno por línea)
 * Soporta formatos: 
 * - Numero, Nombre
 * - Nombre, Numero
 * - Solo Numero
 */
export const parseContactList = (text: string): Contact[] => {
    return text
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
            const cleanLine = line.trim();
            
            // Caso 1: Separado por coma
            if (cleanLine.includes(',')) {
                const parts = cleanLine.split(',');
                const part1 = parts[0].trim();
                const part2 = parts.slice(1).join(',').trim();
                // Si la primera parte es un número de al menos 8 dígitos
                if (/\d{8,}/.test(part1)) return { number: part1, name: part2 };
                return { number: part2, name: part1 };
            }

            // Caso 2: Sin coma, buscar número dentro del texto
            const numberMatch = cleanLine.match(/\+?\d{8,15}/);
            if (numberMatch) {
                const number = numberMatch[0];
                const name = cleanLine.replace(number, '').replace(/^[-\s]+|[-\s]+$/g, '').trim();
                return { number, name };
            }

            // Caso 3: Solo el texto tal cual
            return { number: cleanLine, name: '' };
        });
};
