'use client';

import { useGlobalBotData } from '@/app/BotDataProvider';
import { Reminders } from '@/components/Reminders';

export default function SchedulingPage() {
    const { reminders, handleAddReminder, handleDeleteReminder, prefillDate, templates } = useGlobalBotData();

    return (
        <Reminders
            reminders={reminders}
            onAdd={handleAddReminder}
            onDelete={handleDeleteReminder}
            initialTime={prefillDate}
            templates={templates}
        />
    );
}
