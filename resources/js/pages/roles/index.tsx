import { BreadcrumbItem, PaginatedResults, Permission, Role, User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import Table from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    }
];

const roleColumns = [
    { label: 'ID', accessor: 'id' },
    { label: 'Name', accessor: 'name' },
    { label: 'Permissions', accessor: 'permissions',
        render: (permissions: Permission[]) => {
            if (!permissions || permissions.length === 0) {
                return <span className="text-gray-500">No permissions</span>;
            }

            return (
                <div className="flex gap-1 overflow-x-auto max-w-xs xl:max-w-xl scrollbar-hide">
                    {permissions.map((permission) => (
                        <span
                            key={permission.id}
                            className="inline-flex bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                            {permission.name}
                        </span>
                    ))}
                </div>
            );
        }
    },
];

export default function Index({roles}: PaginatedResults<Role>){
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title={`Roles`}/>

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
                  requirePasswordOnDelete={true}/>
          </div>
      </AppLayout>
    );
}
