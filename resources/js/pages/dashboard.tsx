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
    Database
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
    const { flash, auth } = usePage().props as {
        flash?: { success?: string; error?: string },
        auth: { user: any }
    };

    // Mock data - replace with actual API calls
    const [stats, setStats] = useState({
        totalArtifacts: 1247,
        pendingDonations: 8,
        activeProjects: 12,
        recentAcquisitions: 23,
        totalUsers: 45,
        totalProjects: 28,
        totalReports: 156
    });

    const [recentProposals, setRecentProposals] = useState([
        { id: 1, title: "Ancient Pottery Fragment", donor: "John Doe", status: "pending", date: "2024-01-15" },
        { id: 2, title: "Traditional Beaded Necklace", donor: "Jane Smith", status: "under_review", date: "2024-01-14" },
        { id: 3, title: "Colonial Era Documents", donor: "Robert Johnson", status: "approved", date: "2024-01-13" }
    ]);

    const [activeProjects, setActiveProjects] = useState([
        { id: 1, title: "Conservation of Tribal Artifacts", progress: 75, team: 4, dueDate: "2024-03-15" },
        { id: 2, title: "Digital Archive Project", progress: 45, team: 6, dueDate: "2024-04-20" },
        { id: 3, title: "Exhibition Planning", progress: 90, team: 3, dueDate: "2024-02-28" }
    ]);

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

    // Get user's primary role for display
    const getUserRole = () => {
        if (auth.user?.roles?.length > 0) {
            return auth.user.roles[0].name;
        }
        return 'User';
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome back, {auth.user?.name}!</h1>
                        <p className="text-muted-foreground">
                            Here's what's happening at the National Museum today.
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {getUserRole()}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <AppLogoIcon className="h-8 w-8 text-primary" />
                        <span className="text-lg font-semibold text-primary">National Museum</span>
                    </div>
                </div>

                {/* Stats Cards - Permission-based */}
                <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Artifacts Stats - Show if user can view artifacts */}
                    {can('artifacts.view') && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Artifacts</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.totalArtifacts.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
                                </div>
                                <div className="rounded-full bg-primary/10 p-3">
                                    <Archive className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Acquisitions Stats - Show if user can view acquisitions */}
                    {can('acquisitions.view') && (
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
                    {can('projects.view') && (
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
                    {can('users.view') && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
                                </div>
                                <div className="rounded-full bg-purple-500/10 p-3">
                                    <UserCheck className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reports Stats - Show if user can view reports */}
                    {can('reports.view') && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.totalReports}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Research documents</p>
                                </div>
                                <div className="rounded-full bg-green-500/10 p-3">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Archives Stats - Show if user can view archives */}
                    {can('archives.view') && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Archives</p>
                                    <p className="text-3xl font-bold text-foreground">342</p>
                                    <p className="text-xs text-muted-foreground mt-1">Digital records</p>
                                </div>
                                <div className="rounded-full bg-indigo-500/10 p-3">
                                    <Database className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Acquisitions - Show if user can view acquisitions */}
                    {can('acquisitions.view') && (
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Recent Acquisitions</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.recentAcquisitions}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                                </div>
                                <div className="rounded-full bg-green-500/10 p-3">
                                    <Clock className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Donation Proposals - Show if user can view acquisitions */}
                    {can('acquisitions.view') && (
                        <div className="lg:col-span-2">
                            <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-foreground">Recent Donation Proposals</h2>
                                    <Link
                                        href={route('acquisitions.index')}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentProposals.map((proposal) => (
                                        <div key={proposal.id} className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/50">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-foreground">{proposal.title}</h3>
                                                <p className="text-sm text-muted-foreground">Donor: {proposal.donor}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(proposal.date).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                                                {proposal.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions - Permission-based */}
                    <div className="space-y-6">
                        <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                {/* Submit Donation - Show if user can create acquisitions */}
                                {can('acquisitions.create') && (
                                    <Link
                                        href={route('acquisitions.create')}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                                    >
                                        <Plus className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Submit Donation</span>
                                    </Link>
                                )}

                                {/* Create Project - Show if user can create proposals */}
                                {can('proposals.create') && (
                                    <Link
                                        href={route('projectproposal.new')}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                                    >
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Create Project</span>
                                    </Link>
                                )}

                                {/* Browse Collections - Show if user can view artifacts */}
                                {can('artifacts.view') && (
                                    <Link
                                        href={route('artifacts.index')}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                                    >
                                        <Eye className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Browse Collections</span>
                                    </Link>
                                )}

                                {/* Manage Acquisitions - Show if user can view acquisitions */}
                                {can('acquisitions.view') && (
                                    <Link
                                        href={route('acquisitions.index')}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                                    >
                                        <Settings className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Manage Acquisitions</span>
                                    </Link>
                                )}

                                {/* View Archives - Show if user can view archives */}
                                {can('archives.view') && (
                                    <Link
                                        href={route('archives.index')}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                                    >
                                        <Database className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">View Archives</span>
                                    </Link>
                                )}

                                {/* AI Assistant - Show if user can view AI */}
                                {can('ai.view') && (
                                    <Link
                                        href={route('ai')}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                                    >
                                        <Search className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">AI Assistant</span>
                                    </Link>
                                )}

                                {/* User Management - Show if user can view users */}
                                {can('users.view') && (
                                    <Link
                                        href={route('users.index')}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                                    >
                                        <UserCheck className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Manage Users</span>
                                    </Link>
                                )}

                                {/* Activity Logs - Show if user can view logs */}
                                {can('logs.view') && (
                                    <Link
                                        href={route('activity-logs.index')}
                                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                                    >
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Activity Logs</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Active Projects - Show if user can view projects */}
                        {can('projects.view') && (
                            <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-foreground mb-4">Active Projects</h2>
                                <div className="space-y-4">
                                    {activeProjects.map((project) => (
                                        <div key={project.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium text-foreground">{project.title}</h3>
                                                <span className="text-xs text-muted-foreground">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{project.team} team members</span>
                                                <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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
                            <p className="text-sm text-muted-foreground">Ancient Tribal Artifacts Collection</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-3 rounded-full bg-blue-500/10 p-3 w-fit">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">Upcoming Event</h3>
                            <p className="text-sm text-muted-foreground">Cultural Heritage Workshop - Feb 15</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-3 rounded-full bg-green-500/10 p-3 w-fit">
                                <MapPin className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">Location</h3>
                            <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
