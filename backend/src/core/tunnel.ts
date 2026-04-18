import { tunnel } from 'cloudflared';
import { EventEmitter } from 'events';

export class TunnelService extends EventEmitter {
    private static instance: TunnelService;
    private tunnelProcess: any = null;
    private publicUrl: string | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): TunnelService {
        if (!TunnelService.instance) {
            TunnelService.instance = new TunnelService();
        }
        return TunnelService.instance;
    }

    public async start(port: number): Promise<string> {
        return new Promise((resolve, reject) => {
            console.log(`[Tunnel] Starting Cloudflare Quick Tunnel for port ${port}...`);
            
            try {
                const tunnelInstance = tunnel({
                    url: `http://localhost:${port}`,
                });
                this.tunnelProcess = tunnelInstance;

                console.log("[Tunnel] Tunnel instance created, waiting for events...");

                // Capture raw output for debugging
                (tunnelInstance as any).addHandler((output: string) => {
                    if (output.includes('error') || output.includes('Error') || output.includes('failed')) {
                        console.error(`[Tunnel-Log] ${output.trim()}`);
                    } else {
                        console.log(`[Tunnel-Log] ${output.trim()}`);
                    }
                });

                tunnelInstance.on('url', (url: string) => {
                    this.publicUrl = url;
                    console.log(`\n-----------------------------------------`);
                    console.log(`🌍 TUNEL ACTIVO: ${url}`);
                    console.log(`-----------------------------------------\n`);
                    this.emit('started', url);
                    resolve(url);
                });

                tunnelInstance.on('error', (err: any) => {
                    console.error("[Tunnel] EVENT 'error' received:", err);
                    reject(err);
                });

                tunnelInstance.on('exit', (code: number | null) => {
                    console.warn(`[Tunnel] EVENT 'exit' received with code: ${code}`);
                    if (!this.publicUrl) {
                        reject(new Error(`Cloudflared process exited with code ${code} before providing a URL.`));
                    }
                });

                // Fail if no URL after 30 seconds
                setTimeout(() => {
                    if (!this.publicUrl) {
                        console.error("[Tunnel] Timeout reached: No URL was generated after 30s.");
                        reject(new Error("Cloudflare tunnel timeout: URL not received."));
                    }
                }, 30000);

            } catch (error: any) {
                console.error(`[Tunnel] Synchronous error during tunnel() call:`, error);
                reject(error);
            }
        });
    }

    public stop() {
        if (this.tunnelProcess) {
            console.log(`[Tunnel] Stopping tunnel...`);
            this.tunnelProcess.stop();
            this.tunnelProcess = null;
            this.publicUrl = null;
        }
    }

    public getUrl(): string | null {
        return this.publicUrl;
    }
}
