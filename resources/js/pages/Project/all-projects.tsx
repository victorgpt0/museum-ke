import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';

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
    }
]
const AllProjects: React.FC<AllProjectsProps> = ({ projects }) => {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Projects" />
      <div className="max-w-5xl mx-auto py-10 px-4">
          <div className={`flex items-center justify-between`}>
        <h1 className="text-3xl font-bold mb-8">My Projects</h1>
          </div>
        {projects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 dark:text-gray-300">You have no projects yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/dashboard/${project.id}`}
                className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h2>
                  {project.completed ? (
                    <Badge variant="secondary">Completed</Badge>
                  ) : (
                    <Badge variant="default">Ongoing</Badge>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                  <span>Progress: {project.project_progress}%</span>
                  <span>Milestones: {project.milestones_count}</span>
                  <span>Goals: {project.goals_count}</span>
                  <span>Completed Goals: {project.completed_goals_count}</span>
                  {project.creator_name && (
                    <span>Created by: {project.creator_name}</span>
                  )}
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
