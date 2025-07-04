import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    MessageSquareText,
    UsersRound,
    Archive,
    Shield,
    Package,
} from 'lucide-react';
import AppLogo from './app-logo';
import { NavMain } from '@/components/nav-main';

const mainNavItems: NavItem[] = [
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
    },
     {
        title: 'Project Dashboard',
        href: '/project/all-projects',
        icon: LayoutGrid,
        permission: 'projects.view',
    },
    // {
    //     title: 'Maps',
    //     href: '/map',
    //     icon: Map,
    //     permission: 'maps.view',
    // },
    {
        title: 'Acquisitions',
        href: '/acquisitions',
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
    // {
    //     title: 'Logs',
    //     href: route('activity-logs.index'),
    //     icon: LogsIcon,
    //     permission: 'logs.view',
    // },
    {
        title: 'Archives',
        href: '/archives',
        icon: Archive,
        permission: 'archives.view',
    },
    {
        title: 'Project Proposal',
        href: '/project/viewproposals',
        icon: Archive,
        permission: 'proposals.view',
    },
    {
        title: 'Project Report',
        href: '/project/report',
        icon: Archive,
        permission: 'reports.view',
        // children: [
        //     {
        //         title: 'Upload your Project Report',
        //         href: '/project/new-report',
        //         icon: Folder,
        //         permission: 'reports.create',
        //     },
        //     {
        //         title: 'View Reports',
        //         href: '/project/report',
        //         icon: FileText,
        //         permission: 'reports.view',
        //     }
        // ]
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'AI Assistant',
        href: '/ai',
        icon: MessageSquareText,
        permission: 'ai.view',
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
