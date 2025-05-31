import React, { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Upload, FileText, ArrowLeft, Save, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/archives"
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Add New Archive</h1>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    Upload a new document to your archive collection
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* File Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Document *
                                </label>
                                
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileInputChange}
                                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                                    className="hidden"
                                />

                                {!data.document ? (
                                    <div
                                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                            dragActive
                                                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                : errors.document
                                                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                        <div className="space-y-2">
                                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                Choose a file or drag it here
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Supports PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                Maximum file size: 10MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={openFileExplorer}
                                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Browse Files
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">
                                                    {getFileIcon(selectedFileName)}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {selectedFileName}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {getFileSize(data.document.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {errors.document && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.document}</p>
                                )}
                            </div>

                            {/* Title Field */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                                        errors.title 
                                            ? 'border-red-300 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Enter document title"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                                )}
                            </div>

                            {/* Author Field */}
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Author *
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    value={data.author}
                                    onChange={(e) => setData('author', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                                        errors.author 
                                            ? 'border-red-300 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    placeholder="Enter author name"
                                />
                                {errors.author && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author}</p>
                                )}
                            </div>

                            {/* Category Field */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                                        errors.category 
                                            ? 'border-red-300 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                        Select a category
                                    </option>
                                    {categories.map((category) => (
                                        <option 
                                            key={category.id} 
                                            value={category.name}
                                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                                )}
                            </div>

                            {/* Upload Progress */}
                            {progress && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm text-blue-900 mb-1">
                                                <span>Uploading...</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-blue-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                                <Link
                                    href="/archives"
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Archive
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex gap-3">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Tips for uploading archives</h3>
                                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
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