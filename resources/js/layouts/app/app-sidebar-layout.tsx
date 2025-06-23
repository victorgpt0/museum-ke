import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { AppSidebarFooter } from '@/components/app-sidebar-footer';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="flex flex-col min-h-screen">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className={`flex-1`}>
                    {children}
                </main>
                <AppSidebarFooter/>
            </AppContent>
        </AppShell>
    );
}
