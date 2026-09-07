import { DashboardLayout } from '@/components/DashboardLayout';
import { PageTransition } from '@/components/PageTransition';
import { FutureChannelsUI } from '@/components/FutureChannelsUI';

export default function ChannelsPage() {
    return (
        <DashboardLayout>
            <PageTransition>
                <FutureChannelsUI />
            </PageTransition>
        </DashboardLayout>
    );
}
