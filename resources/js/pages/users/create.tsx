import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Create',
        href: '/users/create',
    }
];

export default function create(){
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create User`}/>

        </AppLayout>
    );
}
