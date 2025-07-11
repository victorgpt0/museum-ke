import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/ui/file-upload';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { useState } from 'react';

export default function ArchiveEdit() {
    const { archive, documents, images } = usePage().props as any;
    const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const form = useForm({
        title: archive.title || '',
        author: archive.author || '',
        category: archive.category || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', form.data.title);
        formData.append('author', form.data.author);
        formData.append('category', form.data.category);
        
        // Add selected documents
        selectedDocuments.forEach((file) => {
            formData.append('documents[]', file);
        });
        
        // Add selected images
        selectedImages.forEach((file) => {
            formData.append('images[]', file);
        });

        form.post(`/archives/${archive.id}`, {
            data: formData,
            forceFormData: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Archives',
            href: '/archives',
        },
        {
            title: archive.title,
            href: `/archives/${archive.id}`,
        },
        {
            title: 'Edit',
            href: `/archives/${archive.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/archives/${archive.id}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Archive
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Archive</h1>
                            <p className="text-gray-600">Update archive information and files</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    placeholder="Enter archive title"
                                    className="mt-1"
                                />
                                {form.errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.title}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="author">Author</Label>
                                <Input
                                    id="author"
                                    value={form.data.author}
                                    onChange={(e) => form.setData('author', e.target.value)}
                                    placeholder="Enter author name"
                                    className="mt-1"
                                />
                                {form.errors.author && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.author}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={form.data.category}
                                    onValueChange={(value) => form.setData('category', value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="research">Research</SelectItem>
                                        <SelectItem value="context">Context</SelectItem>
                                        <SelectItem value="documentation">Documentation</SelectItem>
                                        <SelectItem value="historical">Historical</SelectItem>
                                        <SelectItem value="cultural">Cultural</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.category}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Uploads */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Files</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Document (PDF, Word, Excel, PowerPoint, Text)</Label>
                                <FileUpload
                                    name="documents"
                                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                                    onFilesChange={setSelectedDocuments}
                                    value={selectedDocuments}
                                    previewType="document"
                                    multiple={true}
                                    className="mt-1"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Leave empty to keep the current documents
                                </p>
                            </div>

                            <div>
                                <Label>Image (JPEG, PNG, WebP)</Label>
                                <FileUpload
                                    name="images"
                                    accept="image/*"
                                    onFilesChange={setSelectedImages}
                                    value={selectedImages}
                                    previewType="image"
                                    multiple={true}
                                    className="mt-1"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Leave empty to keep the current images
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Current Files */}
                    {(documents && documents.length > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Files</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {documents.map((doc: any) => (
                                        <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-gray-500" />
                                                <span className="font-medium">{doc.file_name}</span>
                                            </div>
                                            <a
                                                href={doc.original_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current Images */}
                    {(images && images.length > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                    {images.map((img: any) => (
                                        <div key={img.id} className="aspect-square overflow-hidden rounded-lg border">
                                            <img
                                                src={img.original_url}
                                                alt={img.file_name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4">
                        <Link href={`/archives/${archive.id}`}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
} 