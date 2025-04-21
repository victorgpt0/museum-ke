import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Map, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import AppLogo from './app-logo';
import { useState } from 'react';

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
                title: 'New Artifact',
                href: '/dashboard/new-artifact',
                icon: Plus,
            },
            {
                title: 'Maps',
                href: '/dashboard/maps',
                icon: Map,
            }
        ]
    },
    {
        title: 'welcome',
        href: '/',
        icon: LayoutGrid,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

// Create a new NavMainWithDropdowns component
function NavMainWithDropdowns({ items }: { items: ExtendedNavItem[] }) {
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

    const toggleExpand = (title: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [title]: !prev[title]
        }));
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
                                <Link href={item.href} prefetch>
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
                                        <Link href={child.href} prefetch>
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
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
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