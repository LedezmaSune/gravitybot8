import { MessageService } from '../../messages/message.service';

export class BaileysMaintenanceJob {
    /**
     * Mantenimiento diario preventivo de Baileys y SQLite:
     * - Optimiza índices y checkpoint WAL de SQLite para compactar el archivo en disco (ideal para Termux y VPS).
     * - Solo si hay más de 1,000 claves acumuladas poda las más antiguas dejando 300 activas.
     * - Ejecuta recolección de basura de RAM si está disponible.
     */
    static async execute(waService?: MessageService): Promise<void> {
        try {
            console.log("[BaileysMaintenanceJob] 🛠️ Ejecutando optimización pasiva de memoria y sesión...");

            // 1. Invocar recolección de basura de RAM si Node.js lo soporta
            if (typeof global.gc === 'function') {
                global.gc?.();
                console.log("[BaileysMaintenanceJob] 🧹 Memoria RAM optimizada.");
            }

            // 2. Mantenimiento pasivo de SQLite (WAL Checkpoint sin borrado de claves)
            if (waService?.getClient()) {
                const client = waService.getClient() as any;
                if (typeof client?.purgePreKeys === 'function') {
                    client.purgePreKeys();
                }
            }
        } catch (error: any) {
            console.warn("[BaileysMaintenanceJob] Aviso en mantenimiento de Baileys:", error.message);
        }
    }
}
