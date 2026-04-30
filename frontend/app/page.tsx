'use client';

import { useBotData, TabId } from '@/hooks/useBotData';
import { History, Bell, Brain, Megaphone, CalendarDays, Layout } from 'lucide-react';

import { StatusHeader } from '@/components/StatusHeader';
import { MassMessaging } from '@/components/MassMessaging';
import { Reminders } from '@/components/Reminders';
import { Personality } from '@/components/Personality';
import { AuditLogs } from '@/components/AuditLogs';
import { ConnectionOverlay } from '@/components/ConnectionOverlay';
import { CalendarView } from '@/components/CalendarView';
import { Templates } from '@/components/Templates';

const tabs: Array<{ id: TabId; icon: any; label: string }> = [
    { id: 'mass', icon: Megaphone, label: 'Difusión' },
    { id: 'scheduling', icon: Bell, label: 'Recordatorios' },
    { id: 'calendar', icon: CalendarDays, label: 'Calendario' },
    { id: 'templates', icon: Layout, label: 'Plantillas' },
    { id: 'personality', icon: Brain, label: 'Cerebro IA' },
    { id: 'audits', icon: History, label: 'Auditoría' }
];

export default function Home() {
    const {
        status,
        qr,
        activeTab,
        setActiveTab,
        audits,
        reminders,
        templates,
        settings,
        prefillDate,
        setPrefillDate,
        fetchData,
        handleCleanUploads,
        handleSendMass,
        handleAIGeneration,
        handleAddReminder,
        handleDeleteReminder,
        handleUpdateSettings
    } = useBotData();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-cyan-500/30 transition-colors duration-300">
            <ConnectionOverlay qr={qr} status={status} />

            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[120px] opacity-70 dark:opacity-100"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-[100px] opacity-70 dark:opacity-100"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <StatusHeader 
                    status={status} 
                    qr={qr} 
                    onCleanUploads={handleCleanUploads} 
                    botName={settings?.bot_name} 
                />

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
                        <MassMessaging 
                            onSend={handleSendMass} 
                            onReview={handleAIGeneration} 
                            templates={templates} 
                        />
                    )}

                    {activeTab === 'scheduling' && (
                        <Reminders
                            reminders={reminders}
                            onAdd={handleAddReminder}
                            onDelete={handleDeleteReminder}
                            initialTime={prefillDate}
                            templates={templates}
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

                    {activeTab === 'templates' && (
                        <Templates 
                            templates={templates} 
                            onRefresh={() => void fetchData(activeTab)} 
                            onReview={handleAIGeneration}
                        />
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
