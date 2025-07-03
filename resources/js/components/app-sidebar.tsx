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
    UsersRound,
    View,
    Archive,
    Folder,
    FileText,
    Shield,
    Package,
    History,
    FileCheck, FolderRoot, LogsIcon
} from 'lucide-react';
import AppLogo from './app-logo';
import Can from '@/lib/can';

import { useState, useEffect } from 'react';

// Extend NavItem type to include children for submenus
interface ExtendedNavItem extends NavItem {
    children?: NavItem[];
    expanded?: boolean;
    permission?: string;
}

// Updated main navigation items with submenus
const mainNavItems: ExtendedNavItem[] = [
    {
        title: 'Artifacts',
        href: '/artifacts',
        icon: Archive,
        permission: 'artifacts.view',
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        permission: 'dashboard.view',
        children: [
             {
                title: 'full dashboard',
                href: '/dashboard',
                icon: View,
                permission: 'dashboard.view',
            },
            {
                title: 'New Artifact',
                href: '/dashboard/new-artifact',
                icon: Plus,
                permission: 'artifacts.create',
            },
        ]
    },
     {
        title: 'Project Dashboard',
        href: '/project/all-projects',
        icon: LayoutGrid,
        permission: 'projects.view',
    },
    {
        title: 'Maps',
        href: '/map',
        icon: Map,
        permission: 'maps.view',
        children: [
            {
                title: 'Full Map',
                href: '/map',
                icon: Map,
                permission: 'maps.view',
            },
            {
                title: 'Museums Map',
                href: '/map/museums',
                icon: Map,
                permission: 'maps.view',
            }
        ]
    },
    {
        title: 'Acquisitions',
        href: '/curator/acquisition-history',
        icon: Package,
        permission: 'acquisitions.view',
       
            
        
    },
    {
        title: 'Users',
        href: '/users',
        icon: UsersRound,
        permission: 'users.view',
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: Shield,
        permission: 'roles.view',
    },
    {
        title: 'Logs',
        href: route('activity-logs.index'),
        icon: LogsIcon,
        permission: 'logs.view',
    },
   
    {
        title: 'Archives',
        href: '/archives',
        icon: Archive,
        permission: 'archives.view',
        children: [
            {
                title: 'View Archives',
                href: '/archives',
                icon: Folder,
                permission: 'archives.view',
            },
            {
                title: 'New File',
                href: '/archives/new-file',
                icon: FileText,
                permission: 'archives.create',
            }
        ]
    },
    {
        title: 'Project Proposal',
        href: '/myproposal/dashboard',
        icon: Archive,
        permission: 'proposals.view',
        children: [
            {
                title: 'Make a project Proposal',
                href: '/project/new-proposal',
                icon: FileCheck,
                permission: 'proposals.create',
            },
            {
                title: 'View Proposal',
                href: '/project/viewproposals',
                icon: FileText,
                permission: 'proposals.view',
            },
        ]
    }
   
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
    const handleClick = (e: React.MouseEvent<Element>, href: string) => {
        if (href.startsWith('/')) {
            e.preventDefault();
            router.visit(href, {
                preserveScroll: true,
                preserveState: true,
                replace: true
            });
        }
    };

    const currentPath = window.location.pathname;

    // Filter items by permission
    const filteredItems = items.filter(item => !item.permission || Can(item.permission)).map(item => {
        let children = item.children;
        if (children) {
            children = children.filter(child => !child.permission || Can(child.permission));
        }
        return { ...item, children };
    });

    return (
        <SidebarMenu>
            {filteredItems.map((item) => (
                <div key={item.title}>
                    <SidebarMenuItem>
                        {item.children && item.children.length > 0 ? (
                            <div className="flex items-center justify-between w-full cursor-pointer" onClick={() => toggleExpand(item.title)}>
                                <SidebarMenuButton>
                                    {item.icon && <item.icon className="mr-2" size={18} />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                                {expandedItems[item.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                        ) : (
                            <SidebarMenuButton asChild className={`${currentPath === item.href ? 'bg-muted' : ''}`}>
                                <Link href={item.href} onClick={(e) => handleClick(e, item.href)}>
                                    {item.icon && <item.icon className="mr-2" size={18} />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>

                    {/* Submenu Items */}
                    {item.children && expandedItems[item.title] && item.children.length > 0 && (
                        <div className="pl-6">
                            {item.children.map((child) => (
                                <SidebarMenuItem key={child.title}>
                                    <SidebarMenuButton asChild className={`${currentPath === child.href ? 'bg-muted' : ''}`}>
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

        // Auto-expand Acquisitions if we're on a curator route
        if (path.startsWith('/Curator')) {
            setExpandedItems((prev) => ({
                ...prev,
                'Acquisitions': true
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
