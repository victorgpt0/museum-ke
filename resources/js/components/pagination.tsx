import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationLink } from '@/types';
import { Link, router } from '@inertiajs/react';

interface PaginationProps {
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
}

export default function Pagination({ from, to, total, links }: PaginationProps) {
    const searchParams = new URLSearchParams(window.location.search);
    const currentPerPage = searchParams.get('perPage') || '10';

    const handlePerPageChange = (value: string) => {
        const searchParams = new URLSearchParams(window.location.search);

        // Update parameters
        searchParams.set('perPage', value);
        searchParams.delete('page'); // This will make Laravel default to page 1

        // Use Inertia's visit instead of router.get for full component reload
        router.get(`${window.location.pathname}?${searchParams.toString()}`, {
            preserveState: true,
            preserveScroll: true,
            only: ['users'], // Make sure this matches your prop key
        });
    };

    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0].url && (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </Link>
                )}
                {links[links.length - 1].url && (
                    <Link
                        href={links[links.length - 1].url}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </Link>
                )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </p>
                </div>
                <div>
                    <Select defaultValue={currentPerPage} onValueChange={handlePerPageChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Records per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {[10, 25, 50, 100].map((value) => (
                                    <SelectItem key={value} value={value.toString()} className="text-sm">
                                        {value} per page
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {links.slice(1, -1).map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                                    link.active
                                        ? 'z-10 border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}`}
                                preserveScroll
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
