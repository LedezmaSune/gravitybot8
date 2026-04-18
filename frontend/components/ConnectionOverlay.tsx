'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Loader2, ShieldCheck } from 'lucide-react';

interface ConnectionOverlayProps {
    qr: string | null;
    status: string;
}

export function ConnectionOverlay({ qr, status }: ConnectionOverlayProps) {
    if (status === 'connected') return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-700">
            {/* Ambient Background for Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative w-full max-w-lg bg-slate-900/40 border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-center overflow-hidden border-t-white/20">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                
                <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-cyan-500/20 mb-6 group">
                        <Smartphone size={40} className="group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2">Vincular Dispositivo</h2>
                    <p className="text-slate-400 text-sm font-medium">Escanea el código para activar la Inteligencia de Wamasivos</p>
                </div>

                <div className="relative inline-block group">
                    {/* Corner Borders */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-cyan-500 rounded-tl-xl transition-all group-hover:-translate-x-1 group-hover:-translate-y-1"></div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-xl transition-all group-hover:translate-x-1 group-hover:-translate-y-1"></div>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-xl transition-all group-hover:-translate-x-1 group-hover:translate-y-1"></div>
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-cyan-500 rounded-br-xl transition-all group-hover:translate-x-1 group-hover:translate-y-1"></div>

                    <div className="bg-white p-6 rounded-3xl shadow-2xl relative z-10">
                        {qr ? (
                            <QRCodeSVG 
                                value={qr} 
                                size={220} 
                                level="H"
                                includeMargin={false}
                                imageSettings={{
                                    src: "/logo.png", // Por si quieres poner un logo luego
                                    x: undefined,
                                    y: undefined,
                                    height: 40,
                                    width: 40,
                                    excavate: true,
                                }}
                            />
                        ) : (
                            <div className="w-[220px] h-[220px] flex flex-col items-center justify-center text-slate-300 gap-4">
                                <Loader2 size={48} className="animate-spin text-cyan-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Generando acceso...</span>
                                
                                <button 
                                    onClick={async () => {
                                        if (confirm('Deseas reiniciar la sesión de WhatsApp? Esto borrará los datos de conexión actuales.')) {
                                            const res = await fetch('/api/system/reset-whatsapp', { method: 'POST' });
                                            if (res.ok) alert('Reinicio iniciado. Por favor espera unos segundos.');
                                        }
                                    }}
                                    className="mt-2 text-[8px] text-slate-500 hover:text-cyan-500 underline underline-offset-4 uppercase tracking-widest transition-colors font-bold"
                                >
                                    ¿No aparece el código? Reiniciar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 space-y-6">
                    <div className="flex items-center justify-center gap-8 text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-white/5">1</div>
                            <span className="text-[10px] uppercase font-bold tracking-tighter">Abre WA</span>
                        </div>
                        <div className="w-12 h-px bg-slate-800"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-white/5">2</div>
                            <span className="text-[10px] uppercase font-bold tracking-tighter">Vincular</span>
                        </div>
                        <div className="w-12 h-px bg-slate-800"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-white/5">3</div>
                            <span className="text-[10px] uppercase font-bold tracking-tighter">Escanea</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 py-2 px-4 rounded-full border border-emerald-500/20 w-fit mx-auto">
                        <ShieldCheck size={14} />
                        Cifrado de Punto a Punto activo
                    </div>
                </div>
            </div>
        </div>
    );
}
