import { BreadcrumbItem, User } from '@/types';
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
];

export default function Index({users}: User){
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title={`Users`}/>

          <div>
              <Table data={users} resource={`users`} type={`User`} columns={userColumns} onShow={true} onEdit={true} onDelete={true} requirePasswordOnDelete={false}/>
          </div>
      </AppLayout>
    );
}
