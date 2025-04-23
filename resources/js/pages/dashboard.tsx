import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Artifact = {
    id: number;
    title: string;
    condition: 'good' | 'poor';
    location: string;
    description: string;
    category: {
        name: string;
    };
};

export default function Dashboard() {
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [totalArtifacts, setTotalArtifacts] = useState(0);
    const [goodConditionCount, setGoodConditionCount] = useState(0);
    const [poorConditionCount, setPoorConditionCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/artifacts?page=${currentPage}&per_page=${perPage}${searchTerm ? `&search=${searchTerm}` : ''}`)
            .then(response => response.json())
            .then(data => {
                setArtifacts(data.artifacts);
                setTotalArtifacts(data.total);
                setTotalPages(data.total_pages);

                // Calculate condition counts
                const goodCount = data.artifacts.filter(
                    (a: Artifact) => a.condition === 'good'
                ).length;
                const poorCount = data.total - goodCount;

                setGoodConditionCount(goodCount);
                setPoorConditionCount(poorCount);
                setIsLoading(false);
            });
    }, [currentPage, perPage, searchTerm]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                        <h3 className="text-lg font-medium">Total Artifacts</h3>
                        {isLoading ? (
                            <PlaceholderPattern className="mt-2 h-8 w-1/2 stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        ) : (
                            <p className="text-3xl font-bold">{totalArtifacts}</p>
                        )}
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                        <h3 className="text-lg font-medium">Condition Summary</h3>
                        {isLoading ? (
                            <PlaceholderPattern className="mt-2 h-8 w-1/2 stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        ) : (
                            <div className="mt-2 space-y-1">
                                <p className="text-green-600 dark:text-green-400">
                                    Good: {goodConditionCount}
                                </p>
                                <p className="text-red-600 dark:text-red-400">
                                    Poor: {poorConditionCount}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                        <h3 className="text-lg font-medium">Categories</h3>
                        {isLoading ? (
                            <PlaceholderPattern className="mt-2 h-8 w-1/2 stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        ) : (
                            <p className="text-3xl font-bold">
                                {new Set(artifacts.map(a => a.category.name)).size}
                            </p>
                        )}
                    </div>
                </div>

                {/* Search and Artifacts List */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 overflow-hidden rounded-xl border p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Artifact Records</h2>
                        <input
                            type="text"
                            placeholder="Search artifacts..."
                            className="rounded-md border px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border dark:border-gray-700">
                            <table className="min-w-full divide-y dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Condition
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Location
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-gray-700">
                                    {artifacts.length > 0 ? (
                                        artifacts.map((artifact) => (
                                            <tr key={artifact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {artifact.title}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        artifact.condition === 'good'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {artifact.condition}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {artifact.category.title}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {artifact.location}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center">
                                                No artifacts found matching your search
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="mt-4 flex items-center justify-between px-4 py-3">
                                <div className="flex items-center">
        <span className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{artifacts.length}</span> of{' '}
            <span className="font-medium">{totalArtifacts}</span> results
        </span>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="mr-2 rounded-md border px-2 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            // Logic to show current page and nearby pages
                                            const pageToShow = currentPage <= 3
                                                ? i + 1
                                                : currentPage >= totalPages - 2
                                                    ? totalPages - 4 + i
                                                    : currentPage - 2 + i;

                                            if (pageToShow > 0 && pageToShow <= totalPages) {
                                                return (
                                                    <button
                                                        key={pageToShow}
                                                        onClick={() => setCurrentPage(pageToShow)}
                                                        className={`rounded-md px-2 py-1 text-sm ${
                                                            currentPage === pageToShow
                                                                ? 'bg-blue-500 text-white'
                                                                : 'border dark:border-gray-700'
                                                        }`}
                                                    >
                                                        {pageToShow}
                                                    </button>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="ml-2 rounded-md border px-2 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
