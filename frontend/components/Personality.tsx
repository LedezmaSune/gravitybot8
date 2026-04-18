'use client';

import { useState } from 'react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { Settings as UserSettings } from '../types';

interface PersonalityProps {
    initialSettings: UserSettings;
    onUpdate: (settings: UserSettings) => Promise<void>;
}

export function Personality({ initialSettings, onUpdate }: PersonalityProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onUpdate(settings);
        setLoading(false);
    };

    return (
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 lg:p-8 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                    <Brain size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Personalidad del Bot</h2>
                    <p className="text-slate-400 text-sm">Define cómo piensa y responde tu asistente.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Nombre del Bot</label>
                        <input
                            type="text"
                            value={settings.bot_name}
                            onChange={(e) => setSettings({...settings, bot_name: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            placeholder="Ej: Wamasivos AI"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">System Prompt (Instrucciones)</label>
                        <textarea
                            value={settings.system_prompt}
                            onChange={(e) => setSettings({...settings, system_prompt: e.target.value})}
                            className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none resize-none transition-all"
                            placeholder="Eres un asistente útil..."
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Reglas y Conocimiento</label>
                        <textarea
                            value={settings.possible_responses}
                            onChange={(e) => setSettings({...settings, possible_responses: e.target.value})}
                            className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none resize-none transition-all font-mono"
                            placeholder="Regla 1: ..."
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-800/50">
                        <label className="text-[10px] uppercase font-bold text-cyan-500 mb-2 block tracking-widest">🚀 Aprendizaje Automático (URL)</label>
                        <div className="flex gap-2">
                            <input
                                id="learn-url-input"
                                type="text"
                                placeholder="https://tu-web.com/info"
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    const input = document.getElementById('learn-url-input') as HTMLInputElement;
                                    const url = input?.value;
                                    if (!url) return alert('Ingresa una URL válida');
                                    
                                    setLoading(true);
                                    try {
                                        const res = await fetch('http://localhost:3001/api/settings/learn-url', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ url })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            alert(`¡Aprendido! Se añadieron ${data.learnedCount} caracteres a la memoria.`);
                                            // Recargar settings
                                            const sRes = await fetch('http://localhost:3001/api/settings');
                                            if (sRes.ok) setSettings(await sRes.json());
                                            input.value = '';
                                        } else {
                                            alert('Error: ' + data.error);
                                        }
                                    } catch (e) {
                                        alert('Error de conexión');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-cyan-500/30"
                            >
                                Aprender
                            </button>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-2 italic">El bot leerá la web y guardará el texto en "Reglas y Conocimiento".</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    {loading ? 'Sincronizando...' : 'Actualizar Inteligencia'}
                </button>
            </form>
        </section>
    );
}
