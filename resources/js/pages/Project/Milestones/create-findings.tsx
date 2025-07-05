import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
    id: number;
    title: string;
}

interface Props {
    project: Project;
}

export default function CreateFinding({ project }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
    const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploadingDocs, setIsUploadingDocs] = useState(false);

    // Clean up object URLs if you use them for previews (not needed here since we use file names)
    useEffect(() => {
        return () => {
            documentPreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [documentPreviews]);

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsUploadingDocs(true);
        const files = Array.from(e.target.files || []);
        if (files.length === 0) {
            setIsUploadingDocs(false);
            return;
        }
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
        ];
        const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            toast.error('Please upload only supported document types (PDF, Word, Excel, Text, or Image files).');
            setIsUploadingDocs(false);
            return;
        }
        const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('Some files are too large. Maximum file size is 10MB. Please choose smaller files.');
            setIsUploadingDocs(false);
            return;
        }
        const newDocuments = [...selectedDocuments, ...files];
        const newPreviews = [...documentPreviews, ...files.map((file) => file.name)];
        setSelectedDocuments(newDocuments);
        setDocumentPreviews(newPreviews);
        toast.success(`${files.length} file(s) added successfully`);
        setIsUploadingDocs(false);
        // Reset file input value so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeDocument = (index: number) => {
        const newDocuments = selectedDocuments.filter((_, i) => i !== index);
        const newPreviews = documentPreviews.filter((_, i) => i !== index);
        setSelectedDocuments(newDocuments);
        setDocumentPreviews(newPreviews);
        toast.success('Document removed');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        if (!title.trim()) {
            setErrors((prev) => ({ ...prev, title: 'Title is required' }));
            toast.error('Please enter a title');
            setProcessing(false);
            return;
        }
        if (!description.trim()) {
            setErrors((prev) => ({ ...prev, description: 'Description is required' }));
            toast.error('Please enter a description');
            setProcessing(false);
            return;
        }
        if (selectedDocuments.length === 0) {
            setErrors((prev) => ({ ...prev, documents: 'Please upload at least one document' }));
            toast.error('Please upload at least one document');
            setProcessing(false);
            return;
        }
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        selectedDocuments.forEach((file) => {
            formData.append('documents[]', file);
        });
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        router.post(route('findings.store', { project: project.id }), formData, {
            forceFormData: true,
            preserveState: false,
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onSuccess: () => {
                setTitle('');
                setDescription('');
                setSelectedDocuments([]);
                setDocumentPreviews([]);
                toast.success('Finding has been created successfully');
                setProcessing(false);
            },
            onError: (errs) => {
                setErrors(errs || {});
                if (errs && typeof errs === 'object') {
                    Object.values(errs).forEach((msg) => toast.error(String(msg)));
                } else {
                    toast.error('There was an error submitting the finding.');
                }
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        padding: '12px 16px',
                    },
                    success: {
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                        },
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: '#f0fdf4',
                        },
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                        },
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#fef2f2',
                        },
                    },
                    loading: {
                        style: {
                            background: '#eff6ff',
                            color: '#1e40af',
                            border: '1px solid #bfdbfe',
                        },
                    },
                }}
            />
            <Head title={`New Finding - ${project.title}`} />
            <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back</span>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Finding</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">{project.title}</p>
                        </div>
                    </div>

                    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-white">Finding Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div>
                                    <Label className="text-gray-700 dark:text-gray-300">Attach Documents</Label>
                                    <div className="mt-1 flex flex-col items-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 dark:border-gray-600">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-2 text-center">
                                            <Label
                                                htmlFor="documents"
                                                className={`inline-block cursor-pointer rounded-md px-3 py-1 text-sm transition-colors ${
                                                    isUploadingDocs
                                                        ? 'cursor-not-allowed bg-gray-400 text-white'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                {isUploadingDocs ? 'Uploading...' : 'Choose Files'}
                                            </Label>
                                            <Input
                                                id="documents"
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp"
                                                onChange={handleDocumentUpload}
                                                className="hidden"
                                                disabled={isUploadingDocs}
                                                ref={fileInputRef}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            PDF, Word, Excel, Text, Image files up to 10MB
                                        </p>
                                    </div>
                                    {/* Document Previews */}
                                    {documentPreviews.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {documentPreviews.map((fileName, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm shadow dark:bg-gray-700"
                                                >
                                                    <span className="max-w-xs truncate">{fileName}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDocument(index)}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.documents && <p className="mt-2 text-sm text-red-500">{errors.documents}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Finding'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
