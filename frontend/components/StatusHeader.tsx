'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldCheck, Trash2, Loader2, RefreshCw, Sun, Moon } from 'lucide-react';
import { ConnectionState } from '../types';

interface StatusHeaderProps {
    status: ConnectionState;
    qr: string | null;
    onCleanUploads: () => void;
    botName?: string;
}

export function StatusHeader({ status, qr, onCleanUploads, botName }: StatusHeaderProps) {
    void qr;
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="text-white text-3xl font-black italic">G</span>
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                        {botName || 'Gravity Individual'}
                    </h1>
                    <div className="flex items-center gap-2 text-app-text-muted">
                        <ShieldCheck size={14} className="text-cyan-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                            Cerebro de {botName || 'GravityBot'} • Anti-Ban v2.4
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border transition-all duration-500 bg-app-card backdrop-blur-xl shadow-xl ${
                    status === 'connected' 
                    ? 'border-emerald-500/20 text-emerald-400 shadow-emerald-500/5' 
                    : 'border-red-500/20 text-red-400 animate-pulse'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                        {status}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 bg-app-card p-1.5 rounded-2xl border border-app-border backdrop-blur-xl">
                    <ThemeToggle />
                    <UpdateChecker />
                    <button 
                        onClick={onCleanUploads}
                        title="Limpiar archivos temporales"
                        className="p-2.5 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-95"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}

function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const initial = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDark(initial);
        if (initial) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        const theme = next ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        if (next) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    return (
        <button 
            onClick={toggle}
            className="p-2.5 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all active:scale-95"
            title={isDark ? "Modo Claro" : "Modo Oscuro"}
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}

function UpdateChecker() {
    const [updateInfo, setUpdateInfo] = useState<any>(null);
    const [checking, setChecking] = useState(false);

    const check = async () => {
        setChecking(true);
        try {
            const res = await fetch('/api/system/check-update');
            const data = await res.json();
            setUpdateInfo(data);
        } catch (e) {
            console.error(e);
        } finally {
            setChecking(false);
        }
    };

    const apply = async () => {
        if (!confirm('¿Quieres aplicar la actualización? Esto sobreescribirá cambios locales y reiniciará el bot.')) return;
        try {
            const res = await fetch('/api/system/apply-update', { method: 'POST' });
            const data = await res.json();
            alert(data.message || data.error);
        } catch (e) {
            alert('Error al aplicar actualización');
        }
    };

    if (updateInfo?.updateAvailable) {
        return (
            <button 
                onClick={apply}
                className="flex items-center gap-2 px-4 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-500/30 transition-all animate-pulse"
            >
                ¡Actualización Disponible!
            </button>
        );
    }

    return (
        <button 
            onClick={check}
            disabled={checking}
            className="p-2.5 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all active:scale-95"
            title="Buscar actualizaciones"
        >
            {checking ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
        </button>
    );
}
