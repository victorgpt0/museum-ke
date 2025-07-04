import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Plus, Eye, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface Archive {
    id: number;
    title: string;
    author: string;
    category: string;
    created_at: string;
    updated_at: string;
    uploader_name: string;
}

interface Props {
    archives: {
        data: Archive[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    filters: {
        category?: string;
        search?: string;
        author?: string;
    };
}

export default function Archives({ archives, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = () => {
        router.get('/archives', {
            search: searchTerm,
            category: selectedCategory,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        router.get('/archives', {
            search: searchTerm,
            category: category,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this archive?')) {
            router.delete(`/archives/${id}`);
        }
    };

    const getCategoryBadge = (category: string) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (category) {
            case 'research':
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`;
            case 'context':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Archives', href: '/archives' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archives" />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Archives</h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    Manage and browse your archive collection
                                </p>
                            </div>
                            <Link
                                href="/archives/new-file"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Archive
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search archives..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCategoryFilter('')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        selectedCategory === ''
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => handleCategoryFilter('research')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        selectedCategory === 'research'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Research
                                </button>
                                <button
                                    onClick={() => handleCategoryFilter('context')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        selectedCategory === 'context'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Context
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Archives Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {archives.data.map((archive) => (
                            <div key={archive.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {archive.title}
                                        </h3>
                                        <span className={getCategoryBadge(archive.category)}>
                                            {archive.category.charAt(0).toUpperCase() + archive.category.slice(1)}
                                        </span>
                                    </div>
                                    <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Author:</span> {archive.author}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium">Uploaded by:</span> {archive.uploader_name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {formatDate(archive.created_at)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/archives/${archive.id}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/archives/${archive.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(archive.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {archives.data.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No archives found</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                {searchTerm || selectedCategory 
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Get started by adding your first archive.'
                                }
                            </p>
                            {!searchTerm && !selectedCategory && (
                                <Link
                                    href="/archives/new-file"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Archive
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {archives.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {((archives.current_page - 1) * archives.per_page) + 1} to{' '}
                                {Math.min(archives.current_page * archives.per_page, archives.total)} of{' '}
                                {archives.total} results
                            </div>
                            <div className="flex space-x-2">
                                {archives.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 