import { BreadcrumbItem } from '@/types';
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
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create',
        href: '/roles/create',
    }
];

export default function Create({ permissions }){
    const {data, setData, errors, post, processing} = useForm({
        name: '',
        permissions: [],
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('roles.store'), {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create Role`}/>

            <form onSubmit={submit} className={`p-6 space-y-6 mt-4 max-w-md mx-auto`}>
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
                    />
                    <InputError message={errors.name} />

                </div>

                <div className={`grid gap-2`}>
                    <Label className="block mb-2">Permissions</Label>
                    {permissions.map((permission) => (
                        <Label key={permission} className={`flex items-center space-x-2`}>
                            <Input
                                type={`checkbox`}
                                className={`h-5 w-5`}
                                value={permission}
                                id={permission}
                                onChange={(e)=> handleCheckboxChange(permission, e.target.checked)}
                            ></Input>
                            <span className={`text-gray-800 ml-2`}>{permission}</span>
                        </Label>
                    ))}
                    <InputError message={errors.permissions} />
                </div>

                <Button type="submit"
                        disabled={processing}
                >CREATE</Button>
            </form>
        </AppLayout>
    );
}
