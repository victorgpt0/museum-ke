import React, { JSX } from 'react';
import { Link, router } from '@inertiajs/react';
import DeleteConfirm from '@/components/delete-dialog';
import Can from '@/lib/can';
import { Input } from '@/components/ui/input';
import { PaginationLink } from '@/types';
import Pagination from '@/components/pagination';
import { EditIcon, EyeIcon, File, PlusIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column<T> {
    label: string;
    accessor: keyof T;
    render?: (value: any, item: T) => JSX.Element | string | number;
}

interface TableProps<T> {
    data: T[];
    resource: string;
    type: string;
    columns: Column<T>[];
    requirePasswordOnDelete?: boolean;
    paginationLinks: PaginationLink[];
    from: number;
    to: number;
    total: number;
    canSearch: boolean;
}

const Table = <T ,>({
                        data,
                        resource,
                        type,
                        columns,
                        paginationLinks,
    from,
    to,
    total,
    canSearch = true,
                    }: TableProps<T>): JSX.Element => {
    return (
        <div className={`p-4`}>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 overflow-hidden rounded-xl border p-3">

                {total === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="mb-6 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                            <File className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>

                        <div className="mb-8 space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                No {resource} found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                Get started by creating your first {resource.toLowerCase()} item.
                            </p>
                        </div>

                        {Can(`${resource}.create`) && (
                            <Link
                                href={`/${resource}/create`}
                                className="inline-flex items-center px-6 py-3 text-sm capitalize font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                                preserveScroll
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Create New {resource}
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Create Button - Left aligned on all screens */}
                    <div className="flex justify-start">
                        {Can(`${resource}.create`) && (
                            <Link
                                href={`/${resource}/create`}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-200"
                                preserveScroll
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Create New
                            </Link>
                        )}
                    </div>


                    {canSearch && (
                        <div className="flex justify-end">
                            <form
                                method="GET"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const search = formData.get('search');
                                    // Use Inertia's router for client-side navigation
                                    router.get(window.location.pathname, { search }, {
                                        preserveState: true,
                                        replace: true
                                    });
                                }}
                                className="w-full sm:max-w-md"
                            >
                                <div className="relative">
                                    <Input
                                        type="text"
                                        name="search"
                                        placeholder={`Press  ↵  to search for ${resource}`}
                                        defaultValue={new URLSearchParams(window.location.search).get('search') || ''}
                                        className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Button
                                        variant={`ghost`}
                                        type="submit"
                                        className="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                                    >
                                        <SearchIcon className="w-5 h-5" /> {/* Add a search icon */}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
        <div className="overflow-x-auto mt-3 rounded-md border dark:border-gray-700">
            <table className="min-w-full table-auto text-sm text-left rtl:text-right divide-y dark:divide-gray-700">
                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-900">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.accessor as string}
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        >
                            {column.label}
                        </th>
                    ))}

                    <th className="px-6 py-3">
                        Actions
                    </th>

                </tr>
                </thead>
                <tbody className={`divide-y dark:divide-gray-700`}>
                {data.map((item, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}
                    >
                        {columns.map((column) => (
                            <td
                                key={column.accessor as string}
                                className="px-6 py-2 whitespace-nowrap"
                            >
                                {column.render
                                    ? column.render(item[column.accessor], item)
                                    : item[column.accessor]
                                }
                            </td>
                        ))}

                            <td className="px-6 py-2">
                                <div className="flex space-x-2 text-center justify-center items-center">
                                    {Can(`${resource}.view`) && (
                                        <Link
                                            href={route(`${resource}.show`, item.id)}
                                            className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                    )}
                                    {Can(`${resource}.edit`) && (
                                        <Link
                                            href={route(`${resource}.edit`, item.id)}
                                            className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                        </Link>
                                    )}
                                    {Can(`${resource}.delete`) && (
                                       <DeleteConfirm itemType={type} deleteRoute={route(`${resource}.destroy`, item.id)}/>
                                    )}
                                </div>
                            </td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
                <Pagination links={paginationLinks} from={from} to={to} total={total}/>
        </>
            )}
        </div>

        </div>
    );
};

export default Table;
