import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Edit, Eye, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import can from '@/lib/can';

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
        router.get(
            '/archives',
            {
                search: searchTerm,
                category: selectedCategory,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        router.get(
            '/archives',
            {
                search: searchTerm,
                category: category,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this archive?')) {
            router.delete(`/archives/${id}`);
        }
    };

    const getCategoryBadge = (category: string) => {
        const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
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

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Archives', href: '/archives' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archives" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Archives</h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">Manage and browse your archive collection</p>
                            </div>
                            {can('archives.create') && (
                                <Link
                                    href="/archives/new-file"
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Archive
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search archives..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCategoryFilter('')}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        selectedCategory === ''
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => handleCategoryFilter('research')}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        selectedCategory === 'research'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Research
                                </button>
                                <button
                                    onClick={() => handleCategoryFilter('context')}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        selectedCategory === 'context'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Context
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Archives Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {archives.data.map((archive) => (
                            <div
                                key={archive.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">{archive.title}</h3>
                                        <span className={getCategoryBadge(archive.category)}>
                                            {archive.category.charAt(0).toUpperCase() + archive.category.slice(1)}
                                        </span>
                                    </div>
                                    <FileText className="ml-2 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                </div>

                                <div className="mb-4 space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Author:</span> {archive.author}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium">Uploaded by:</span> {archive.uploader_name}
                                    </p>
                                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        {formatDate(archive.created_at)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        {can('archives.view') && (
                                            <Link
                                                href={`/archives/${archive.id}`}
                                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                                                title="View"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        )}
                                        {can('archives.edit') && (
                                            <Link
                                                href={`/archives/${archive.id}/edit`}
                                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        )}
                                    </div>
                                    {can('archives.delete') && (
                                        <button
                                            onClick={() => handleDelete(archive.id)}
                                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {archives.data.length === 0 && (
                        <div className="py-12 text-center">
                            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No archives found</h3>
                            <p className="mb-4 text-gray-600 dark:text-gray-300">
                                {searchTerm || selectedCategory
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Get started by adding your first archive.'}
                            </p>
                            {!searchTerm && !selectedCategory && can('archives.create') && (
                                <Link
                                    href="/archives/new-file"
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Archive
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {archives.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {(archives.current_page - 1) * archives.per_page + 1} to{' '}
                                {Math.min(archives.current_page * archives.per_page, archives.total)} of {archives.total} results
                            </div>
                            <div className="flex space-x-2">
                                {archives.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                  ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                  : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
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
