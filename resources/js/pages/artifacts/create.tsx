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
import React, { useEffect, useRef, useState } from 'react';

type ArtifactFormData = {
    title: string;
    description: string;
    category_id: string;
    condition: string;
    location: string;
    acquisition_date: string;
    status: string;
    donor_id: string;
    images: File[];
    documents: File[];
    tags: string[];
};

export default function ArtifactCreate() {
    const { categories, donors, tags } = usePage().props as any;
    const imagesRef = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const documentsRef = useRef<HTMLInputElement>(null);
    const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Artifacts',
            href: route('artifacts.index'),
        },
        {
            title: 'Create Artifact',
            href: route('artifacts.create'),
        },
    ];

    const { data, setData, post, processing, errors } = useForm<ArtifactFormData>({
        title: '',
        description: '',
        category_id: '',
        condition: 'good',
        location: '',
        acquisition_date: '',
        status: 'active',
        donor_id: '',
        images: [],
        documents: [],
        tags: [],
    });

    // Clean up object URLs on component unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    // Sync selected files with form data
    React.useEffect(() => {
        setData('images', selectedImages);
    }, [selectedImages]);
    React.useEffect(() => {
        setData('documents', selectedDocuments);
    }, [selectedDocuments]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(e.target.name as keyof ArtifactFormData, e.target.value);
    };

    const handleSelectChange = (name: keyof ArtifactFormData, value: string) => {
        setData(name, value);
    };

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   if (e.target.files) {
    //     setData((prevData) => ({
    //       ...prevData,
    //       [e.target.name]: e.target.files ? [...e.target.files] : [],
    //     }));
    //   }
    // };
    //
    // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const files = Array.from(e.target.files || []);
    //
    //   if (files.length === 0) return;
    //
    //   // Create preview URLs
    //   const previews = files.map(file => URL.createObjectURL(file));
    //
    //   const newPreviews = [...imagePreviews, ...previews];
    //
    //   if (e.target.files) {
    //     setData((prevData) => ({
    //       ...prevData,
    //       [e.target.name]: e.target.files ? [...e.target.files] : [],
    //     }));
    //   }
    //
    //   setImagePreviews(newPreviews);
    // };
    //
    // const removeImage = (index: number) => {
    //   // Revoke the object URL to prevent memory leaks
    //   URL.revokeObjectURL(imagePreviews[index]);
    //
    //   const newImages = selectedImages.filter((_, i) => i !== index);
    //   const newPreviews = imagePreviews.filter((_, i) => i !== index);
    //   const newMediaIds = uploadedMediaIds.filter((_, i) => i !== index);
    //
    //   setSelectedImages(newImages);
    //   setImagePreviews(newPreviews);
    //   setUploadedMediaIds(newMediaIds);
    //
    //   setData('images', newImages);
    // };

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

        console.log(data);

        post(route('artifacts.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-4xl p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Artifact</CardTitle>
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
                                <FileUpload
                                    label="Artifact Images"
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
                                <FileUpload
                                    label="Artifact Documents"
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
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 border-t pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Artifact'}
                                </Button>
                                <Link href={route('artifacts.index')}>
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
