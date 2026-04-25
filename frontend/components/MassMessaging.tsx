'use client';

import { useState } from 'react';
import { Megaphone, Upload, Wand2, Loader2, Send } from 'lucide-react';
import { VariableTextarea } from './VariableTextarea';

interface MassMessagingProps {
    onSend: (contacts: string, message: string, media: File | null) => Promise<void>;
    onReview: (text: string) => Promise<string | null>;
}

export function MassMessaging({ onSend, onReview }: MassMessagingProps) {
    const [contacts, setContacts] = useState('');
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [reviewing, setReviewing] = useState(false);

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setContacts(text);
        };
        reader.readAsText(file);
    };

    const handleReview = async () => {
        if (!message) return;
        setReviewing(true);
        const corrected = await onReview(message);
        if (corrected) setMessage(corrected);
        setReviewing(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        await onSend(contacts, message, media);
        setLoading(false);
    };

    const contactCount = contacts.split(/[\n,]+/).filter(c => c.trim()).length;

    return (
        <section className="bg-app-card border border-app-border rounded-3xl p-6 lg:p-8 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto shadow-2xl relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                    <Megaphone size={32} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-app-text">Difusión Masiva con IA</h2>
                    <p className="text-app-text-muted text-sm font-medium mt-1">Envía mensajes enriquecidos y archivos a multitudes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                {/* Contacts */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] uppercase font-bold text-app-text-muted tracking-widest flex items-center gap-2">
                            Base de Datos
                            <label className="cursor-pointer bg-slate-200 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md text-[9px] transition-colors border border-slate-300 dark:border-slate-700/50 flex items-center gap-1 active:scale-95">
                                <Upload size={12} /> Subir CSV
                                <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                            </label>
                        </label>
                        <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                            {contactCount} contactos
                        </span>
                    </div>
                    <textarea 
                        value={contacts}
                        onChange={(e) => setContacts(e.target.value)}
                        placeholder="521234567890, Nombre&#10;523311223344, Cliente"
                        className="w-full h-80 bg-app-bg dark:bg-background border border-app-border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-500/30 outline-none transition-all resize-none font-mono text-app-text placeholder:text-app-text-muted/50 shadow-inner"
                    />
                </div>

                {/* Message */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] uppercase font-bold text-app-text-muted tracking-widest">Cuerpo del Mensaje</label>
                            <button 
                                onClick={handleReview}
                                disabled={reviewing || !message}
                                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-all hover:bg-cyan-500/20 disabled:opacity-30 active:scale-95"
                            >
                                {reviewing ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />}
                                Perfeccionar con IA
                            </button>
                        </div>
                        <VariableTextarea 
                            value={message}
                            onChange={(val) => setMessage(val)}
                            placeholder="Hola {NOMBRE}, ¿cómo estás?..."
                            className="w-full h-44 bg-app-bg dark:bg-background border border-app-border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-500/30 outline-none transition-all resize-none shadow-inner text-app-text placeholder:text-app-text-muted/50"
                        />
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4">
                        <label className="text-[10px] uppercase font-bold text-app-text-muted tracking-widest flex items-center gap-2 mb-2">Adjunto de Seguridad</label>
                        <input 
                            type="file" 
                            onChange={(e) => setMedia(e.target.files?.[0] || null)}
                            className="block w-full text-xs text-app-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-slate-200 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-300 dark:hover:file:bg-slate-700 transition-all cursor-pointer"
                        />
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={loading || !contacts || !message}
                        className="w-full py-5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-900/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        {loading ? 'Lanzando...' : 'Iniciar Difusión Massiva'}
                    </button>
                </div>
            </div>
        </section>
    );
}
