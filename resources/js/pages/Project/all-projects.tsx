import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

interface Project {
    id: number;
    title: string;
    description: string;
    duration: string;
    start_date: string;
    created_at: string;
    updated_at: string;
    milestones_count: number;
    goals_count: number;
    completed_goals_count: number;
    project_progress: number;
    status: string;
    completed: boolean;
    proposal?: any;
    creator_name?: string;
}

interface AllProjectsProps {
    projects: Project[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Dashboard',
        href: '/project/all-projects',
    },
];
const AllProjects: React.FC<AllProjectsProps> = ({ projects }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Projects" />
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className={`flex items-center justify-between`}>
                    <h1 className="mb-8 text-3xl font-bold">My Projects</h1>
                </div>
                {projects.length === 0 ? (
                    <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
                        <p className="text-gray-600 dark:text-gray-300">You have no projects yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/project/dashboard/${project.id}`}
                                className="block rounded-lg border border-gray-200 bg-white p-6 shadow transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h2>
                                    {project.completed ? <Badge variant="secondary">Completed</Badge> : <Badge variant="default">Ongoing</Badge>}
                                </div>
                                <p className="mb-2 text-gray-600 dark:text-gray-300">{project.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                                    <span>Progress: {project.project_progress}%</span>
                                    <span>Milestones: {project.milestones_count}</span>
                                    <span>Goals: {project.goals_count}</span>
                                    <span>Completed Goals: {project.completed_goals_count}</span>
                                    {project.creator_name && <span>Created by: {project.creator_name}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default AllProjects;
