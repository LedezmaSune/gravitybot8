'use client';

import React, { createContext, useContext } from 'react';
import { useBotData } from '@/hooks/useBotData';

const BotDataContext = createContext<ReturnType<typeof useBotData> | null>(null);

export function BotDataProvider({ children }: { children: React.ReactNode }) {
    const data = useBotData();
    return (
        <BotDataContext.Provider value={data}>
            {children}
        </BotDataContext.Provider>
    );
}

export function useGlobalBotData() {
    const context = useContext(BotDataContext);
    if (!context) {
        throw new Error('useGlobalBotData must be used within a BotDataProvider');
    }
    return context;
}
