// resources/js/Components/Notifications.tsx
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Bell, BellRing } from 'lucide-react';

interface Notification {
    id: number;
    message: string;
    read: boolean;
    timestamp: string;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        // Example notifications - replace with actual data fetching
        {
            id: 1,
            message: 'New exhibition added',
            read: false,
            timestamp: '2 min ago'
        },
        {
            id: 2,
            message: 'Ticket sales report',
            read: true,
            timestamp: '1 hour ago'
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

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
                            {unreadCount}
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
                            onClick={() => {
                                // Mark all as read logic
                                setNotifications(
                                    notifications.map(n => ({...n, read: true}))
                                );
                            }}
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
