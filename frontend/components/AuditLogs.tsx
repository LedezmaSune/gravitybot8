'use client';

import { History } from 'lucide-react';
import { Audit } from '../types';

interface AuditLogsProps {
    audits: Audit[];
}

export function AuditLogs({ audits }: AuditLogsProps) {
    return (
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 lg:p-8 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl overflow-hidden min-h-[600px]">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-tr from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <History size={28} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Logs de Auditoría</h2>
                    <p className="text-slate-500 text-xs">Historial detallado de operaciones del sistema.</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-900/80">
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-800">Fecha</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-800">Usuario</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-800">Acción</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-800">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {audits.map((a) => (
                            <tr key={a.id} className="hover:bg-slate-800/20 transition-colors group">
                                <td className="px-6 py-4 text-xs tabular-nums text-slate-400">{a.timestamp}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-800 rounded-md text-[10px] font-bold text-slate-300 group-hover:bg-slate-700 transition-colors">
                                        {a.userId}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                        a.action.includes('SENT') || a.action.includes('COMPLETE') ? 'text-emerald-400' : 
                                        a.action.includes('FAILED') || a.action.includes('ERROR') ? 'text-red-400' : 'text-cyan-400'
                                    }`}>
                                        {a.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate" title={a.details}>
                                    {a.details}
                                </td>
                            </tr>
                        ))}
                        {audits.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-600 text-xs italic">
                                    No hay registros disponibles aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
