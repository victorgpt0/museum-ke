import React, { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Bell, BellRing } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { echo } from '@laravel/echo-react';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    url: string;
    read: boolean;
    created_at: string;
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

    useEffect(() => {
        const channel = echo().private(`user-notifications.${auth.user.id}`)
            .listen('notification.created', (notification) => {
                console.log('new notif',notification);

                const newNotification: Notification = {
                    id: notification.id || Date.now(),
                    title: notification.data.title,
                    message: notification.data.message,
                    type: notification.data.type,
                    url: notification.data.url,
                    read: false,
                    created_at: notification.created_at,
                };

                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);

                if(Notification.permission === 'granted'){
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
            channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
            echo().leaveChannel(`private-user-notifications.${auth.user.id}`);
        }
    }, [auth.user.id]);

    useEffect(() => {
        if('Notification' in window && Notification.permission !== 'granted'){
            Notification.requestPermission();
        }
    }, []);

    const markAsRead = (id: number) => {
        router.post(route('notifications.mark-as-read', id), {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['notifications', 'unreadCount'],
            onSuccess: () => {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        })
    }

    const markAllAsRead = () => {
        router.post(route('notifications.mark-all-as-read'), {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['notifications', 'unreadCount'], // Only reload these props
            onSuccess: () => {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                );
                setUnreadCount(0);
            }
        })
    }

    const deleteNotification = (id: number) => {
        router.delete(route('notifications.destroy', id), {
            preserveScroll: true,
            preserveState: true,
            only: ['notifications', 'unreadCount'],
            onSuccess: () => {
                const wasUnread = notifications.find(n => n.id === id)?.read === false;
                setNotifications(prev => prev.filter(n => n.id !== id));
                if (wasUnread) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        })
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative">
                <div className="relative">
                    {unreadCount > 0 ? (
                        <span
                            className="
                                absolute -top-1.5 -right-1.5
                                bg-red-500 text-white
                                rounded-full
                                w-4 h-4
                                flex items-center justify-center
                                text-[10px]
                                font-bold
                                z-10
                                border-2 border-white
                                dark:border-gray-800
                            "

                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    ) : null}
                    <div
                        className="
                            p-1.5
                            rounded-full
                            border
                            border-gray-200
                            dark:border-gray-700
                            hover:bg-gray-100
                            dark:hover:bg-gray-700
                            transition-colors
                            relative
                            focus:outline-none
                            focus:ring-0
                            focus:border-transparent
                        "
                    >
                        {unreadCount > 0 ? (
                            <BellRing
                                className="
                                    w-5 h-5
                                    text-primary
                                    dark:text-primary-light
                                "
                            />
                        ) : (
                            <Bell
                                className="
                                    w-5 h-5
                                    text-gray-500
                                    dark:text-gray-400
                                "
                            />
                        )}
                    </div>

                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`
                                    flex justify-between items-center
                                    ${!notification.read ? 'bg-accent' : ''}
                                    hover:bg-accent/50 cursor-pointer
                                `}
                            >
                                <div>
                                    <p className="text-sm">{notification.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {notification.timestamp}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
                <div className="border-t p-4 text-center">
                    <button className="text-sm text-primary hover:underline">
                        View all notifications
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notifications;
