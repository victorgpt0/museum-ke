import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Permission } from '@/types';
import { Head } from '@inertiajs/react';
import Table from '@/components/ui/table';

const breadcrubs: BreadcrumbItem[] = [
    {
        title: 'Acquisitions',
        href: '/acquisitions'
    }
    ];

const columns = [
    { label: 'Thumbnail', accessor: 'thumbnail_url',
        render: (thumbnail_url: string)=>(
            <div className="w-16 h-16 overflow-hidden rounded-lg">
                <img
                    src={thumbnail_url || 'https://placehold.co/600x400?text=placeholder'}
                    alt={'Artifact thumbnail'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=error';
                    }}
                />
            </div>
        ) },
    { label: 'Name', accessor: 'title' },
];
export default function Index({acquisitions}){
    return (
        <AppLayout breadcrumbs={breadcrubs}>
            <Head title={`Acquisitions`}/>

            <div>
                <Table
                    data={acquisitions.data}
                    resource={`acquisitions`}
                    type={`Acquisition`}
                    columns={columns}
                    paginationLinks={acquisitions.links}
                    from={acquisitions.from}
                    to={acquisitions.to}
                    total={acquisitions.total}
                />
            </div>

        </AppLayout>
    );
}
