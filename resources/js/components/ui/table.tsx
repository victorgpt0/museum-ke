import React, { JSX } from 'react';
import { Link } from '@inertiajs/react';
import DeleteConfirm from '@/components/delete-dialog';

interface Column<T> {
    label: string;
    accessor: keyof T;
}

interface TableProps<T> {
    data: T[];
    resource: string;
    type: string;
    columns: Column<T>[];
    onShow?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    requirePasswordOnDelete?: boolean;
}

const Table = <T, >({
                        data,
                        resource,
    type,
                        columns,
                        onShow,
                        onEdit,
                        onDelete,
    requirePasswordOnDelete = false,
                    }: TableProps<T>): JSX.Element => {
    return (
        <div className={`p-5`}>
            <Link
                href={`/${resource}/create`}
                className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Create New
            </Link>
        <div className="overflow-x-auto mt-3 rounded-md">
            <table className="min-w-full table-auto text-sm text-left rtl:text-right">
                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-900">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.accessor as string}
                            className="px-6 py-3"
                        >
                            {column.label}
                        </th>
                    ))}
                    {(onEdit || onDelete) && (
                        <th className="px-6 py-3">
                            Actions
                        </th>
                    )}
                </tr>
                </thead>
                <tbody>
                {data.map((item, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className={"odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"}
                    >
                        {columns.map((column) => (
                            <td
                                key={column.accessor as string}
                                className="px-6 py-2"
                            >
                                {item[column.accessor]}
                            </td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td className="px-6 py-2">
                                <div className="flex space-x-2">
                                    {onShow && (
                                        <Link
                                            href={route(`${resource}.show`, item.id)}
                                            className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                                        >
                                            View
                                        </Link>
                                    )}
                                    {onEdit && (
                                        <Link
                                            href={route(`${resource}.edit`, item.id)}
                                            className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Edit
                                        </Link>
                                    )}
                                    {onDelete && (
                                       <DeleteConfirm itemType={type} deleteRoute={route(`${resource}.destroy`, item.id)} requirePassword={requirePasswordOnDelete}/>
                                    )}
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default Table;
