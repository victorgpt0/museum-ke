import { Link, router } from '@inertiajs/react';
import { PaginationLink } from '@/types';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

interface PaginationProps {
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
}

export default function Pagination({ from,to,total,links }: PaginationProps) {
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
        <div className="flex items-center justify-between mt-4">
            <div className="flex-1 flex justify-between sm:hidden">
                {links[0].url && (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Previous
                    </Link>
                )}
                {links[links.length - 1].url && (
                    <Link
                        href={links[links.length - 1].url}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Next
                    </Link>
                )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{from}</span> to{' '}
                        <span className="font-medium">{to}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </p>
                </div>
                <div>
                    <Select
                        defaultValue={currentPerPage}
                        onValueChange={handlePerPageChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Records per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {[10, 25, 50, 100].map((value) => (
                                    <SelectItem
                                        key={value}
                                        value={value.toString()}
                                        className="text-sm"
                                    >
                                        {value} per page
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {links.slice(1, -1).map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    link.active
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
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
