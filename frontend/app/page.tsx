'use client';

import { useBotData, TabId } from '@/hooks/useBotData';
import { History, Bell, Brain, Megaphone, CalendarDays, Layout, Settings as SettingsIcon } from 'lucide-react';

import { StatusHeader } from '@/components/StatusHeader';
import { MassMessaging } from '@/components/MassMessaging';
import { Reminders } from '@/components/Reminders';
import { Personality } from '@/components/Personality';
import { AuditLogs } from '@/components/AuditLogs';
import { ConnectionOverlay } from '@/components/ConnectionOverlay';
import { CalendarView } from '@/components/CalendarView';
import { Templates } from '@/components/Templates';
import { Settings } from '@/components/Settings';

const tabs: Array<{ id: TabId; icon: any; label: string }> = [
    { id: 'mass', icon: Megaphone, label: 'Difusión' },
    { id: 'scheduling', icon: Bell, label: 'Recordatorios' },
    { id: 'calendar', icon: CalendarDays, label: 'Calendario' },
    { id: 'templates', icon: Layout, label: 'Plantillas' },
    { id: 'personality', icon: Brain, label: 'Cerebro IA' },
    { id: 'settings', icon: SettingsIcon, label: 'Configuración' },
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
        handleUpdateSettings,
        handleParseEnv
    } = useBotData();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-cyan-500/30 transition-colors duration-300">
            <ConnectionOverlay qr={qr} status={status} />

            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-blue-600/10 dark:bg-cyan-500/10 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[5%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px] animation-delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <StatusHeader 
                    status={status} 
                    qr={qr} 
                    onCleanUploads={handleCleanUploads} 
                    botName={settings?.bot_name} 
                />

                <nav className="flex items-center justify-center mb-12 relative z-20">
                    <div className="flex bg-app-card/30 p-2 rounded-[2rem] border border-app-border backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 relative group overflow-hidden ${
                                    activeTab === tab.id
                                        ? 'text-white scale-105'
                                        : 'text-app-text-muted hover:text-app-text'
                                }`}
                            >
                                {activeTab === tab.id && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 z-0 animate-in fade-in zoom-in duration-300"></div>
                                )}
                                <div className="relative z-10 flex items-center gap-2.5">
                                    <tab.icon size={15} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </div>
                                {activeTab !== tab.id && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-1/2"></div>
                                )}
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

                    {activeTab === 'settings' && settings && (
                        <Settings settings={settings} onUpdate={handleUpdateSettings} onParseEnv={handleParseEnv} />
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
