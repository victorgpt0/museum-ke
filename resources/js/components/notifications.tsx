// resources/js/Components/Notifications.tsx
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Bell, BellRing } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs"
                        >
                            {unreadCount}
                        </Badge>
                    ) : null}
                    {unreadCount > 0 ? (
                        <BellRing className="text-primary hover:text-primary/80" />
                    ) : (
                        <Bell className="text-muted-foreground hover:text-foreground" />
                    )}
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
