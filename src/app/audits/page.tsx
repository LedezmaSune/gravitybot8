'use client';

import { useGlobalBotData } from '@/app/BotDataProvider';
import { AuditLogs } from '@/components/AuditLogs';

export default function AuditsPage() {
    const { audits } = useGlobalBotData();

    return (
        <AuditLogs audits={audits} />
    );
}
