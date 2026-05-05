import { execSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export class SystemUtils {
    static checkDependencies() {
        console.log("[Phase 0] Skipping slow dependency check to speed up boot...");
        // This is skipped to avoid hangs during startup. Run manually if needed.
    }

    static validateEnv() {
        console.log("[Phase 0] Validating Environment...");
        const required: string[] = []; // PORT is optional as it has a default
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            console.error(`[Phase 0] Error: Missing required environment variables: ${missing.join(', ')}`);
            process.exit(1);
        }
        
        // Check for .env file
        if (!fs.existsSync(path.resolve('.env'))) {
            console.warn("[Phase 0] Warning: .env file not found. Using defaults.");
        }
    }

    static ensureDirs() {
        const dirs = ['data', 'auth_info_baileys'];
        dirs.forEach(dir => {
            const fullPath = path.resolve(dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`[Phase 0] Created missing directory: ${dir}`);
            }
        });
    }

    static getLocalIP(): string {
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    return net.address;
                }
            }
        }
        return 'localhost';
    }
}
