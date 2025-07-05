import Table from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResults, Role, User } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

const userColumns = [
    { label: 'ID', accessor: 'id' },
    { label: 'Name', accessor: 'name' },
    { label: 'Email', accessor: 'email' },
    {
        label: 'Roles',
        accessor: 'roles',
        render: (roles: Role[]) => {
            if (!roles || roles.length === 0) {
                return <span className="text-gray-500">No role</span>;
            }

            return (
                <div className="scrollbar-hide flex max-w-xs gap-1 overflow-x-auto xl:max-w-xl">
                    {roles.map((role) => (
                        <span key={role.id} className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            {role.name}
                        </span>
                    ))}
                </div>
            );
        },
    },
];

export default function Index({ users }: PaginatedResults<User>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Users`} />

            <div>
                <Table
                    data={users.data}
                    resource={`users`}
                    type={`User`}
                    columns={userColumns}
                    paginationLinks={users.links}
                    from={users.from}
                    to={users.to}
                    total={users.total}
                />
            </div>
        </AppLayout>
    );
}
