import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface Props {
    itemName?: string;
    itemType?: string;
    deleteRoute: string;
}

export default function DeleteConfirm({
    itemName,
    itemType = 'item',
    deleteRoute, } : Props) {

    const [open, setOpen] = useState(false);

    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '' ,
    });


    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(deleteRoute, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {
                passwordInput.current?.focus()
            },
            onFinish: () => {
                reset()
            },
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setOpen(false);
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className={`flex items-center cursor-pointer`}>
                    <Trash2 className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AlertTriangle className={`h-5 w-5 text-red-600`}></AlertTriangle>
                <DialogTitle>Delete {itemType}?</DialogTitle>
                <DialogDescription>
                    {itemName ? (
                        <>
                            You are about to permanently delete <strong>{itemName}</strong>.
                        </>
                    ) : (
                        <>
                            You are about to permanently delete this <strong>{itemType}</strong>.
                        </>
                    )}
                    This action cannot be undone and all associated data will be lost.
                    <span className="mt-2 block">Please enter your password to confirm this deletion.</span>
                </DialogDescription>
                <form className="space-y-6" onSubmit={handleDelete}>
                                            <div className="grid gap-2">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                autoComplete="current-password"
                            />

                            <InputError message={errors.password} />
                        </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal} disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing} asChild>
                            <button type="submit">Delete {itemType}</button>
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
