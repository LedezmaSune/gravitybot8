'use client';

import { Wifi, WifiOff, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { ConnectionState } from '../types';

interface StatusHeaderProps {
    status: ConnectionState;
    qr: string | null;
    onCleanUploads: () => void;
}

export function StatusHeader({ status, qr, onCleanUploads }: StatusHeaderProps) {
    void qr;
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                    OpenGravity Individual
                </h1>
                <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck size={16} className="text-cyan-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                        Cerebro de GravityBot8 con Protección Anti-Baneo
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 bg-slate-900/40 backdrop-blur-md shadow-inner ${
                    status === 'connected' 
                    ? 'border-emerald-500/30 text-emerald-400 shadow-emerald-500/5' 
                    : 'border-red-500/30 text-red-400 animate-pulse'
                }`}>
                    {status === 'connected' ? <Wifi size={20} strokeWidth={2.5} /> : 
                     status === 'connecting' ? <Loader2 size={20} className="animate-spin" /> : 
                     <WifiOff size={20} />}
                    <span className="text-sm font-black uppercase tracking-widest">
                        {status}
                    </span>
                </div>
                
                <button 
                    onClick={onCleanUploads}
                    title="Limpiar archivos temporales"
                    className="p-3 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95 shadow-lg backdrop-blur-md"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </header>
    );
}
