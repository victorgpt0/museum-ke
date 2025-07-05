import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormUI } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create',
        href: '/roles/create',
    },
];

export default function Create({ permissions }) {
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        permissions: [],
    });

    // Group permissions by model prefix
    const groupedPermissions = permissions.reduce(
        (groups, permission) => {
            const prefix = permission.split('.')[0];
            if (!groups[prefix]) {
                groups[prefix] = [];
            }
            groups[prefix].push(permission);
            return groups;
        },
        {} as Record<string, string[]>,
    );

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('roles.store'), {
            preserveScroll: true,
        });
    };

    const handleCheckboxChange = (permissionName: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((name) => name !== permissionName),
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create Role`} />

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
                            placeholder={`Enter Role Name`}
                            required
                            className={`max-w-md`}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className={`grid gap-2`}>
                        <Label className="mb-2 block">Permissions</Label>
                        <div className={`flex flex-wrap gap-4`}>
                            {Object.entries(groupedPermissions).map(([model, permissions]) => (
                                <div key={model} className={'min-w-40 space-y-2 rounded-lg border bg-gray-50 p-4'}>
                                    <Badge variant={`outline`} className={`mb-3 text-xs font-medium text-gray-800 capitalize`}>
                                        {model}
                                    </Badge>
                                    <div className={`grid gap-2`}>
                                        {permissions.map((permission) => (
                                            <Label key={permission} className={`flex items-center space-x-2`}>
                                                <Input
                                                    type={`checkbox`}
                                                    className={`h-4 w-4`}
                                                    value={permission}
                                                    id={permission}
                                                    onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
                                                ></Input>
                                                <span className={`ml-2 text-gray-700`}>{permission.split('.').slice(1).join('.')}</span>
                                            </Label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.permissions} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        CREATE
                    </Button>
                </form>
            </FormUI>
        </AppLayout>
    );
}
