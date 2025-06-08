import { BreadcrumbItem, User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

interface Props {
    roles: Array<{
        value: string,
        label: string,
    }>
    user: User
}
export default function Edit({ roles, user }: Props){
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: 'Edit',
            href: `/users/${user.id}/edit`,
        },
    ];

    const {data, setData, errors, put, processing} = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id), {
            preserveScroll: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User`}/>

            <form onSubmit={submit} className={`p-6 space-y-6 mt-4 max-w-md mx-auto`}>
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

                <div className={`grid gap-2`}>
                    <Label className="block mb-2">Role</Label>
                    <Select
                        value={data.role}
                        onValueChange={(value) => setData('role', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                {roles.map((role) => (
                                    <SelectItem
                                        key={role.value}
                                        value={role.value}
                                    >
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.role} />
                </div>

                <Button type="submit"
                        disabled={processing}
                >Edit</Button>
            </form>
        </AppLayout>
    );
}
