import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { FormUI } from '@/components/ui/form';


export default function Edit({ role, role_permissions, permissions }){
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: '/roles',
        },
        {
            title: 'Edit',
            href: `/roles/${role.id}/edit`,
        },
    ];

    const {data, setData, errors, put, processing} = useForm({
        name: role.name || '',
        permissions: role_permissions || [],
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('roles.update', role.id), {
            preserveScroll: true,
        });
    }

    const handleCheckboxChange = (permissionName: string, checked: boolean) => {
        if (checked) {
            setData("permissions", [...data.permissions, permissionName])
        }else{
            setData("permissions", data.permissions.filter(name => name !== permissionName));
        }
    }

    const groupedPermissions = permissions.reduce((groups, permission) => {
        const prefix = permission.split('.')[0];
        if (!groups[prefix]) {
            groups[prefix] = [];
        }
        groups[prefix].push(permission);
        return groups;
    }, {} as Record<string, string[]>);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role`}/>

            <FormUI>
                <form onSubmit={submit} className={`space-y-6 mx-auto`}>
                    <div className={`grid gap-2`}>
                        <Label>Name</Label>
                        <Input
                            type={`text`}
                            id={`name`}
                            name={`name`}
                            value={data.name}
                            onChange={(e)=>setData('name', e.target.value)}
                            placeholder={`Enter Role Name`}
                            required
                            className={`max-w-md`}
                        />
                        <InputError message={errors.name} />

                    </div>

                    <div className={`grid gap-2`}>
                        <Label className="block mb-2">Permissions</Label>
                        <div className={`flex flex-wrap gap-4`}>
                            {Object.entries(groupedPermissions).map(([model,permissions]) => (
                                <div
                                    key={model}
                                    className={"border rounded-lg p-4 bg-gray-50 min-w-40 space-y-2"}>
                                    <Badge variant={`outline`} className={`text-xs font-medium capitalize text-gray-800 mb-3`}>
                                        {model}
                                    </Badge>
                                    <div className={`grid gap-2`}>
                                        {permissions.map((permission) => (
                                            <Label key={permission} className={`flex items-center space-x-2`}>
                                                <Input
                                                    type={`checkbox`}
                                                    className={`h-4 w-4`}
                                                    value={permission}
                                                    checked={data.permissions.includes(permission)}
                                                    id={permission}
                                                    onChange={(e)=> handleCheckboxChange(permission, e.target.checked)}
                                                ></Input>
                                                <span className={`text-gray-700 ml-2`}>
                                                {permission.split('.').slice(1).join('.')}
                                            </span>
                                            </Label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.permissions} />
                    </div>

                    <Button type="submit"
                            disabled={processing}
                    >EDIT</Button>
                </form>
            </FormUI>

        </AppLayout>
    );
}
