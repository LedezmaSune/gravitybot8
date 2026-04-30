import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { Audit, Reminder, Settings, Template, ConnectionState } from '../types';

const API_BASE = '/api';
const SOCKET_URL = ''; // Connects back to the same host

export type TabId = 'mass' | 'scheduling' | 'calendar' | 'templates' | 'personality' | 'audits';

export function useBotData() {
    // 1. Connection State (Socket.io)
    const [status, setStatus] = useState<ConnectionState>('disconnected');
    const [qr, setQr] = useState<string | null>(null);

    // 2. Dashboard State
    const [activeTab, setActiveTab] = useState<TabId>('mass');
    const [audits, setAudits] = useState<Audit[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [prefillDate, setPrefillDate] = useState<string>('');

    // 3. Fetching Logic
    const fetchData = useCallback(async (currentTab?: TabId) => {
        try {
            const [auditsRes, remindersRes, templatesRes] = await Promise.all([
                fetch(`${API_BASE}/system/audits`),
                fetch(`${API_BASE}/reminders`),
                fetch(`${API_BASE}/templates`)
            ]);

            if (auditsRes.ok) setAudits(await auditsRes.json());
            if (remindersRes.ok) setReminders(await remindersRes.json());
            if (templatesRes.ok) setTemplates(await templatesRes.json());

            if (!settings || currentTab === 'personality') {
                const settingsRes = await fetch(`${API_BASE}/settings`);
                if (settingsRes.ok) setSettings(await settingsRes.json());
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }, [settings]);

    // 4. Effects
    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('status', (newStatus: ConnectionState) => {
            setStatus(newStatus);
            if (newStatus === 'connected') setQr(null);
        });

        socket.on('qr', (newQr: string) => {
            setQr(newQr);
        });

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        void fetchData(activeTab);
        const interval = setInterval(() => {
            void fetchData(activeTab);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeTab, fetchData]);

    // 5. Action Handlers
    const handleCleanUploads = async () => {
        if (!confirm('¿Deseas limpiar archivos temporales no utilizados?')) return;
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
            void fetchData(activeTab);
            alert('Recordatorio programado con éxito.');
        }
    };

    const handleDeleteReminder = async (id: number) => {
        if (!confirm('¿Seguro que quieres eliminar este recordatorio?')) return;
        const res = await fetch(`${API_BASE}/reminders/${id}`, { method: 'DELETE' });
        if (res.ok) void fetchData(activeTab);
    };

    const handleUpdateSettings = async (newSettings: Settings) => {
        const res = await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings)
        });
        if (res.ok) {
            setSettings(newSettings);
            alert('Configuración guardada.');
        }
    };

    return {
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
    };
}
