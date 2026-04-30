'use client';

import { useState, useEffect } from 'react';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { History, Bell, Brain, Megaphone, CalendarDays } from 'lucide-react';

import { StatusHeader } from '@/components/StatusHeader';
import { MassMessaging } from '@/components/MassMessaging';
import { Reminders } from '@/components/Reminders';
import { Personality } from '@/components/Personality';
import { AuditLogs } from '@/components/AuditLogs';
import { ConnectionOverlay } from '@/components/ConnectionOverlay';
import { CalendarView } from '@/components/CalendarView';

import { Audit, Reminder, Settings } from '../types';

const API_BASE = '/api';
type TabId = 'mass' | 'scheduling' | 'calendar' | 'personality' | 'audits';

const tabs: Array<{ id: TabId; icon: typeof Megaphone; label: string }> = [
    { id: 'mass', icon: Megaphone, label: 'Difusion' },
    { id: 'scheduling', icon: Bell, label: 'Recordatorios' },
    { id: 'calendar', icon: CalendarDays as any, label: 'Calendario' },
    { id: 'personality', icon: Brain as any, label: 'Cerebro IA' },
    { id: 'audits', icon: History as any, label: 'Auditoria' }
];

export default function Home() {
    const { status, qr } = useWhatsApp();
    const [activeTab, setActiveTab] = useState<TabId>('mass');
    const [audits, setAudits] = useState<Audit[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [prefillDate, setPrefillDate] = useState<string>('');

    const fetchData = async (currentTab: TabId, currentSettings: Settings | null) => {
        try {
            const [auditsRes, remindersRes] = await Promise.all([
                fetch(`${API_BASE}/system/audits`),
                fetch(`${API_BASE}/reminders`)
            ]);

            if (auditsRes.ok) setAudits(await auditsRes.json());
            if (remindersRes.ok) setReminders(await remindersRes.json());

            if (!currentSettings || currentTab === 'personality') {
                const settingsRes = await fetch(`${API_BASE}/settings`);
                if (settingsRes.ok) setSettings(await settingsRes.json());
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        const initialLoad = setTimeout(() => {
            void fetchData(activeTab, settings);
        }, 0);
        const interval = setInterval(() => {
            void fetchData(activeTab, settings);
        }, 5000);
        return () => {
            clearTimeout(initialLoad);
            clearInterval(interval);
        };
    }, [activeTab, settings]);

    const handleCleanUploads = async () => {
        if (!confirm('Deseas limpiar archivos temporales no utilizados?')) return;
        await fetch(`${API_BASE}/system/clean-uploads`, { method: 'DELETE' });
    };

    const handleSendMass = async (contacts: string, message: string, media: File | null) => {
        const formData = new FormData();
        const contactList = contacts
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const cleanLine = line.trim();
                if (cleanLine.includes(',')) {
                    const parts = cleanLine.split(',');
                    const part1 = parts[0].trim();
                    const part2 = parts.slice(1).join(',').trim();
                    if (/\d{8,}/.test(part1)) return { number: part1, name: part2 };
                    return { number: part2, name: part1 };
                }
                const numberMatch = cleanLine.match(/\+?\d{8,15}/);
                if (numberMatch) {
                    const number = numberMatch[0];
                    const name = cleanLine.replace(number, '').replace(/^[-\s]+|[-\s]+$/g, '').trim();
                    return { number, name };
                }
                return { number: cleanLine, name: '' };
            });

        formData.append('contacts', JSON.stringify(contactList));
        formData.append('message', message);
        if (media) formData.append('media', media);

        const res = await fetch(`${API_BASE}/send-mass`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (data.success) alert(`Cola iniciada. Procesando ${contactList.length} contactos.`);
        else alert(`Error: ${data.error}`);
    };

    const handleAIGeneration = async (text: string) => {
        const res = await fetch(`${API_BASE}/ai/review-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await res.json();
        return data.success ? data.corrected : null;
    };

    const handleAddReminder = async (chatId: string, text: string, time: string, media: File | null, repeat?: string, repeatInterval?: number, repeatUnit?: string, title?: string) => {
        const formData = new FormData();
        formData.append('chatId', chatId);
        formData.append('text', text);
        formData.append('time', time);
        if (title) formData.append('title', title);
        if (media) formData.append('media', media);

        if (repeat) formData.append('repeat', repeat);
        if (repeatInterval) formData.append('repeatInterval', repeatInterval.toString());
        if (repeatUnit) formData.append('repeatUnit', repeatUnit);

        const url = media ? `${API_BASE}/reminders/with-media` : `${API_BASE}/reminders`;
        const res = await fetch(url, {
            method: 'POST',
            body: media ? formData : JSON.stringify({ chatId, text, time, repeat, repeatInterval, repeatUnit, title }),
            headers: media ? {} : { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            void fetchData(activeTab, settings);
            alert('Recordatorio programado con exito.');
        }
    };

    const handleDeleteReminder = async (id: number) => {
        if (!confirm('Seguro que quieres eliminar este recordatorio?')) return;
        const res = await fetch(`${API_BASE}/reminders/${id}`, { method: 'DELETE' });
        if (res.ok) void fetchData(activeTab, settings);
    };

    const handleUpdateSettings = async (newSettings: Settings) => {
        const res = await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings)
        });
        if (res.ok) {
            setSettings(newSettings);
            alert('Configuracion guardada.');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-cyan-500/30 transition-colors duration-300">
            <ConnectionOverlay qr={qr} status={status} />

            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[120px] opacity-70 dark:opacity-100"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-[100px] opacity-70 dark:opacity-100"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <StatusHeader status={status} qr={qr} onCleanUploads={handleCleanUploads} />

                <nav className="flex items-center justify-center mb-12">
                    <div className="flex bg-app-card p-1.5 rounded-3xl border border-app-border backdrop-blur-xl shadow-2xl transition-colors">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 scale-105'
                                        : 'text-app-text-muted hover:text-app-text hover:bg-slate-200/50 dark:hover:bg-white/5'
                                }`}
                            >
                                <tab.icon size={16} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                <main className="min-h-[600px]">
                    {activeTab === 'mass' && (
                        <MassMessaging onSend={handleSendMass} onReview={handleAIGeneration} />
                    )}

                    {activeTab === 'scheduling' && (
                        <Reminders
                            reminders={reminders}
                            onAdd={handleAddReminder}
                            onDelete={handleDeleteReminder}
                            initialTime={prefillDate}
                        />
                    )}

                    {activeTab === 'calendar' && (
                        <CalendarView 
                            reminders={reminders} 
                            onDateSelect={(date) => {
                                setPrefillDate(date);
                                setActiveTab('scheduling');
                            }}
                        />
                    )}

                    {activeTab === 'personality' && settings && (
                        <Personality initialSettings={settings} onUpdate={handleUpdateSettings} />
                    )}

                    {activeTab === 'audits' && (
                        <AuditLogs audits={audits} />
                    )}
                </main>

                <footer className="mt-20 py-8 border-t border-app-border text-center">
                    <p className="text-[10px] uppercase font-bold text-app-text/30 tracking-[0.3em] font-mono">
                        Powered by Kitsune Engine • © 2026
                    </p>
                </footer>
            </div>
        </div>
    );
}
