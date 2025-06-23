import React, { useState } from 'react';
import Table from '../../components/ui/table';
import Pagination from '../../components/pagination';
import { Link, router, usePage } from '@inertiajs/react';
import { Button, Input, Select } from '@headlessui/react';
import AppLayout from '@/layouts/app-layout';

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

  return (
      <AppLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Item Activity Logs</h1>
      <form onSubmit={submitFilter} className="flex gap-2 mb-4 flex-wrap items-end">
        <Select name="user_id" value={filter.user_id || ''} onChange={handleChange} className="w-48">
          <option value="">All Users</option>
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </Select>
        <Select name="event" value={filter.event || ''} onChange={handleChange} className="w-40">
          <option value="">All Events</option>
          {events.map((event: string) => (
            <option key={event} value={event}>{event}</option>
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
                  <Link href={route('items.show', log.subject_id)} className="text-blue-600 underline">View Item</Link>
                ) : '—'}
              </td>
              <td>
                {log.properties && log.properties.attributes && (
                  <ul className="text-xs">
                    {Object.entries(log.properties.attributes).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong>{' '}
                        {log.properties.old && key in log.properties.old ? (
                          <span className="line-through text-red-600">{String(log.properties.old[key])}</span>
                        ) : null}
                        {log.properties.old && key in log.properties.old ? (
                          <span className="mx-1">→</span>
                        ) : null}
                        <span className="text-green-700 font-semibold">{String(value)}</span>
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
