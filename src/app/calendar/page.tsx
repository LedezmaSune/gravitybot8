'use client';

import { useGlobalBotData } from '@/app/BotDataProvider';
import { CalendarView } from '@/components/CalendarView';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
    const { reminders, setPrefillDate, setActiveTab } = useGlobalBotData();
    const router = useRouter();

    return (
        <CalendarView 
            reminders={reminders} 
            onDateSelect={(date) => {
                setPrefillDate(date);
                setActiveTab('scheduling');
                router.push('/scheduling');
            }}
        />
    );
}
