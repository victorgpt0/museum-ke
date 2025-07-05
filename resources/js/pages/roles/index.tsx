import Table from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResults, Permission, Role } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

const roleColumns = [
    { label: 'ID', accessor: 'id' },
    { label: 'Name', accessor: 'name' },
    {
        label: 'Permissions',
        accessor: 'permissions',
        render: (permissions: Permission[]) => {
            if (!permissions || permissions.length === 0) {
                return <span className="text-gray-500">No permissions</span>;
            }

            return (
                <div className="scrollbar-hide flex max-w-xs gap-1 overflow-x-auto xl:max-w-xl">
                    {permissions.map((permission) => (
                        <span key={permission.id} className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            {permission.name}
                        </span>
                    ))}
                </div>
            );
        },
    },
];

export default function Index({ roles }: PaginatedResults<Role>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Roles`} />

            <div>
                <Table
                    data={roles.data}
                    resource={`roles`}
                    type={`Role`}
                    columns={roleColumns}
                    paginationLinks={roles.links}
                    from={roles.from}
                    to={roles.to}
                    total={roles.total}
                />
            </div>
        </AppLayout>
    );
}
