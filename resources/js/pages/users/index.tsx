import { BreadcrumbItem, PaginatedResults, Role, User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import Table from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    }
];

const userColumns = [
    { label: 'ID', accessor: 'id' },
    { label: 'Name', accessor: 'name' },
    { label: 'Email', accessor: 'email' },
    { label: 'Roles', accessor: 'roles',
        render: (roles: Role[]) => {
            if (!roles || roles.length === 0) {
                return <span className="text-gray-500">No role</span>;
            }

            return (
                <div className="flex gap-1 overflow-x-auto max-w-xs xl:max-w-xl scrollbar-hide">
                    {roles.map((role) => (
                        <span
                            key={role.id}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                            {role.name}
                        </span>
                    ))}
                </div>
            );
        }
    },
];

export default function Index({users}: PaginatedResults<User>){
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title={`Users`}/>

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
                  requirePasswordOnDelete={true} />
          </div>
      </AppLayout>
    );
}
