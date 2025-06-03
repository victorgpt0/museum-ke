import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

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
    const {data, setData, errors, post, reset, processing, recentlySuccessful} = useForm({
        name: '',
        email: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            preserveScroll: true,
        });
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create User`}/>

            <form onSubmit={submit} className={`space-y-6 mt-4 max-w-md mx-auto`}>
                <div className={`grid gap-2`}>
                    <Label>Name</Label>
                    <Input
                        type={`text`}
                        id={`name`}
                        name={`name`}
                        value={data.name}
                        onChange={(e)=>setData('name', e.target.value)}
                        placeholder={`Enter User Name`}
                    />
                    <InputError message={errors.name} />

                </div>
                <div className={`grid gap-2`}>
                    <Label>Email</Label>
                    <Input
                        type={`email`}
                        id={`email`}
                        name={`email`}
                        value={data.email}
                        onChange={(e)=>setData('email', e.target.value)}
                        placeholder={`Enter Email`}
                    />
                    <InputError message={errors.email} />
                </div>
                <Button type="submit"
                        disabled={processing}
                >cREATE</Button>
            </form>
        </AppLayout>
    );
}
