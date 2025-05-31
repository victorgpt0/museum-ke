import React, { JSX } from 'react';
import { Link } from '@inertiajs/react';

interface Column<T> {
    label: string;
    accessor: keyof T;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

const Table = <T, >({
                        data,
                        columns,
                        onEdit,
                        onDelete
                    }: TableProps<T>): JSX.Element => {
    return (
        <div className={`p-5`}>
            <Link
                href={'/users/create'}
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
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-1"
                                        >
                                            Delete
                                        </button>
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
