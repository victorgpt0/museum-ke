import { BreadcrumbItem, User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { UserInfo } from '@/components/user-info';

interface Props {
    user: User
}
export default function Index({user}: Props){

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: 'View User',
            href: route('users.show', user.id),
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View User`}/>

            <div className={`p-6 flex flex-col items-center space-y-6`}>
                <UserInfo user={user} showEmail={true} showRole={true}/>
            </div>

        </AppLayout>
    );
}
