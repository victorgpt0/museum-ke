import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button, Input, Select } from '@headlessui/react';
import { Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function ActivityLogsIndex() {
    const { logs, users, events, filters } = usePage().props as any;
    const [filter, setFilter] = useState(filters || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const submitFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('activity-logs.index'), filter);
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Activity Logs', href: '/activity-logs' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Item Activity Logs</h1>
                <form onSubmit={submitFilter} className="mb-4 flex flex-wrap items-end gap-2">
                    <Select name="user_id" value={filter.user_id || ''} onChange={handleChange} className="w-48">
                        <option value="">All Users</option>
                        {users.map((user: any) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </Select>
                    <Select name="event" value={filter.event || ''} onChange={handleChange} className="w-40">
                        <option value="">All Events</option>
                        {events.map((event: string) => (
                            <option key={event} value={event}>
                                {event}
                            </option>
                        ))}
                    </Select>
                    <Input name="date_from" type="date" value={filter.date_from || ''} onChange={handleChange} className="w-36" placeholder="From" />
                    <Input name="date_to" type="date" value={filter.date_to || ''} onChange={handleChange} className="w-36" placeholder="To" />
                    <Button type="submit">Filter</Button>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Event</th>
                            <th>Item</th>
                            <th>Changes</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.data.map((log: any) => (
                            <tr key={log.id}>
                                <td>{log.causer ? log.causer.name : 'System'}</td>
                                <td>{log.description}</td>
                                <td>
                                    {log.subject_id ? (
                                        <Link href={route('items.show', log.subject_id)} className="text-blue-600 underline">
                                            View Item
                                        </Link>
                                    ) : (
                                        '—'
                                    )}
                                </td>
                                <td>
                                    {log.properties && log.properties.attributes && (
                                        <ul className="text-xs">
                                            {Object.entries(log.properties.attributes).map(([key, value]) => (
                                                <li key={key}>
                                                    <strong>{key}:</strong>{' '}
                                                    {log.properties.old && key in log.properties.old ? (
                                                        <span className="text-red-600 line-through">{String(log.properties.old[key])}</span>
                                                    ) : null}
                                                    {log.properties.old && key in log.properties.old ? <span className="mx-1">→</span> : null}
                                                    <span className="font-semibold text-green-700">{String(value)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </td>
                                <td>{new Date(log.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
