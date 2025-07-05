import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Save, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

interface FormData {
    title: string;
    author: string;
    category: string;
    document: File | null;
}

function NewArchive({ categories }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string>('');

    const { data, setData, post, processing, errors, progress } = useForm<FormData>({
        title: '',
        author: '',
        category: '',
        document: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/archives', {
            forceFormData: true,
        });
    };

    const handleFileSelect = (file: File) => {
        setData('document', file);
        setSelectedFileName(file.name);

        // Auto-fill title if it's empty
        if (!data.title) {
            const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            setData('title', nameWithoutExtension);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files?.[0]) {
            handleFileSelect(files[0]);
        }
    };

    const openFileExplorer = () => {
        fileInputRef.current?.click();
    };

    const removeFile = () => {
        setData('document', null);
        setSelectedFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📈';
            case 'txt':
                return '📋';
            default:
                return '📎';
        }
    };

    return (
        <>
            <Head title="New Archive" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-4">
                            <Link
                                href="/archives"
                                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Add New Archive</h1>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">Upload a new document to your archive collection</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            {/* File Upload Section */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Document *</label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileInputChange}
                                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                                    className="hidden"
                                />

                                {!data.document ? (
                                    <div
                                        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                            dragActive
                                                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                : errors.document
                                                  ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                                                  : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
                                        <div className="space-y-2">
                                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Choose a file or drag it here</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Supports PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">Maximum file size: 10MB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={openFileExplorer}
                                            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                                        >
                                            Browse Files
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{getFileIcon(selectedFileName)}</span>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">{selectedFileName}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{getFileSize(data.document.size)}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {errors.document && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.document}</p>}
                            </div>

                            {/* Title Field */}
                            <div>
                                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
                                        errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Enter document title"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                            </div>

                            {/* Author Field */}
                            <div>
                                <label htmlFor="author" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Author *
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    value={data.author}
                                    onChange={(e) => setData('author', e.target.value)}
                                    className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
                                        errors.author ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Enter author name"
                                />
                                {errors.author && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author}</p>}
                            </div>

                            {/* Category Field */}
                            <div>
                                <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
                                        errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <option value="" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                                        Select a category
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.name}
                                            className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
                            </div>

                            {/* Upload Progress */}
                            {progress && (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="mb-1 flex justify-between text-sm text-blue-900">
                                                <span>Uploading...</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-blue-200">
                                                <div
                                                    className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                                    style={{ width: `${progress.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-600">
                                <Link
                                    href="/archives"
                                    className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Archive
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <div className="flex gap-3">
                            <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                            <div>
                                <h3 className="mb-1 font-medium text-blue-900 dark:text-blue-100">Tips for uploading archives</h3>
                                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                    <li>• Use descriptive titles to make documents easy to find</li>
                                    <li>• Choose the appropriate category for better organization</li>
                                    <li>• Supported formats: PDF, Word, Excel, PowerPoint, and Text files</li>
                                    <li>• Maximum file size is 10MB per document</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Wrap the component with your layout
NewArchive.layout = (page: React.ReactElement) => <AppLayout>{page}</AppLayout>;

export default NewArchive;
