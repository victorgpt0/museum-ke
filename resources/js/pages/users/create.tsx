import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { FormUI } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    roles: Array<{
        value: string;
        label: string;
    }>;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Create',
        href: '/users/create',
    },
];

export default function Create({ roles }: Props) {
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        email: '',
        role: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create User`} />

            <FormUI>
                <form onSubmit={submit} className={`mx-auto space-y-6`}>
                    <div className={`grid gap-2`}>
                        <Label>Name</Label>
                        <Input
                            type={`text`}
                            id={`name`}
                            name={`name`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={`Enter User Name`}
                            className={`max-w-md`}
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
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={`Enter Email`}
                            className={`max-w-md`}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className={`grid gap-2`}>
                        <Label className="mb-2 block">Role</Label>
                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger className={`max-w-md`}>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.label}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        CREATE
                    </Button>
                </form>
            </FormUI>
        </AppLayout>
    );
}
