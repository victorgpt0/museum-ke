import { BreadcrumbItem, Permission, Role, User } from '@/types';
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
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                            {permission.name}
                        </span>
                    ))}
                </div>
            );
        }
    },
];

interface Props {
    roles: Role[]
}

export default function Index({roles}: Props){
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title={`Roles`}/>

          <div>
              <Table
                  data={roles}
                  resource={`roles`}
                  type={`Role`}
                  columns={roleColumns}
                  onShow={true}
                  onEdit={true}
                  onDelete={true}
                  requirePasswordOnDelete={true}/>
          </div>
      </AppLayout>
    );
}
