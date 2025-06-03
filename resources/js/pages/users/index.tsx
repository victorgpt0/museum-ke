import { BreadcrumbItem } from '@/types';
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

export default function index({users}){
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title={`Users`}/>

          <div>
              <Table data={users} resource={`users`} columns={userColumns} onEdit={true} onDelete={true}/>
          </div>
      </AppLayout>
    );
}
