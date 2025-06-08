import { usePage } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

const FLASH_TYPES = ['success', 'error', 'info', 'warning'] as const;

const AlertComponent = () => {
    const { flash } = usePage().props;
    const [visibleAlerts, setVisibleAlerts] = useState<Record<string, string>>({});

    useEffect(() => {
        // Populate initial visible alerts
        const newVisibleAlerts: Record<string, string> = {};
        FLASH_TYPES.forEach((type) => {
            if (flash[type]) {
                newVisibleAlerts[type] = flash[type] as string;
            }
        });
        setVisibleAlerts(newVisibleAlerts);

        const timeouts = Object.keys(newVisibleAlerts).map((type) =>
            setTimeout(() => {
                setVisibleAlerts(prev => {
                    const updated = {...prev};
                    delete updated[type];
                    return updated;
                });
            }, 5000)
        );

        return () => timeouts.forEach(clearTimeout);
    }, [flash]);

    return (
        <>
            {Object.entries(visibleAlerts).map(([type, message]) => (
                <div key={type} className="p-6">
                    <Alert variant={type as string}>
                        {message}
                    </Alert>
                </div>
            ))}
        </>
    );
}

export default AlertComponent;
