import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import React, { useRef, useState } from 'react';

export default function Edit() {
    const { artifact, categories, donors, images, documents, tags } = usePage().props as any;
    const imagesRef = useRef<HTMLInputElement>(null);
    const documentsRef = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Artifacts',
            href: route('artifacts.index'),
        },
        {
            title: artifact.title,
            href: route('artifacts.show', artifact.id),
        },
        {
            title: 'Edit',
            href: route('artifacts.edit', artifact.id),
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: artifact.title || '',
        description: artifact.description || '',
        category_id: artifact.category_id || '',
        condition: artifact.condition || 'good',
        location: artifact.location || '',
        acquisition_date: artifact.acquisition_date || '',
        status: artifact.status || 'active',
        donor_id: artifact.donor_id || '',
        images: [],
        documents: [],
        tags: artifact.tags ? artifact.tags.map((t: any) => String(t.id)) : [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(e.target.name, e.target.value);
    };

    const handleSelectChange = (name: string, value: string) => {
        setData(name, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData(e.target.name, Array.from(e.target.files));
        }
    };

    const handleTagChange = (tagId: string, checked: boolean) => {
        const currentTags = data.tags || [];
        if (checked) {
            setData('tags', [...currentTags, tagId]);
        } else {
            setData(
                'tags',
                currentTags.filter((id: string) => id !== tagId),
            );
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('artifacts.update', artifact.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-4xl p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Artifact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title *</Label>
                                        <Input id="title" name="title" value={data.title} onChange={handleChange} error={errors.title} required />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={handleChange}
                                            error={errors.description}
                                            rows={4}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="category_id">Category *</Label>
                                        <Select value={data.category_id} onValueChange={(value) => handleSelectChange('category_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat: any) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                                        {cat.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category_id} className="mt-1" />
                                    </div>

                                    <div>
                                        <Label htmlFor="condition">Condition *</Label>
                                        <Select value={data.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Condition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="good">Good</SelectItem>
                                                <SelectItem value="poor">Poor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.condition} className="mt-1" />
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" name="location" value={data.location} onChange={handleChange} error={errors.location} />
                                    </div>

                                    <div>
                                        <Label htmlFor="acquisition_date">Acquisition Date</Label>
                                        <Input
                                            id="acquisition_date"
                                            name="acquisition_date"
                                            type="date"
                                            value={data.acquisition_date}
                                            onChange={handleChange}
                                            error={errors.acquisition_date}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select value={data.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                                <SelectItem value="on_display">On Display</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} className="mt-1" />
                                    </div>

                                    <div>
                                        <Label htmlFor="donor_id">Donor</Label>
                                        <Select value={data.donor_id} onValueChange={(value) => handleSelectChange('donor_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Donor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">None</SelectItem>
                                                {donors.map((donor: any) => (
                                                    <SelectItem key={donor.id} value={String(donor.id)}>
                                                        {donor.fullname}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.donor_id} className="mt-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <Label>Tags</Label>
                                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                                    {tags.map((tag: any) => (
                                        <div key={tag.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`tag-${tag.id}`}
                                                checked={data.tags.includes(String(tag.id))}
                                                onCheckedChange={(checked) => handleTagChange(String(tag.id), checked as boolean)}
                                            />
                                            <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                                                {tag.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.tags} className="mt-1" />
                            </div>

                            {/* File Uploads */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <FileUpload
                                        label="Add More Images"
                                        name="images"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        multiple
                                        maxFiles={10}
                                        maxSizeMB={5}
                                        value={selectedImages}
                                        onFilesChange={setSelectedImages}
                                        error={errors.images}
                                        previewType="image"
                                    />
                                    {/* Existing Images */}
                                    {images.length > 0 && (
                                        <div className="mt-4">
                                            <Label>Current Images</Label>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {images.map((img: any) => (
                                                    <div key={img.id} className="relative">
                                                        <img src={img.original_url} alt="" className="h-16 w-16 rounded border object-cover" />
                                                        <button
                                                            type="button"
                                                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                                            onClick={() => {
                                                                // TODO: Implement image deletion
                                                                console.log('Delete image:', img.id);
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <FileUpload
                                        label="Add More Documents"
                                        name="documents"
                                        accept=".pdf,.docx"
                                        multiple
                                        maxFiles={10}
                                        maxSizeMB={10}
                                        value={selectedDocuments}
                                        onFilesChange={setSelectedDocuments}
                                        error={errors.documents}
                                        previewType="document"
                                    />
                                    {documents.length > 0 && (
                                        <div className="mt-4">
                                            <Label>Current Documents</Label>
                                            <ul className="mt-2 space-y-1">
                                                {documents.map((doc: any) => (
                                                    <li key={doc.id} className="flex items-center justify-between text-sm">
                                                        <a
                                                            href={doc.original_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {doc.file_name}
                                                        </a>
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => {
                                                                // TODO: Implement document deletion
                                                                console.log('Delete document:', doc.id);
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 border-t pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Artifact'}
                                </Button>
                                <Link href={route('artifacts.show', artifact.id)}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
