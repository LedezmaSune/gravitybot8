'use client';

import { useState } from 'react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { Settings as UserSettings } from '../types';
import { siteConfig } from '../config';

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
        <section className="bg-app-card border border-app-border rounded-3xl p-6 lg:p-8 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto shadow-2xl transition-colors">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                    <Brain size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-app-text">Personalidad del Bot</h2>
                    <p className="text-app-text-muted text-sm">Define cómo piensa y responde tu asistente.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5 bg-app-bg dark:bg-background p-6 rounded-2xl border border-app-border">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-app-text-muted mb-2 block tracking-widest">Nombre del Bot</label>
                        <input
                            type="text"
                            value={settings.bot_name}
                            onChange={(e) => setSettings({...settings, bot_name: e.target.value})}
                            className="w-full bg-background border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-app-text"
                            placeholder={siteConfig.aiPlaceholder}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-app-text-muted mb-2 block tracking-widest">System Prompt (Instrucciones)</label>
                        <textarea
                            value={settings.system_prompt}
                            onChange={(e) => setSettings({...settings, system_prompt: e.target.value})}
                            className="w-full h-32 bg-background border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none resize-none transition-all text-app-text"
                            placeholder="Eres un asistente útil..."
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-app-text-muted mb-2 block tracking-widest">Reglas y Conocimiento</label>
                        <textarea
                            value={settings.possible_responses}
                            onChange={(e) => setSettings({...settings, possible_responses: e.target.value})}
                            className="w-full h-48 bg-background border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none resize-none transition-all font-mono text-app-text"
                            placeholder="Regla 1: ..."
                        />
                    </div>

                    <div className="pt-4 border-t border-app-border dark:border-slate-800/50">
                        <label className="text-[10px] uppercase font-bold text-cyan-500 mb-2 block tracking-widest">🚀 Aprendizaje Automático (URL)</label>
                        <div className="flex gap-2">
                            <input
                                id="learn-url-input"
                                type="text"
                                placeholder="https://tu-web.com/info"
                                className="flex-1 bg-background border border-app-border rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-app-text"
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    const input = document.getElementById('learn-url-input') as HTMLInputElement;
                                    const url = input?.value;
                                    if (!url) return alert('Ingresa una URL válida');
                                    
                                    setLoading(true);
                                    try {
                                        const res = await fetch('/api/settings/learn-url', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ url })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            alert(`¡Aprendido! Se añadieron ${data.learnedCount} caracteres a la memoria.`);
                                            // Recargar settings
                                            const sRes = await fetch('/api/settings');
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
                        <p className="text-[9px] text-app-text-muted mt-2 italic">El bot leerá la web y guardará el texto en "Reglas y Conocimiento".</p>
                        
                        <div className="mt-4 pt-4 border-t border-app-border dark:border-slate-800/50">
                            <label className="text-[10px] uppercase font-bold text-emerald-500 mb-2 flex items-center justify-between tracking-widest cursor-pointer">
                                <span>📄 Subir Documento (.txt, .pdf, .md)</span>
                                <div className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-emerald-500/30">
                                    Seleccionar
                                    <input 
                                        type="file" 
                                        accept=".txt,.csv,.md,.pdf" 
                                        className="hidden" 
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            
                                            setLoading(true);
                                            try {
                                                let text = "";
                                                if (file.name.toLowerCase().endsWith('.pdf')) {
                                                    if (!(window as any).pdfjsLib) {
                                                        await new Promise((resolve) => {
                                                            const script = document.createElement('script');
                                                            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                                                            script.onload = () => {
                                                                (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                                                                resolve(true);
                                                            };
                                                            document.head.appendChild(script);
                                                        });
                                                    }
                                                    const arrayBuffer = await file.arrayBuffer();
                                                    const pdf = await (window as any).pdfjsLib.getDocument({data: arrayBuffer}).promise;
                                                    for (let i = 1; i <= pdf.numPages; i++) {
                                                        const page = await pdf.getPage(i);
                                                        const content = await page.getTextContent();
                                                        text += content.items.map((item: any) => item.str).join(" ") + " \n";
                                                    }
                                                } else {
                                                    text = await new Promise((resolve) => {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => resolve(ev.target?.result as string);
                                                        reader.readAsText(file);
                                                    });
                                                }
                                                
                                                const currentKnowledge = settings.possible_responses || "";
                                                const newKnowledge = `${currentKnowledge}\n\n[DOCUMENTO: ${file.name}]:\n${text}`.trim();
                                                
                                                setSettings({...settings, possible_responses: newKnowledge});
                                                alert(`¡Archivo "${file.name}" leído exitosamente!`);
                                            } catch (err) {
                                                alert('Error leyendo archivo. Asegúrate que no esté corrupto.');
                                            } finally {
                                                setLoading(false);
                                                e.target.value = '';
                                            }
                                        }} 
                                    />
                                </div>
                            </label>
                            <p className="text-[9px] text-app-text-muted mt-1 italic">El texto del archivo se pegará automáticamente en la caja.</p>
                        </div>
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
