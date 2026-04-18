'use client';

import { useState } from 'react';
import { Bell, Loader2, Send, Clock, Trash2 } from 'lucide-react';
import { Reminder } from '../types';

interface RemindersProps {
    reminders: Reminder[];
    onAdd: (chatId: string, text: string, time: string, media: File | null) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export function Reminders({ reminders, onAdd, onDelete }: RemindersProps) {
    const [chatId, setChatId] = useState('');
    const [text, setText] = useState('');
    const [time, setTime] = useState('');
    const [media, setMedia] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onAdd(chatId, text, time, media);
        setChatId('');
        setText('');
        setTime('');
        setMedia(null);
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <section className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-500 shadow-2xl h-fit">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Programar</h2>
                        <p className="text-slate-500 text-xs">Recordatorios automáticos.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block tracking-widest">WhatsApp ID / Grupo</label>
                            <input
                                type="text"
                                value={chatId}
                                onChange={(e) => setChatId(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                placeholder="521..."
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block tracking-widest">Mensaje</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none resize-none transition-all"
                                placeholder="Escribe tu mensaje..."
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block tracking-widest">Fecha y Hora (CDMX)</label>
                            <input
                                type="datetime-local"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block tracking-widest">Multimedia (Opcional)</label>
                            <input
                                type="file"
                                onChange={(e) => setMedia(e.target.files?.[0] || null)}
                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        {loading ? 'Programando...' : 'Fijar Recordatorio'}
                    </button>
                </form>
            </section>

            {/* List */}
            <section className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reminders.map((r) => (
                        <div 
                            key={r.id} 
                            className={`group relative bg-slate-900/40 border ${
                                r.status === 'sent' ? 'border-emerald-500/20' : 
                                r.status === 'failed' ? 'border-red-500/20' : 
                                r.status === 'processing' ? 'border-cyan-500/30' : 'border-slate-800'
                            } rounded-3xl p-6 backdrop-blur-md transition-all hover:translate-y-[-2px] shadow-xl overflow-hidden`}
                        >
                            {/* Status logic decoration... (kept clean for space) */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                    r.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400' : 
                                    r.status === 'failed' ? 'bg-red-500/10 text-red-400' : 
                                    r.status === 'processing' ? 'bg-cyan-500/10 text-cyan-400 animate-pulse' : 'bg-slate-800 text-slate-400'
                                }`}>
                                    {r.status}
                                </span>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold tabular-nums">{r.time}</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-200 line-clamp-3 mb-4 leading-relaxed">{r.text}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                <div className="text-[10px] text-slate-500 font-bold tracking-tight truncate max-w-[150px]">
                                    A: {r.chatId}
                                </div>
                                <button 
                                    onClick={() => onDelete(r.id)}
                                    className="text-red-500/70 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {reminders.length === 0 && (
                        <div className="col-span-full py-20 bg-slate-900/20 border border-slate-800/50 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-600">
                            <Bell size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-medium">Bandeja de salida vacía.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
