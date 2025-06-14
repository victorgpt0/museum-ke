import React, { useState } from 'react';
import { router, usePage, Link, Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    Check,
    CheckCircle,
    ExternalLink,
    Info,
    MessageSquare,
    TrashIcon,
    XCircle,
    CheckCheck,
    Trash2,
    Filter,
    Search,
    ArrowLeft,
    MoreHorizontal,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: '/notifications',
    }
];

export default function Index({notifications_index, unreadCount_index}){

    const notifications = notifications_index;
    const unreadCount = unreadCount_index;
    const filters = {
        search: '',
        type: 'all',
        status: 'all'
    }

    const [selectedNotifications, setSelectedNotifications] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterType, setFilterType] = useState(filters.type || 'all');
    const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
    const getNotifIcon = (notif_type: string) => {
        const iconProps = { size: 20, className: 'flex-shrink-0' };

        switch (notif_type) {
            case 'info':
                return <Info {...iconProps} className="text-blue-500" />;
            case 'success':
                return <CheckCircle {...iconProps} className="text-green-500" />;
            case 'warning':
                return <AlertTriangle {...iconProps} className="text-yellow-500" />;
            case 'error':
                return <XCircle {...iconProps} className="text-red-500" />;
            case 'message':
                return <MessageSquare {...iconProps} className="text-purple-500" />;
            default:
                return <Info {...iconProps} className="text-gray-500" />;
        }
    };

    const getTypeColor = (notif_type: string) => {
        switch (notif_type) {
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'message': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const handleSelectNotification = (id: number) => {
        setSelectedNotifications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const selectAllNotifications = () => {
        if (selectedNotifications.size === notifications.length) {
            setSelectedNotifications(new Set());
        } else {
            setSelectedNotifications(new Set(notifications.map(n => n.id)));
        }
    };

    const markAsRead = (id: number) => {
        router.post(
            route('notifications.mark-as-read', id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['notifications', 'unreadCount'],
            },
        );
    };

    const markAllAsRead = () => {
        router.post(
            route('notifications.mark-all-as-read'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['notifications', 'unreadCount'],
            },
        );
    };

    const markSelectedAsRead = () => {
        const ids = Array.from(selectedNotifications);
        router.post(route('notifications.mark-bulk-as-read'), {
            ids: ids,
        }, {
            preserveScroll: true,
            preserveState: true,
            only: ['notifications', 'unreadCount'],
            onSuccess: () => {
                setSelectedNotifications(new Set());
            },
        });
    };

    const deleteNotification = (id: number) => {
        router.delete(route('notifications.destroy', id), {
            preserveScroll: true,
            preserveState: true,
            only: ['notifications', 'unreadCount'],
        });
    };

    const deleteSelectedNotifications = () => {
        const ids = Array.from(selectedNotifications);
        router.delete(route('notifications.destroy-bulk'), {
            data: { ids },
            preserveScroll: true,
            preserveState: true,
            only: ['notifications', 'unreadCount'],
            onSuccess: () => {
                setSelectedNotifications(new Set());
            },
        });
    };

    const deleteAllNotifications = () => {
        router.delete(route('notifications.destroy-all'), {
            preserveScroll: true,
            preserveState: true,
            only: ['notifications', 'unreadCount'],
            onSuccess: () => {
                setSelectedNotifications(new Set());
            },
        });
    };

    const applyFilters = () => {
        router.get(route('notifications.index'), {
            search: searchTerm || undefined,
            type: filterType !== 'all' ? filterType : undefined,
            status: filterStatus !== 'all' ? filterStatus : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('all');
        setFilterStatus('all');
        router.get(route('notifications.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleRedirect = (url: string, id: number, read: boolean) => {
        if (!read) {
            markAsRead(id);
        }
        if (url) {
            router.visit(url);
        }
    };


    const hasSelectedNotifications = selectedNotifications.size > 0;
    const allSelected = selectedNotifications.size === notifications.length && notifications.length > 0;
    const hasFilters = searchTerm || filterType !== 'all' || filterStatus !== 'all';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Notifications`}/>

            <div className="border-b overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Bell size={24} className="text-gray-700 dark:text-gray-300" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Manage all your notifications
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <Badge variant="destructive">
                                    {unreadCount} unread
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl min-w-md px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters and Search */}
                <Card className="mb-6">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter size={20} />
                            Filters & Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search notifications..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    />
                                </div>
                            </div>
                            <div>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="info">Info</SelectItem>
                                        <SelectItem value="success">Success</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="error">Error</SelectItem>
                                        <SelectItem value="message">Message</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="unread">Unread</SelectItem>
                                        <SelectItem value="read">Read</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-2">
                                <Button onClick={applyFilters} size="sm">
                                    Apply Filters
                                </Button>
                                {hasFilters && (
                                    <Button onClick={clearFilters} variant="outline" size="sm">
                                        Clear
                                    </Button>
                                )}
                            </div>
                            {notifications.total > 0 && (
                                <span className="text-sm text-gray-500">
                                    {notifications.from}-{notifications.to} of {notifications.total} notifications
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {notifications.length > 0 && (
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={selectAllNotifications}
                                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {hasSelectedNotifications
                                            ? `${selectedNotifications.size} of ${notifications.length} selected`
                                            : `Select all ${notifications.length} notifications`
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasSelectedNotifications ? (
                                        <>
                                            <Button
                                                onClick={markSelectedAsRead}
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                <Check size={16} className="mr-1" />
                                                Mark Read ({selectedNotifications.size})
                                            </Button>
                                            <Button
                                                onClick={deleteSelectedNotifications}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <TrashIcon size={16} className="mr-1" />
                                                Delete ({selectedNotifications.size})
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            {unreadCount > 0 && (
                                                <Button
                                                    onClick={markAllAsRead}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                >
                                                    <CheckCheck size={16} className="mr-1" />
                                                    Mark All Read
                                                </Button>
                                            )}
                                            <Button
                                                onClick={deleteAllNotifications}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                Delete All
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Notifications List */}
                {notifications.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <div className="text-center">
                                <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No notifications found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {hasFilters
                                        ? "Try adjusting your filters to see more notifications."
                                        : "You're all caught up! No notifications to display."
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`transition-all hover:shadow-md ${
                                    !notification.read ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800' : ''
                                } ${
                                    selectedNotifications.has(notification.id) ? 'ring-2 ring-primary' : ''
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <Checkbox
                                            checked={selectedNotifications.has(notification.id)}
                                            onCheckedChange={() => handleSelectNotification(notification.id)}
                                            className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            onClick={(e) => e.stopPropagation()}
                                        />

                                        <div className="flex-shrink-0 mt-1">
                                            {getNotifIcon(notification.notif_type)}
                                        </div>

                                        <div
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => handleRedirect(notification.url, notification.id, notification.read)}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {notification.title}
                                                        </h3>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-xs ${getTypeColor(notification.notif_type)}`}
                                                        >
                                                            {notification.notif_type}
                                                        </Badge>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {notification.timestamp}
                                                        </span>
                                                        {notification.url && (
                                                            <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                                <ExternalLink size={12} />
                                                                Click to view
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div
                                                    className="flex items-center gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {!notification.read ? (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:bg-blue-50 h-8 px-2"
                                                        >
                                                            <Eye size={14} className="mr-1" />
                                                            Mark Read
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-400 h-8 px-2"
                                                            disabled
                                                        >
                                                            <EyeOff size={14} className="mr-1" />
                                                            Read
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50 h-8 px-2"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {notifications.last_page > 1 && (
                    <Card className="mt-6">
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Page {notifications.current_page} of {notifications.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {notifications.current_page > 1 && (
                                        <Button
                                            onClick={() => router.get(route('notifications.index'), {
                                                ...filters,
                                                page: notifications.current_page - 1
                                            })}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {notifications.current_page < notifications.last_page && (
                                        <Button
                                            onClick={() => router.get(route('notifications.index'), {
                                                ...filters,
                                                page: notifications.current_page + 1
                                            })}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>


        </AppLayout>
    );
}
