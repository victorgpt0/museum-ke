import { usePage } from '@inertiajs/react';

export default function Can(permission: string): boolean {
    const { auth } = usePage().props as unknown as {
        auth: {
            permissions: string[];
        };
    };

    return auth.permissions.includes(permission);
}
