import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { ArrowRight, BarChart3, Calendar, CheckCircle, Clock, FileText, FolderOpen, Plus, Star, Target, Users } from 'lucide-react';

interface Proposal {
    id: number;
    title: string;
    description: string;
    user_id: number;
    // Add other proposal fields as needed
}

interface Milestone {
    id: number;
    title: string;
    description: string;
    due_date: string;
    performance_indicator?: number;
    completion?: number;
    budgets?: any[]; // Assuming budgets are of type any[]
}

interface Goal {
    id: number;
    title: string;
    description: string;
    performance: number | null;
    comments: string | null;
    completed: boolean;
    milestone: {
        id: number;
        title: string;
    };
}

interface Project {
    id: number;
    title: string;
    description: string;
    duration: string;
    start_date: string;
    created_at: string;
    updated_at: string;
    proposal: Proposal;
    milestones: Milestone[];
    goals: Goal[];
    milestones_count: number;
    goals_count: number;
    completed_goals_count: number;
    project_progress: number;
    findings: any[]; // Assuming findings are of type any[]
    findings_count?: number;
    team_members_count: number;
    team_members: any[]; // Assuming team_members are of type any[]
    completed: boolean;
    creator_name?: string;
}

interface ProjectDashboardProps {
    project: Project | null;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project }) => {
    const [showAddMember, setShowAddMember] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        position: '',
        phone_number: '',
    });

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;
        try {
            const response = await fetch(`/projects/${project.id}/team-members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    fullname: data.name,
                    email_address: data.email,
                    position: data.position,
                    phone_number: data.phone_number || '',
                }),
            });
            if (response.ok) {
                toast.success('Team member added successfully!');
                reset();
                setShowAddMember(false);
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    Object.values(errorData.errors).forEach((msg: any) => toast.error(String(msg)));
                } else {
                    toast.error('Failed to add team member.');
                }
            }
        } catch (err) {
            toast.error('An error occurred while saving the team member.');
        }
    };

    // Handler for marking project as complete
    const handleMarkComplete = () => {
        if (!project) return;
        router.post(
            `/project/${project.id}/complete`,
            {},
            {
                onSuccess: () => {
                    toast.success('Project marked as complete!');
                    setTimeout(() => window.location.reload(), 1000);
                },
                onError: () => {
                    toast.error('Failed to mark project as complete.');
                },
            },
        );
    };

    const handleDownloadPDF = async () => {
        if (!project) return;
        const doc = new jsPDF();
        let y = 10;

        // Project Info
        doc.setFontSize(18);
        doc.text(project.title, 10, y);
        y += 8;
        if (project.creator_name) {
            doc.text(`Created by: ${project.creator_name}`, 10, y);
            y += 8;
        }
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(`Description: ${project.description}`, 180), 10, y);
        y += 8 + Math.ceil(doc.getTextDimensions(doc.splitTextToSize(`Description: ${project.description}`, 180)).h);
        doc.text(`Duration: ${project.duration}`, 10, y);
        y += 8;
        doc.text(`Start Date: ${new Date(project.start_date).toLocaleDateString()}`, 10, y);
        y += 8;
        doc.text(`Proposal: ${project.proposal.title}`, 10, y);
        y += 8;
        doc.text(doc.splitTextToSize(`Proposal Description: ${project.proposal.description}`, 180), 10, y);
        y += 12 + Math.ceil(doc.getTextDimensions(doc.splitTextToSize(`Proposal Description: ${project.proposal.description}`, 180)).h);

        // Team Members
        doc.setFontSize(14);
        doc.text('Team Members', 10, y);
        y += 4;
        autoTable(doc, {
            startY: y,
            head: [['Name', 'Email', 'Position', 'Phone']],
            body: (project.team_members || []).map((m: any) => [m.fullname, m.email_address, m.position, m.phone_number]),
            theme: 'grid',
            styles: { fontSize: 10, cellWidth: 'wrap' },
            columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 50 }, 2: { cellWidth: 40 }, 3: { cellWidth: 40 } },
        });
        y = (doc as any).lastAutoTable.finalY + 8;

        // Milestones
        doc.setFontSize(14);
        doc.text('Milestones', 10, y);
        y += 4;
        autoTable(doc, {
            startY: y,
            head: [['Title', 'Description', 'Due Date', 'Performance', 'Completion']],
            body: (project.milestones || []).map((m: any) => [
                m.title,
                m.description,
                m.due_date ? new Date(m.due_date).toLocaleDateString() : '',
                m.performance_indicator || '',
                m.completion ? m.completion * 10 + '%' : '',
            ]),
            theme: 'grid',
            styles: { fontSize: 10, cellWidth: 'wrap' },
            columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 60 }, 2: { cellWidth: 30 }, 3: { cellWidth: 25 }, 4: { cellWidth: 25 } },
        });
        y = (doc as any).lastAutoTable.finalY + 8;

        // Budget Items
        doc.setFontSize(14);
        doc.text('Budget Items', 10, y);
        y += 4;

        // Collect all budget items from all milestones
        const allBudgetItems: any[] = [];
        (project.milestones || []).forEach((milestone: any) => {
            if (milestone.budgets && milestone.budgets.length > 0) {
                milestone.budgets.forEach((budget: any) => {
                    allBudgetItems.push([
                        budget.title,
                        budget.description,
                        `Ksh ${budget.amount}`,
                        budget.amount_spent > 0 ? `Ksh ${budget.amount_spent}` : 'Ksh 0',
                        milestone.title,
                    ]);
                });
            }
        });

        if (allBudgetItems.length > 0) {
            autoTable(doc, {
                startY: y,
                head: [['Title', 'Description', 'Budgeted Amount', 'Amount Spent', 'Milestone']],
                body: allBudgetItems,
                theme: 'grid',
                styles: { fontSize: 10, cellWidth: 'wrap' },
                columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 50 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 }, 4: { cellWidth: 30 } },
            });
            y = (doc as any).lastAutoTable.finalY + 8;
        } else {
            doc.setFontSize(10);
            doc.text('No budget items recorded.', 10, y);
            y += 6;
        }

        // Goals
        doc.setFontSize(14);
        doc.text('Goals', 10, y);
        y += 4;
        autoTable(doc, {
            startY: y,
            head: [['Title', 'Description', 'Performance', 'Comments', 'Completed', 'Milestone']],
            body: (project.goals || []).map((g: any) => [
                g.title,
                g.description,
                g.performance !== null ? g.performance * 10 + '%' : '',
                g.comments || '',
                g.completed ? 'Yes' : 'No',
                g.milestone?.title || '',
            ]),
            theme: 'grid',
            styles: { fontSize: 10, cellWidth: 'wrap' },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 60 },
                2: { cellWidth: 25 },
                3: { cellWidth: 30 },
                4: { cellWidth: 20 },
                5: { cellWidth: 30 },
            },
        });
        y = (doc as any).lastAutoTable.finalY + 8;

        // Findings
        doc.setFontSize(14);
        doc.text('Findings', 10, y);
        y += 6;
        if (project.findings && project.findings.length > 0) {
            for (const f of project.findings) {
                // Title
                doc.setFontSize(12);
                doc.text(f.title, 10, y);
                y += 6;
                // Description
                const descLines = doc.splitTextToSize(f.description || '', 180);
                doc.setFontSize(10);
                doc.text(descLines, 10, y);
                y += descLines.length * 5 + 2;
                // Documents
                if (f.all_documents_urls && f.all_documents_urls.length > 0) {
                    doc.setFontSize(10);
                    doc.text('Documents: ' + f.all_documents_urls.map((d: any) => d.file_name || d.name).join(', '), 10, y);
                    y += 6;
                }
                // Images
                if (f.all_image_urls && f.all_image_urls.length > 0) {
                    doc.setFontSize(10);
                    doc.text('Images:', 10, y);
                    y += 4;
                    for (const imgUrl of f.all_image_urls) {
                        try {
                            // Fetch image and convert to base64
                            const imgData = await fetch(imgUrl)
                                .then((res) => res.blob())
                                .then(
                                    (blob) =>
                                        new Promise<string>((resolve, reject) => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => resolve(reader.result as string);
                                            reader.onerror = reject;
                                            reader.readAsDataURL(blob);
                                        }),
                                );
                            // Add image as a medium thumbnail (100x100 px)
                            doc.addImage(imgData, 'JPEG', 10, y, 30, 30, undefined, 'FAST');
                            y += 32;
                            // If near bottom, add new page
                            if (y > 260) {
                                doc.addPage();
                                y = 10;
                            }
                        } catch (e) {
                            doc.text('[Image could not be loaded]', 10, y);
                            y += 6;
                        }
                    }
                }
                y += 6;
                // If near bottom, add new page
                if (y > 260) {
                    doc.addPage();
                    y = 10;
                }
            }
        } else {
            doc.setFontSize(10);
            doc.text('No findings recorded.', 10, y);
            y += 6;
        }

        doc.save(`${project.title.replace(/[^a-z0-9]/gi, '_')}_details.pdf`);
    };

    const MetricCard = ({
        title,
        value,
        icon: Icon,
        color,
        actionText,
        actionLink,
        isEmpty = false,
    }: {
        title: string;
        value: string | number;
        icon: any;
        color: string;
        actionText: string;
        actionLink: string;
        isEmpty?: boolean;
    }) => (
        <div className={`rounded-lg border-l-4 bg-white p-6 shadow-md dark:bg-gray-800 ${color} border border-gray-200 dark:border-gray-700`}>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            {isEmpty && (
                <Link
                    href={actionLink}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    {actionText}
                    <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            )}
        </div>
    );

    const EmptyState = ({
        icon: Icon,
        title,
        description,
        actionText,
        actionLink,
    }: {
        icon: any;
        title: string;
        description: string;
        actionText: string;
        actionLink: string;
    }) => (
        <div className="py-8 text-center">
            <Icon className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>
            <Link
                href={actionLink}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
                <Plus className="mr-2 h-4 w-4" />
                {actionText}
            </Link>
        </div>
    );

    // Show message if no project found
    if (!project) {
        return (
            <>
                <Head title="Project Dashboard" />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white p-8 shadow-md">
                            <EmptyState
                                icon={FolderOpen}
                                title="No Project Found"
                                description="You don't have any active projects yet. Create a proposal to get started."
                                actionText="Create Proposal"
                                actionLink="/proposals/create"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <AppLayout>
            <Head title={`${project.title} - Dashboard`} />

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

            <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Project Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
                                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        Started: {new Date(project.start_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-1 h-4 w-4" />
                                        Duration: {project.duration}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    type="button"
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Download Project PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Milestones"
                            value={project.milestones_count || 0}
                            icon={Target}
                            color="border-green-500"
                            actionText="Add Milestones"
                            actionLink={`/projects/${project.id}/addmilestone`}
                            isEmpty={!project.milestones_count || project.milestones_count === 0}
                        />
                        <MetricCard
                            title="Goals"
                            value={project.goals_count || 0}
                            icon={BarChart3}
                            color="border-blue-500"
                            actionText="Set Goals"
                            actionLink={`/projects/${project.id}/goals`}
                            isEmpty={!project.goals_count || project.goals_count === 0}
                        />
                        <MetricCard
                            title="Findings"
                            value={project.findings_count || 0}
                            icon={FileText}
                            color="border-purple-500"
                            actionText="Add Findings"
                            actionLink={`/projects/${project.id}/findings/create`}
                            isEmpty={!project.findings_count || project.findings_count === 0}
                        />
                        <MetricCard
                            title="Team Members"
                            value={project.team_members_count || 0}
                            icon={Users}
                            color="border-orange-500"
                            actionText="Add Team"
                            actionLink={`/projects/${project.id}/team-members/create`}
                            isEmpty={!project.team_members_count || project.team_members_count === 0}
                        />
                    </div>

                    {/* Progress Overview */}
                    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Project Progress</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Completion</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.project_progress}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-2 rounded-full bg-green-500 transition-all duration-300"
                                        style={{ width: `${project.project_progress}%` }}
                                    ></div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {project.completed_goals_count} of {project.goals_count} goals completed
                                    {project.goals_count === 0 && ' - Set up goals and milestones to track progress'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Team Members Section */}
                        <div
                            id="team-section"
                            className="max-h-100 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h3>
                                <Link
                                    href={`/projects/${project.id}/team-members/create`}
                                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                    style={project.completed ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                    tabIndex={project.completed ? -1 : 0}
                                    aria-disabled={project.completed}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Link>
                            </div>

                            {!project.team_members || project.team_members.length === 0 ? (
                                <EmptyState
                                    icon={Users}
                                    title="No Team Members Yet"
                                    description="Add team members to collaborate on this project"
                                    actionText="Add First Member"
                                    actionLink={`/projects/${project.id}/team-members/create`}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {project.team_members.map((member: any) => (
                                        <div
                                            key={member.id}
                                            className="rounded-lg border border-blue-200 bg-blue-50 p-4 transition-shadow hover:shadow-sm dark:border-blue-700 dark:bg-blue-900/20"
                                        >
                                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{member.fullname}</h4>
                                                    <div className="mb-1 text-sm text-gray-600 dark:text-gray-300">{member.position}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Email: {member.email_address}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Phone: {member.phone_number}</div>
                                                </div>
                                                <span className="mt-1 ml-4 text-xs text-gray-400 dark:text-gray-500">
                                                    {member.created_at ? new Date(member.created_at).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Milestones Section */}
                        <div className="max-h-100 overflow-x-auto rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Milestones</h3>
                                <Link
                                    href={`/projects/${project.id}/milestones/create`}
                                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                    style={project.completed ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                    tabIndex={project.completed ? -1 : 0}
                                    aria-disabled={project.completed}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Milestone
                                </Link>
                            </div>

                            {project.milestones.length === 0 ? (
                                <EmptyState
                                    icon={Target}
                                    title="No Milestones Set"
                                    description="Break down your project into manageable milestones"
                                    actionText="Create Milestone"
                                    actionLink={`/projects/${project.id}/milestones/create`}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {project.milestones.map((milestone) => (
                                        <div
                                            key={milestone.id}
                                            className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-sm dark:border-gray-600 dark:bg-gray-700"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{milestone.title}</h4>
                                                    {milestone.description && (
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{milestone.description}</p>
                                                    )}
                                                </div>
                                                {milestone.due_date && (
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <Calendar className="mr-1 h-4 w-4" />
                                                        {new Date(milestone.due_date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Additional milestone details */}
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    {milestone.performance_indicator && (
                                                        <div className="flex items-center text-sm">
                                                            <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                                            <span className="text-gray-700 dark:text-gray-300">
                                                                {milestone.performance_indicator}/10
                                                            </span>
                                                        </div>
                                                    )}
                                                    {milestone.completion && (
                                                        <div className="flex items-center text-sm">
                                                            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                                            <span className="text-gray-700 dark:text-gray-300">
                                                                {milestone.completion * 10}% complete
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <Link
                                                    href={`/projects/${project.id}/milestones/${milestone.id}`}
                                                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                    style={project.completed ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                                    tabIndex={project.completed ? -1 : 0}
                                                    aria-disabled={project.completed}
                                                >
                                                    View Details
                                                </Link>
                                            </div>

                                            {/* Budget Information */}
                                            {milestone.budgets && milestone.budgets.length > 0 && (
                                                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-600">
                                                    <h5 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget Items:</h5>
                                                    <div className="space-y-2">
                                                        {milestone.budgets.map((budget: any) => (
                                                            <div
                                                                key={budget.id}
                                                                className="flex items-center justify-between rounded bg-white p-2 text-sm dark:bg-gray-600"
                                                            >
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-white">{budget.title}</p>
                                                                    <p className="text-gray-600 dark:text-gray-300">{budget.description}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-medium text-green-600 dark:text-green-400">
                                                                        Ksh {budget.amount}
                                                                    </p>
                                                                    {budget.amount_spent > 0 && (
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            Spent: Ksh {budget.amount_spent}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals</h3>
                            <Link
                                href={`/projects/${project.id}/goals`}
                                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                style={project.completed ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                tabIndex={project.completed ? -1 : 0}
                                aria-disabled={project.completed}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Goal
                            </Link>
                        </div>

                        {!project.goals || project.goals.length === 0 ? (
                            <EmptyState
                                icon={BarChart3}
                                title="No Goals Defined"
                                description="Set specific goals to track your project's success"
                                actionText="Define Goals"
                                actionLink={`/projects/${project.id}/goals`}
                            />
                        ) : (
                            <div className="space-y-4">
                                {project.goals
                                    .sort((a, b) => {
                                        // Sort completed goals first, then by performance (descending)
                                        if (a.completed !== b.completed) {
                                            return a.completed ? -1 : 1;
                                        }
                                        return (b.performance || 0) - (a.performance || 0);
                                    })
                                    .map((goal) => (
                                        <div
                                            key={goal.id}
                                            className={`rounded-lg border p-4 transition-shadow hover:shadow-sm ${
                                                goal.completed
                                                    ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                                                    : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                                                        {goal.completed && (
                                                            <Badge variant="default" className="bg-green-600 text-xs text-white">
                                                                Completed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {goal.description && (
                                                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
                                                    )}
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <Target className="mr-1 h-4 w-4" />
                                                        <span>Milestone: {goal.milestone.title}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    {goal.performance !== null && (
                                                        <div className="flex items-center text-sm">
                                                            <BarChart3 className="mr-1 h-4 w-4 text-blue-500" />
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                {goal.performance * 10}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {goal.completed && (
                                                        <div className="flex items-center text-sm">
                                                            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                                            <span className="text-gray-700 dark:text-gray-300">Completed</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {goal.comments && (
                                                <div className="mt-3 rounded-md bg-gray-50 p-3 dark:bg-gray-600">
                                                    <p className="text-sm text-gray-700 dark:text-gray-200">{goal.comments}</p>
                                                </div>
                                            )}

                                            <div className="mt-3 flex justify-end">
                                                <Link
                                                    href={`/projects/${project.id}/milestones/${goal.milestone.id}`}
                                                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                    style={project.completed ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                                    tabIndex={project.completed ? -1 : 0}
                                                    aria-disabled={project.completed}
                                                >
                                                    View Milestone
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Findings Section */}
                    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Findings</h3>
                            <Link
                                href={`/projects/${project.id}/findings/create`}
                                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                style={project.completed ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                tabIndex={project.completed ? -1 : 0}
                                aria-disabled={project.completed}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Finding
                            </Link>
                        </div>

                        {!project.findings || project.findings.length === 0 ? (
                            <EmptyState
                                icon={FileText}
                                title="No Findings Recorded"
                                description="Document important discoveries and insights from your project"
                                actionText="Record Finding"
                                actionLink={`/projects/${project.id}/findings/create`}
                            />
                        ) : (
                            <div className="space-y-4">
                                {project.findings.map((finding: any) => (
                                    <div
                                        key={finding.id}
                                        className="rounded-lg border border-purple-200 bg-purple-50 p-4 transition-shadow hover:shadow-sm dark:border-purple-700 dark:bg-purple-900/20"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{finding.title}</h4>
                                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{finding.description}</p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {finding.all_documents_urls &&
                                                        finding.all_documents_urls.length > 0 &&
                                                        finding.all_documents_urls.map((doc: any, idx: number) => (
                                                            <a
                                                                key={'doc-' + idx}
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-blue-900"
                                                                download
                                                            >
                                                                <FileText className="mr-1 h-4 w-4 text-blue-500" />
                                                                <span className="max-w-xs truncate">{doc.file_name || doc.name}</span>
                                                            </a>
                                                        ))}
                                                    {finding.all_image_urls &&
                                                        finding.all_image_urls.length > 0 &&
                                                        finding.all_image_urls.map((imgUrl: string, idx: number) => {
                                                            // Try to extract filename from URL
                                                            const fileName = imgUrl.split('/').pop()?.split('?')[0] || `image_${idx + 1}`;
                                                            return (
                                                                <a
                                                                    key={'img-' + idx}
                                                                    href={imgUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-50 dark:border-gray-600 dark:bg-gray-800 dark:text-green-300 dark:hover:bg-green-900"
                                                                    download
                                                                >
                                                                    <img
                                                                        src={imgUrl}
                                                                        alt="Finding Image"
                                                                        className="mr-1 h-4 w-4 rounded object-cover"
                                                                        style={{ minWidth: '1rem' }}
                                                                    />
                                                                    <span className="max-w-xs truncate">{fileName}</span>
                                                                </a>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                            <span className="mt-1 ml-4 text-xs text-gray-400 dark:text-gray-500">
                                                {finding.created_at ? new Date(finding.created_at).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Project Information */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Project Information</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Project Details</h4>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Title</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Description</dt>
                                        <dd className="text-sm text-gray-900 dark:text-gray-100">{project.description}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Duration</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{project.duration}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Start Date</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{new Date(project.start_date).toLocaleDateString()}</dd>
                                    </div>
                                    {project.creator_name && (
                                        <div>
                                            <dt className="text-sm text-gray-500 dark:text-gray-400">Created By</dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">{project.creator_name}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Related Proposal</h4>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Proposal Title</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{project.proposal.title}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Proposal Description</dt>
                                        <dd className="text-sm text-gray-900 dark:text-gray-100">{project.proposal.description}</dd>
                                    </div>
                                    <div className="pt-4">
                                        <Link
                                            href={`/proposals/${project.proposal.id}`}
                                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            View Original Proposal
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mark Project as Complete Button */}
            {!project.completed && (
                <button
                    onClick={handleMarkComplete}
                    className="mr-2 inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                    type="button"
                >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Project as Complete
                </button>
            )}
            {project.completed && (
                <Badge variant="secondary" className="ml-2">
                    Completed
                </Badge>
            )}
        </AppLayout>
    );
};

export default ProjectDashboard;
