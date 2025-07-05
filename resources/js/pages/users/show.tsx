import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    user: User;
    userRole: string;
}
export default function Index({ user, userRole }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: 'View User',
            href: route('users.show', user.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View User`} />

            <div className={`flex flex-col items-center space-y-6 p-6`}>
                <UserInfo user={user} userRole={userRole} showEmail={true} showRole={true} />
            </div>
        </AppLayout>
    );
}
