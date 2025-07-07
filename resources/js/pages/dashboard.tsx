import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
    LampWallUp,
    Gift,
    Clock,
    TrendingUp,
    FileText,
    Users,
    Calendar,
    AlertTriangle,
    Plus,
    Eye,
    Settings,
    BarChart3,
    Star,
    MapPin,
    Archive,
    UserCheck,
    Shield,
    BookOpen,
    Search,
    Database, Landmark, Package, UserPlus, FolderOpen
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import can from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const pageProps = usePage().props as any;
    const { flash, auth, stats, recentActivities, quickActions, recentArtifacts, recentAcquisitions, activeProjects, pendingProposals, upcomingMilestones, recentFindings, budgetOverview, userRole } = pageProps;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
            case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
            case 'under_review': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-400';
        }
    };

    const getIconComponent = (iconName: string) => {
        const icons: { [key: string]: any } = {
            'Plus': Plus,
            'FileText': FileText,
            'FolderOpen': FolderOpen,
            'Package': Package,
            'UserPlus': UserPlus,
            'Archive': Archive,
            'Gift': Gift,
            'TrendingUp': TrendingUp,
            'Users': Users,
            'BarChart3': BarChart3,
            'Calendar': Calendar,
            'Eye': Eye,
            'Search': Search,
            'Database': Database,
            'BookOpen': BookOpen,
            'Shield': Shield,
            'UserCheck': UserCheck,
            'MapPin': MapPin,
            'Star': Star,
            'Settings': Settings,
            'AlertTriangle': AlertTriangle,
            'Clock': Clock,
            'LampWallUp': LampWallUp,
        };
        return icons[iconName] || Plus;
    };

    const getColorClasses = (color: string) => {
        const colors: { [key: string]: string } = {
            'blue': 'bg-blue-500/10 text-blue-600',
            'green': 'bg-green-500/10 text-green-600',
            'purple': 'bg-purple-500/10 text-purple-600',
            'orange': 'bg-orange-500/10 text-orange-600',
            'indigo': 'bg-indigo-500/10 text-indigo-600',
            'red': 'bg-red-500/10 text-red-600',
            'yellow': 'bg-yellow-500/10 text-yellow-600',
        };
        return colors[color] || 'bg-primary/10 text-primary';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        padding: '12px 16px',
                    },
                    success: {
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                        },
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: '#f0fdf4',
                        },
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                        },
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#fef2f2',
                        },
                    },
                    loading: {
                        style: {
                            background: '#eff6ff',
                            color: '#1e40af',
                            border: '1px solid #bfdbfe',
                        },
                    },
                }}
            />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back, {auth.user?.name}!</h1>
                        <p className="text-muted-foreground">
                            Here's what's happening at the National Museum today.
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {userRole}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Landmark className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        <span className="text-base sm:text-lg font-semibold text-primary">National Museum</span>
                    </div>
                </div>

                {/* Stats Cards - Permission-based with flexible grid */}
                <div className="grid gap-4 sm:gap-6 auto-rows-fr" style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                }}>
                    {/* Artifacts Stats - Show if user can view artifacts */}
                    {can('artifacts.view') && stats?.totalArtifacts !== undefined && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Artifacts</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.totalArtifacts.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        +{stats.artifactsThisMonth || 0} this month
                                    </p>
                                </div>
                                <div className="rounded-full bg-primary/10 p-3">
                                    <Archive className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Acquisitions Stats - Show if user can view acquisitions */}
                    {can('acquisitions.view') && stats?.pendingDonations !== undefined && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pending Donations</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.pendingDonations}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
                                </div>
                                <div className="rounded-full bg-yellow-500/10 p-3">
                                    <Gift className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Projects Stats - Show if user can view projects */}
                    {can('projects.view') && stats?.activeProjects !== undefined && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.activeProjects}</p>
                                    <p className="text-xs text-muted-foreground mt-1">In progress</p>
                                </div>
                                <div className="rounded-full bg-blue-500/10 p-3">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Stats - Show if user can view users */}
                    {can('users.view') && stats?.totalUsers !== undefined && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stats.activeUsers || 0} active this month
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-500/10 p-3">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Archives Stats - Show if user can view archives */}
                    {can('archives.view') && stats?.totalArchives !== undefined && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Archives</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.totalArchives}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        +{stats.archivesThisMonth || 0} this month
                                    </p>
                                </div>
                                <div className="rounded-full bg-purple-500/10 p-3">
                                    <Database className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Proposals Stats - Show if user can view proposals */}
                    {can('proposals.view') && stats?.pendingProposals !== undefined && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pending Proposals</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.pendingProposals}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                                </div>
                                <div className="rounded-full bg-indigo-500/10 p-3">
                                    <FileText className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Grid - Flexible layout based on available content */}
                <div className="grid gap-4 sm:gap-6" style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
                }}>
                    {/* Quick Actions */}
                    {quickActions && quickActions.length > 0 && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                            <div className="grid gap-3">
                                {quickActions.map((action: any, index: number) => {
                                    const IconComponent = getIconComponent(action.icon);
                                    return (
                                        <Link
                                            key={index}
                                            href={action.route}
                                            className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className={`rounded-full p-2 ${getColorClasses(action.color)}`}>
                                                <IconComponent className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-foreground">{action.title}</h3>
                                                <p className="text-sm text-muted-foreground">{action.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Recent Artifacts */}
                    {can('artifacts.view') && recentArtifacts && recentArtifacts.length > 0 && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Recent Artifacts</h2>
                                <Link href="/artifacts" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentArtifacts.map((artifact: any) => (
                                    <Link
                                        key={artifact.id}
                                        href={artifact.route}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <Archive className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">{artifact.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {artifact.category} • {artifact.condition}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{artifact.created_at}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Acquisitions */}
                    {can('acquisitions.view') && recentAcquisitions && recentAcquisitions.length > 0 && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Recent Acquisitions</h2>
                                <Link href="/acquisitions" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentAcquisitions.map((acquisition: any) => (
                                    <Link
                                        key={acquisition.id}
                                        href={acquisition.route}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="rounded-full bg-yellow-500/10 p-2">
                                            <Gift className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">{acquisition.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {acquisition.donor} • {acquisition.status}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{acquisition.created_at}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Projects */}
                    {can('projects.view') && activeProjects && activeProjects.length > 0 && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Active Projects</h2>
                                <Link href="/project/all-projects" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {activeProjects.map((project: any) => (
                                    <Link
                                        key={project.id}
                                        href={project.route}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="rounded-full bg-blue-500/10 p-2">
                                            <TrendingUp className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">{project.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {project.progress}% complete • {project.team_count} members
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{project.created_at}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Proposals */}
                    {can('proposals.view') && pendingProposals && pendingProposals.length > 0 && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Pending Proposals</h2>
                                <Link href="/project/viewproposals" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {pendingProposals.map((proposal: any) => (
                                    <Link
                                        key={proposal.id}
                                        href={proposal.route}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="rounded-full bg-indigo-500/10 p-2">
                                            <FileText className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">{proposal.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Proposed by {proposal.proposer}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{proposal.created_at}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Milestones */}
                    {can('projects.view') && upcomingMilestones && upcomingMilestones.length > 0 && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Upcoming Milestones</h2>
                                <Link href="/project/all-projects" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {upcomingMilestones.map((milestone: any) => (
                                    <Link
                                        key={milestone.id}
                                        href={milestone.route}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="rounded-full bg-orange-500/10 p-2">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">{milestone.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {milestone.project} • Due {milestone.due_date}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {milestone.days_remaining > 0 ? `${milestone.days_remaining}d left` : 'Due today'}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Findings */}
                    {can('projects.view') && recentFindings && recentFindings.length > 0 && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Recent Findings</h2>
                                <Link href="/project/all-projects" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentFindings.map((finding: any) => (
                                    <Link
                                        key={finding.id}
                                        href={finding.route}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="rounded-full bg-green-500/10 p-2">
                                            <Search className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">{finding.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {finding.project}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{finding.created_at}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Activities */}
                    {can('logs.view') && recentActivities && recentActivities.length > 0 && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Recent Activities</h2>
                                <Link href="/activity-logs" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentActivities.map((activity: any) => (
                                    <div key={activity.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                                        <div className="rounded-full bg-gray-500/10 p-2">
                                            <Clock className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-foreground">{activity.description}</p>
                                            <p className="text-xs text-muted-foreground">
                                                by {activity.causer_name} • {activity.created_at}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Budget Overview */}
                    {can('projects.view') && budgetOverview && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Budget Overview</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Budget</span>
                                    <span className="font-semibold text-foreground">
                                        Ksh {budgetOverview.total_budget?.toLocaleString() || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Spent</span>
                                    <span className="font-semibold text-foreground">
                                        Ksh {budgetOverview.total_spent?.toLocaleString() || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Remaining</span>
                                    <span className="font-semibold text-foreground">
                                        Ksh {budgetOverview.remaining_budget?.toLocaleString() || 0}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full" 
                                        style={{ width: `${budgetOverview.spent_percentage || 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    {budgetOverview.spent_percentage || 0}% of budget used
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Museum Highlights - Show for all users */}
                <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Museum Highlights</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-3 rounded-full bg-primary/10 p-3 w-fit">
                                <Star className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">Featured Exhibit</h3>
                            <p className="text-sm text-muted-foreground">Discover our latest curated collection</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-3 rounded-full bg-green-500/10 p-3 w-fit">
                                <BookOpen className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">Research Hub</h3>
                            <p className="text-sm text-muted-foreground">Access our extensive research resources</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-3 rounded-full bg-purple-500/10 p-3 w-fit">
                                <MapPin className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">Visit Us</h3>
                            <p className="text-sm text-muted-foreground">Plan your visit to the National Museum</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
