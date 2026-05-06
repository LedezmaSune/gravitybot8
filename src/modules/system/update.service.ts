import axios from 'axios';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export class UpdateService {
    private repoUrl = 'https://api.github.com/repos/LedezmaSune/BotMaRe/commits/main';
    private currentVersionFile = path.resolve('package.json');

    async checkUpdate() {
        try {
            // Get local version accurately
            const pkg = JSON.parse(fs.readFileSync(this.currentVersionFile, 'utf8'));
            const localVersion = pkg.version || "1.0.0";

            // Check remote for latest commit (simple way to see if there's 'something' new)
            // Or ideally a version.json if we want to be more specific
            const response = await axios.get(this.repoUrl, {
                timeout: 5000,
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });

            const remoteCommit = response.data.sha;
            
            // Check current local commit hash
            let localCommit = "";
            try {
                localCommit = execSync('git rev-parse HEAD').toString().trim();
            } catch (e) {
                localCommit = "unknown";
            }

            return {
                currentVersion: localVersion,
                localCommit: localCommit.substring(0, 7),
                remoteCommit: remoteCommit.substring(0, 7),
                updateAvailable: localCommit !== remoteCommit && localCommit !== "unknown",
            };
        } catch (error: any) {
            console.error('[UpdateService] Error checking for updates:', error.message);
            return { error: error.message };
        }
    }

    async performUpdate() {
        try {
            console.log('[UpdateService] Starting update process...');
            // 1. Fetch latest
            execSync('git fetch origin main');
            // 2. Reset to origin (caution: overwrites local changes)
            execSync('git reset --hard origin/main');
            // 3. Re-install deps if needed
            // This might take a while, maybe just tell the user to restart
            return { success: true, message: "Actualización descargada. Reinicia el sistema para aplicar cambios." };
        } catch (error: any) {
            console.error('[UpdateService] Update failed:', error.message);
            return { success: false, error: error.message };
        }
    }
}
