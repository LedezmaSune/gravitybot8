'use client';

import { useGlobalBotData } from '@/app/BotDataProvider';
import { Personality } from '@/components/Personality';

export default function PersonalityPage() {
    const { settings, handleUpdateSettings } = useGlobalBotData();

    if (!settings) return <div className="p-8 text-center animate-pulse">Cargando Cerebro...</div>;

    return (
        <Personality initialSettings={settings} onUpdate={handleUpdateSettings} />
    );
}
