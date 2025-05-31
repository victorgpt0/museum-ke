import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    LayoutGrid,
    Map,
    Plus,
    ChevronDown,
    ChevronRight,
    MessageSquareText,
    UsersRound
} from 'lucide-react';
import AppLogo from './app-logo';

import { useState, useEffect } from 'react';

// Extend NavItem type to include children for submenus
interface ExtendedNavItem extends NavItem {
    children?: NavItem[];
    expanded?: boolean;
}

// Updated main navigation items with submenus
const mainNavItems: ExtendedNavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        children: [
             {
                title: 'full dashboard',
                href: '/dashboard',
                icon: View,
            },
            {
                title: 'New Artifact',
                href: '/dashboard/new-artifact',
                icon: Plus,
            },
        ]
    },
    {
        title: 'Maps',
        href: '/map',  // This is now the default URL when clicked
        icon: Map,
        children: [
            {
                title: 'Full Map',
                href: '/map',
                icon: Map,
            },
            {
                title: 'Museums Map',
                href: '/map/museums',
                icon: Map,
            }
        ]
    },
    {
        title: 'Users',
        href: '/users',
        icon: UsersRound,
    }

    {
        title: 'Archives',
        href: '/archives',  // Default URL when Archives is clicked
        icon: Archive,
        children: [
            {
                title: 'View Archives',
                href: '/archives',
                icon: Folder,
            },
            {
                title: 'New File',
                href: '/archives/new-file',
                icon: FileText,
            }
        ]
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'AI Assistant',
        href: '/ai',
        icon: MessageSquareText,
    }
];

// Create a new NavMainWithDropdowns component with a soft navigation approach
function NavMainWithDropdowns({ items }: { items: ExtendedNavItem[] }) {
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

    const toggleExpand = (title: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // Handle link clicks for menu items that should stay in the app layout
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Check if this is an internal route that should use Inertia
        if (href.startsWith('/')) {
            e.preventDefault();
            router.visit(href, {
                preserveScroll: true,
                preserveState: true,
                replace: true
            });
        }
        // External links will navigate normally
    };

    return (
        <SidebarMenu>
            {items.map((item) => (
                <div key={item.title}>
                    <SidebarMenuItem>
                        {item.children ? (
                            <div className="flex items-center justify-between w-full cursor-pointer" onClick={() => toggleExpand(item.title)}>
                                <SidebarMenuButton>
                                    {item.icon && <item.icon className="mr-2" size={18} />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                                {expandedItems[item.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                        ) : (
                            <SidebarMenuButton asChild>
                                <Link href={item.href} onClick={(e) => handleClick(e, item.href)}>
                                    {item.icon && <item.icon className="mr-2" size={18} />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>

                    {/* Submenu Items */}
                    {item.children && expandedItems[item.title] && (
                        <div className="pl-6">
                            {item.children.map((child) => (
                                <SidebarMenuItem key={child.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={child.href} onClick={(e) => handleClick(e, child.href)}>
                                            {child.icon && <child.icon className="mr-2" size={16} />}
                                            <span>{child.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </SidebarMenu>
    );
}

export function AppSidebar() {
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

    // Auto-expand menu items based on current route
    useEffect(() => {
        const path = window.location.pathname;

        // Auto-expand Maps if we're on a map route
        if (path.startsWith('/map')) {
            setExpandedItems((prev) => ({
                ...prev,
                'Maps': true
            }));
        }

        // Auto-expand Archives if we're on an archives route
        if (path.startsWith('/archives')) {
            setExpandedItems((prev) => ({
                ...prev,
                'Archives': true
            }));
        }

        // Auto-expand Dashboard if we're on a dashboard route
        if (path.startsWith('/dashboard')) {
            setExpandedItems((prev) => ({
                ...prev,
                'Dashboard': true
            }));
        }
    }, []);


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" onClick={(e) => {
                                e.preventDefault();
                                router.visit('/dashboard', {
                                    preserveScroll: true,
                                    preserveState: true
                                });
                            }}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMainWithDropdowns items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
