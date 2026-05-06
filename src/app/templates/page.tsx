'use client';

import { useGlobalBotData } from '@/app/BotDataProvider';
import { Templates } from '@/components/Templates';

export default function TemplatesPage() {
    const { templates, fetchData, handleAIGeneration } = useGlobalBotData();

    return (
        <Templates 
            templates={templates} 
            onRefresh={() => void fetchData('templates')} 
            onReview={handleAIGeneration}
        />
    );
}
