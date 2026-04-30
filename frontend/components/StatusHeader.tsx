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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                    {botName || 'OpenGravity Individual'}
                </h1>
                <div className="flex items-center gap-2 text-app-text-muted">
                    <ShieldCheck size={16} className="text-cyan-600 dark:text-cyan-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                        Cerebro de {botName || 'GravityBot8'} con Protección Anti-Baneo
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 bg-slate-200/50 dark:bg-slate-900/40 backdrop-blur-md shadow-inner ${
                    status === 'connected' 
                    ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/5' 
                    : 'border-red-500/30 text-red-600 dark:text-red-400 animate-pulse'
                }`}>
                    {status === 'connected' ? <Wifi size={20} strokeWidth={2.5} /> : 
                     status === 'connecting' ? <Loader2 size={20} className="animate-spin" /> : 
                     <WifiOff size={20} />}
                    <span className="text-sm font-black uppercase tracking-widest">
                        {status}
                    </span>
                </div>
                
                <ThemeToggle />
                <UpdateChecker />

                <button 
                    onClick={onCleanUploads}
                    title="Limpiar archivos temporales"
                    className="p-3 bg-slate-200/50 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-800 rounded-2xl text-app-text-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95 shadow-lg backdrop-blur-md"
                >
                    <Trash2 size={20} />
                </button>
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
            className="p-3 bg-slate-200/50 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-800 rounded-2xl text-app-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-all active:scale-95 shadow-lg backdrop-blur-md"
            title={isDark ? "Modo Claro" : "Modo Oscuro"}
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
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
            className="p-3 bg-slate-200/50 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-800 rounded-2xl text-app-text-muted hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-all active:scale-95 shadow-lg backdrop-blur-md"
            title="Buscar actualizaciones"
        >
            {checking ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
        </button>
    );
}
