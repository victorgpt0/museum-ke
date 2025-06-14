import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router, usePage } from '@inertiajs/react';
import { echo } from '@laravel/echo-react';
import {
    AlertTriangle,
    Bell,
    BellRing, Check,
    CheckCircle,
    ExternalLink,
    Info,
    MessageSquare,
    TrashIcon,
    XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Marker } from 'react-leaflet';
import * as url from 'node:url';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    notif_type: string;
    url: string;
    read: boolean;
    timestamp: string;
}

interface Props {
    auth: {
        user: {
            id: number;
        };
    };
    notifications?: Notification[];
    unreadCount?: number;
}

const Notifications: React.FC = () => {
    const { auth, notifications: initialNotifications = [], unreadCount: initialUnreadCount = 0 } = usePage<Props>().props;

    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

    const getNotifIcon = (notif_type) => {
        const iconProps = { size: 16, className: 'flex-shrink-0 mr-2' };

        switch (notif_type){
            case 'info':
                return <Info {...iconProps} className={`text-blue-500`}/>;
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
    }

    useEffect(() => {
        echo()
            .private(`user-notifications.${auth.user.id}`)
            .listen('.notification.created', (notification) => {
                console.log('Full notification object:', notification);
                console.log('Notification keys:', Object.keys(notification));


                const newNotification: Notification = {
                    id: notification.id || Date.now(),
                    title: notification.title,
                    message: notification.message,
                    type: notification.type,
                    notif_type: notification.notif_type,
                    url: notification.url,
                    read: notification.read,
                    timestamp: notification.timestamp,
                };

                console.log('Processed notification:', newNotification);

                setNotifications((prev) => [newNotification, ...prev]);
                setUnreadCount((prev) => prev + 1);

                if (Notification.permission === 'granted') {
                    new Notification(newNotification.title, {
                        body: newNotification.message,
                        icon: '/favicon.ico',
                    });
                }
            })
            .error((error) => {
                console.log('broadcast error', error);
            });

        return () => {
            echo().leaveChannel(`private-user-notifications.${auth.user.id}`);
        };
    }, [auth.user.id]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const markAsRead = (id: number, e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(
            route('notifications.mark-as-read', id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['notifications', 'unreadCount'],
                onSuccess: () => {
                    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                },
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
                only: ['notifications', 'unreadCount'], // Only reload these props
                onSuccess: () => {
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                    setUnreadCount(0);
                },
            },
        );
    };

    const deleteNotification = (id: number, e) => {
        e.preventDefault();
        e.stopPropagation();
        router.delete(route('notifications.destroy', id), {
            preserveScroll: true,
            preserveState: true,
            only: ['notifications', 'unreadCount'],
            onSuccess: () => {
                const wasUnread = notifications.find((n) => n.id === id)?.read === false;
                setNotifications((prev) => prev.filter((n) => n.id !== id));
                if (wasUnread) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                }
            },
        });
    };

    const handleRedirect = (redirect:string, id, e) => {
        if (redirect) {
            router.visit(redirect, {
                onSuccess: () => markAsRead(id, e)
            });
        } else {
            markAsRead(id, e);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative">
                <div className="relative">
                    {unreadCount > 0 ? (
                        <span className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white dark:border-gray-800">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    ) : null}
                    <div className="relative rounded-full border border-gray-200 p-1.5 transition-colors hover:bg-gray-100 focus:border-transparent focus:ring-0 focus:outline-none dark:border-gray-700 dark:hover:bg-gray-700">
                        {unreadCount > 0 ? (
                            <BellRing className="text-primary dark:text-primary-light h-5 w-5" />
                        ) : (
                            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
                <div className="flex items-center justify-between border-b p-4">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-muted-foreground hover:text-foreground text-sm">
                            Mark all as read
                        </button>
                    )}
                </div>
                {notifications.length === 0 ? (
                    <>
                        <MessageSquare className={`mx-auto mt-5 mb-2 opacity-50`} size={32} />
                        <div className="text-muted-foreground p-4 text-center">No notifications</div>
                    </>
                ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`my-1 ${!notification.read ? 'bg-accent' : ''} hover:bg-accent/50 cursor-pointer transition-colors`}
                                onClick={(e) => handleRedirect(notification.url, notification.id, e)}
                            >
                                <div className="flex w-full items-start gap-3">
                                    {/* Icon */}
                                    <div className="mt-0.5">{getNotifIcon(notification.notif_type)}</div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-2">
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className={`mt-1 text-sm ${!notification.read ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                                                    {notification.message}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                                                    {notification.url && <ExternalLink size={12} className="text-muted-foreground/50" />}
                                                </div>
                                            </div>
                                            {!notification.read && <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />}
                                        </div>

                                        {/* Action Buttons - Moved here with proper spacing */}
                                        <div className="mt-3 flex justify-end gap-2">
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => markAsRead(notification.id, e)}
                                                    className="h-8 px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
                                                >
                                                    <Check size={12} className="mr-1" />
                                                    Mark as read
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => deleteNotification(notification.id, e)}
                                                className="h-8 px-2 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                            >
                                                <TrashIcon size={12} className="mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
                <div className="border-t p-4 text-center">
                    <Button
                        variant={`ghost`}
                        className="text-primary text-sm hover:underline"
                        onClick={() => router.visit(route('notifications.index'))}
                    >View all notifications</Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notifications;
