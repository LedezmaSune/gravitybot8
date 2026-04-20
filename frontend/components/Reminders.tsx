'use client';

import { useState } from 'react';
import { Bell, Loader2, Send, Clock, Trash2, CheckCircle, Edit3, Zap, Save } from 'lucide-react';
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
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (editingId) {
            // Update logic
            await fetch(`http://localhost:3001/api/reminders/${editingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, text, time })
            });
            setEditingId(null);
        } else {
            await onAdd(chatId, text, time, media);
        }
        setChatId('');
        setText('');
        setTime('');
        setMedia(null);
        setLoading(false);
    };

    const handleEdit = (r: Reminder) => {
        setEditingId(r.id);
        setChatId(r.chatId);
        setText(r.text);
        // Date format handling for datetime-local
        setTime(r.time); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSendNow = async (id: number) => {
        if (!confirm('¿Enviar este mensaje ahora mismo?')) return;
        setLoading(true);
        try {
            await fetch(`http://localhost:3001/api/reminders/${id}/send-now`, { method: 'POST' });
            // Refresh logic usually handled by parent polling but we can force it if needed
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <section className="lg:col-span-1 bg-app-card border border-app-border rounded-3xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-500 shadow-2xl h-fit transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        {editingId ? <Edit3 size={24} /> : <Bell size={24} />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Programar'}</h2>
                        <p className="text-slate-500 text-xs">{editingId ? 'Modifica el recordatorio.' : 'Recordatorios automáticos.'}</p>
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
                                className="w-full bg-background border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                placeholder="521..."
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block tracking-widest">Mensaje</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-24 bg-background border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none resize-none transition-all"
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
                                className="w-full bg-background border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                required
                            />
                        </div>
                        {!editingId && (
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block tracking-widest">Multimedia (Opcional)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setMedia(e.target.files?.[0] || null)}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 transition-all cursor-pointer"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setChatId('');
                                    setText('');
                                    setTime('');
                                }}
                                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-[2] py-4 ${editingId ? 'bg-purple-600 hover:bg-purple-500' : 'bg-cyan-600 hover:bg-cyan-500'} text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Save size={20} /> : <Send size={20} />)}
                            {loading ? (editingId ? 'Guardando...' : 'Programando...') : (editingId ? 'Guardar Cambios' : 'Fijar Recordatorio')}
                        </button>
                    </div>
                </form>
            </section>

            {/* List */}
            <section className="lg:col-span-2 space-y-8">
                {/* Pending List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-2">Pendientes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reminders.filter(r => r.status !== 'sent').map((r) => (
                            <div 
                                key={r.id} 
                                className={`group relative bg-app-card border ${
                                    r.status === 'failed' ? 'border-red-500/20' : 
                                    r.status === 'processing' ? 'border-cyan-500/30' : 'border-app-border'
                                } rounded-3xl p-6 backdrop-blur-md transition-all hover:translate-y-[-2px] shadow-xl overflow-hidden`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                        r.status === 'failed' ? 'bg-red-500/10 text-red-400' : 
                                        r.status === 'processing' ? 'bg-cyan-500/10 text-cyan-400 animate-pulse' : 'bg-background/80 text-app-text/50'
                                    }`}>
                                        {r.status}
                                    </span>
                                    <div className="flex items-center gap-2 text-app-text/40">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-bold tabular-nums">{r.time}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-app-text/80 line-clamp-2 mb-4 leading-relaxed">{r.text}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-app-border">
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => handleEdit(r)}
                                            className="text-slate-400 hover:text-cyan-400 p-2 rounded-lg transition-all hover:bg-cyan-500/10"
                                            title="Editar"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleSendNow(r.id)}
                                            className="text-slate-400 hover:text-amber-400 p-2 rounded-lg transition-all hover:bg-amber-500/10"
                                            title="Enviar ahora"
                                        >
                                            <Zap size={16} />
                                        </button>
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
                    </div>
                </div>

                {/* Sent List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center pl-2">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500/70">Enviados</h3>
                        <button 
                            onClick={() => {
                                if(confirm('¿Borrar todos los mensajes enviados?')) {
                                    reminders.filter(r => r.status === 'sent').forEach(r => onDelete(r.id));
                                }
                            }}
                            className="text-[10px] font-bold text-red-400/60 hover:text-red-400 uppercase tracking-tighter transition-all"
                        >
                            Limpiar Historial
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reminders.filter(r => r.status === 'sent').map((r) => (
                            <div 
                                key={r.id} 
                                className="group relative bg-emerald-500/[0.03] border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md transition-all shadow-lg overflow-hidden animate-in fade-in zoom-in duration-500"
                            >
                                <div className="absolute -right-4 -top-4 text-emerald-500/10 transition-all group-hover:scale-110 group-hover:text-emerald-500/20">
                                    <CheckCircle size={80} />
                                </div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                                        Entregado
                                    </span>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-bold tabular-nums">{r.time}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500/80 line-clamp-3 mb-4 leading-relaxed relative z-10 line-through decoration-slate-600/50">{r.text}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
                                    <div className="text-[10px] text-slate-500 font-bold tracking-tight truncate max-w-[150px]">
                                        A: {r.chatId}
                                    </div>
                                    <button 
                                        onClick={() => onDelete(r.id)}
                                        className="text-red-500/60 hover:text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-all bg-slate-900/50"
                                        title="Borrar del historial"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {reminders.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-900/20 border border-slate-800/50 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-600">
                        <Bell size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">Bandeja de salida vacía.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
