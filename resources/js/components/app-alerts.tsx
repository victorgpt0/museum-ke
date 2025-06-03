import { usePage } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';

const AlertComponent = () => {  // Add arrow function syntax
    const { flash } = usePage().props;
    const flashTypes= [
        'success',
        'error',
        'info',
        'warning'
    ] as const;

    return (
        <>
            {flashTypes.map((type) =>
                flash[type] ? (
                    <div key={type} className="p-6">
                        <Alert variant={type}>
                            { flash[type] as string }
                        </Alert>
                    </div>
                ) : null
            )}
        </>
    );
}

export default AlertComponent;
