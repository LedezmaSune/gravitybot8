import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';
import crypto from 'crypto';
import { bot } from '../telegram/bot';
import { getSettings } from '../core/memory';
import { InputFile } from 'grammy';

const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

function getEncryptionKey() {
    const password = process.env.DASHBOARD_PASS || 'admin123';
    return crypto.scryptSync(password, 'salt-botmare', 32);
}

function encryptFile(inputPath: string, outputPath: string) {
    const initVector = crypto.randomBytes(16);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, initVector);
    const input = fs.readFileSync(inputPath);
    const encrypted = Buffer.concat([initVector, cipher.update(input), cipher.final()]);
    fs.writeFileSync(outputPath, encrypted);
}

function decryptFile(inputPath: string, outputPath: string) {
    const input = fs.readFileSync(inputPath);
    const initVector = input.subarray(0, 16);
    const encryptedData = input.subarray(16);
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, initVector);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    fs.writeFileSync(outputPath, decrypted);
}

export class BackupService {
    private static backupDir = path.join(process.cwd(), 'backups');

    /**
     * Crea un archivo ZIP con la base de datos y configuraciones
     */
    static async createBackup(sendToTelegram: boolean = false): Promise<string> {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }

        const zip = new AdmZip();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `backup-botmare-${timestamp}.zip.enc`;
        const filePath = path.join(this.backupDir, filename);
        const tempZipPath = path.join(this.backupDir, `temp-${timestamp}.zip`);

        // 1. Incluir carpeta data (DB, WhatsApp Session, Uploads)
        const dataPath = path.join(process.cwd(), 'data');
        if (fs.existsSync(dataPath)) {
            zip.addLocalFolder(dataPath, 'data');
        }

        // 2. Incluir archivo .env
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            zip.addLocalFile(envPath);
        }

        // Guardar temporalmente y cifrar
        zip.writeZip(tempZipPath);
        encryptFile(tempZipPath, filePath);
        fs.unlinkSync(tempZipPath);

        if (sendToTelegram) {
            await this.sendBackupToTelegram(filePath, 'Manual');
        }

        // Limpiar respaldos antiguos después de crear uno nuevo
        this.cleanOldBackups();
        this.cleanOldUploads(3);

        return filePath;
    }

    /**
     * Envía un archivo de respaldo a todos los administradores configurados
     */
    static async sendBackupToTelegram(filePath: string, type: 'Manual' | 'Automático') {
        try {
            const settings = await getSettings() as any;
            const botName = settings.bot_name || process.env.NEXT_PUBLIC_APP_NAME || 'BotMaRe';
            const filename = path.basename(filePath);
            const now = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

            const caption = `🔔 *¡NOTIFICACIÓN DE RESPALDO!*\n\n` +
                            `🤖 *Bot:* ${botName}\n` +
                            `📁 *Archivo:* \`${filename}\`\n` +
                            `📅 *Fecha:* ${now}\n` +
                            `⚙️ *Tipo:* ${type}\n\n` +
                            `🔐 _El archivo está CIFRADO por seguridad (AES-256)._\n` +
                            `🔑 _La contraseña de desencriptado es la contraseña de tu Dashboard._\n\n` +
                            `💾 _Contiene: Base de Datos, Sesiones de WhatsApp y Multimedia._`;

            if (bot && settings.TELEGRAM_ALLOWED_USER_IDS) {
                const userIds = settings.TELEGRAM_ALLOWED_USER_IDS.split(',').map((id: string) => id.trim());
                for (const userId of userIds) {
                    try {
                        await bot.api.sendDocument(userId, new InputFile(filePath), {
                            caption,
                            parse_mode: 'Markdown'
                        });
                    } catch (e) {
                        console.error(`❌ Error enviando backup al usuario ${userId}:`, e);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error en el proceso de envío a Telegram:', error);
        }
    }

    /**
     * Inicia la tarea programada para respaldo diario vía Telegram
     */
    static initScheduledBackup() {
        // Ejecutar todos los días a las 3:00 AM (0 3 * * *)
        cron.schedule('0 3 * * *', async () => {
            console.log('📦 [Backup] Iniciando respaldo diario programado...');
            try {
                const filePath = await this.createBackup();
                await this.sendBackupToTelegram(filePath, 'Automático');
                
                // Limpiar respaldos antiguos (mantener solo los últimos 7 días localmente)
                this.cleanOldBackups(7);

                // Limpiar multimedia antigua (que no esté en uso y tenga más de 3 días)
                await this.cleanOldUploads(3);
                
            } catch (error) {
                console.error('❌ Error en el respaldo programado:', error);
            }
        });
    }

    /**
     * Limpia respaldos antiguos del disco (mantiene solo los últimos X días)
     */
    private static cleanOldBackups(daysToKeep: number = 7) {
        if (!fs.existsSync(this.backupDir)) return;
        
        console.log(`🧹 [Backup] Limpiando respaldos con más de ${daysToKeep} días...`);
        const files = fs.readdirSync(this.backupDir);
        const now = Date.now();
        const msPerDay = 24 * 60 * 60 * 1000;

        files.forEach(file => {
            // Solo procesar archivos .zip.enc generados por el sistema
            if (file.endsWith('.zip.enc') || file.endsWith('.zip')) {
                const filePath = path.join(this.backupDir, file);
                const stats = fs.statSync(filePath);
                
                if (now - stats.mtimeMs > (daysToKeep * msPerDay)) {
                    try {
                        fs.unlinkSync(filePath);
                        console.log(`🗑️ Borrado respaldo antiguo: ${file}`);
                    } catch (e) {
                        console.error(`❌ No se pudo borrar ${file}:`, e);
                    }
                }
            }
        });
    }

    /**
     * Restaura un respaldo desde un archivo ZIP
     */
    static async restoreBackup(zipFilePath: string): Promise<{ success: boolean; message: string }> {
        try {
            const tempDecryptedPath = path.join(this.backupDir, 'temp_decrypted.zip');
            
            // Si viene cifrado (.enc), descifrarlo primero
            if (zipFilePath.endsWith('.enc')) {
                decryptFile(zipFilePath, tempDecryptedPath);
            } else {
                fs.copyFileSync(zipFilePath, tempDecryptedPath);
            }

            const zip = new AdmZip(tempDecryptedPath);
            const tempExtractPath = path.join(this.backupDir, 'temp_restore');
            
            if (fs.existsSync(tempExtractPath)) {
                fs.rmSync(tempExtractPath, { recursive: true, force: true });
            }
            fs.mkdirSync(tempExtractPath, { recursive: true });

            // 1. Extraer a carpeta temporal
            zip.extractAllTo(tempExtractPath, true);

            // 2. Validar estructura básica (debe tener carpeta 'data')
            const extractedDataPath = path.join(tempExtractPath, 'data');
            if (!fs.existsSync(extractedDataPath)) {
                throw new Error('El archivo de respaldo no es válido o está corrupto.');
            }

            // 3. Reemplazar carpeta data
            const currentDataPath = path.join(process.cwd(), 'data');
            if (fs.existsSync(currentDataPath)) {
                fs.rmSync(currentDataPath, { recursive: true, force: true });
            }
            fs.cpSync(extractedDataPath, currentDataPath, { recursive: true });

            // 4. Reemplazar archivo .env (si existe en el backup)
            const extractedEnvPath = path.join(tempExtractPath, '.env');
            if (fs.existsSync(extractedEnvPath)) {
                const currentEnvPath = path.join(process.cwd(), '.env');
                fs.copyFileSync(extractedEnvPath, currentEnvPath);
            }

            // 5. Limpieza
            fs.rmSync(tempExtractPath, { recursive: true, force: true });
            if (fs.existsSync(tempDecryptedPath)) {
                fs.unlinkSync(tempDecryptedPath);
            }
            
            return { 
                success: true, 
                message: 'Información restaurada con éxito. El bot debe reiniciarse para aplicar todos los cambios.' 
            };
        } catch (error: any) {
            console.error('❌ Error en restauración:', error);
            return { success: false, message: error.message || 'Error desconocido durante la restauración.' };
        }
    }

    /**
     * Limpia archivos multimedia antiguos que ya no están en recordatorios activos
     */
    static async cleanOldUploads(daysToKeep: number = 3) {
        const uploadDir = path.join(process.cwd(), 'data', 'uploads');
        if (!fs.existsSync(uploadDir)) return;

        console.log(`🧹 [System] Iniciando limpieza de multimedia antigua (>${daysToKeep} días)...`);
        
        try {
            const { listReminders } = require('../core/memory');
            const files = fs.readdirSync(uploadDir);
            const now = Date.now();
            const msThreshold = daysToKeep * 24 * 60 * 60 * 1000;

            // Obtener lista de archivos que SÍ están en uso por recordatorios pendientes
            const pendingReminders = await listReminders('owner');
            const activePaths = new Set(pendingReminders.map((r: any) => r.mediaPath).filter(Boolean));

            let deletedCount = 0;
            files.forEach(file => {
                const filePath = path.join(uploadDir, file);
                const stats = fs.statSync(filePath);

                // Si el archivo NO está en uso Y es más viejo que el umbral
                if (!activePaths.has(filePath) && (now - stats.mtimeMs > msThreshold)) {
                    try {
                        fs.unlinkSync(filePath);
                        deletedCount++;
                    } catch (e) {
                        console.error(`❌ No se pudo borrar multimedia ${file}:`, e);
                    }
                }
            });

            if (deletedCount > 0) {
                console.log(`✅ [System] Se borraron ${deletedCount} archivos multimedia antiguos.`);
            }
        } catch (error) {
            console.error('❌ Error en la limpieza de multimedia:', error);
        }
    }

    static getBackupDir() {
        return this.backupDir;
    }
}
