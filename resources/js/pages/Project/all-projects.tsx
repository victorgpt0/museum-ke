import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';

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
  all_image_urls?: string[];
}

interface AllProjectsProps {
  projects: Project[];
}

const AllProjects: React.FC<AllProjectsProps> = ({ projects }) => {
  // Truncate text to 50 words
  const truncateText = (text: string, maxWords: number = 50) => {
    const words = text.split(' ');
    if (words.length <= maxWords) {
      return { text: text, truncated: false };
    }
    return {
      text: words.slice(0, maxWords).join(' ') + '...',
      truncated: true
    };
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AppLayout>
      <Head title="All Projects" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View and manage your project portfolio
            </p>
          </div>

          {/* Projects List */}
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
                <p className="text-gray-600 dark:text-gray-300">You have no projects yet.</p>
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/dashboard/${project.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h3>
                                             <div className="flex items-center gap-2 mb-1">
                         {project.completed ? (
                           <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                             Completed
                           </Badge>
                         ) : (
                           <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                             Ongoing
                           </Badge>
                         )}
                         <span className="text-sm text-gray-500 dark:text-gray-300">
                           Progress: {project.project_progress}%
                         </span>
                       </div>
                       <div className="text-sm text-gray-500 dark:text-gray-300">
                         Created by: <span className="font-medium text-gray-700 dark:text-gray-100">{project.creator_name || 'Unknown'}</span>
                       </div>
                    </div>
                                         <div className="text-right text-sm text-gray-500 dark:text-gray-300">
                       Created: {formatDate(project.created_at)}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Images */}
                    <div className="lg:col-span-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Project Images</h4>
                      {project.all_image_urls && project.all_image_urls.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {project.all_image_urls.slice(0, 4).map((image: string, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden">
                              <img
                                src={image || `https://placehold.co/600x400?text=Project`}
                                alt={`${project.title} - Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://placehold.co/600x400?text=Project';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                          No images uploaded
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Description</h4>
                        {(() => {
                          const { text, truncated } = truncateText(project.description);
                          return (
                            <div>
                                                             <p className="text-gray-600 dark:text-gray-200 text-sm leading-relaxed">
                                 {text}
                               </p>
                               {truncated && (
                                 <span className="mt-2 text-blue-600 dark:text-blue-300 text-sm font-medium">
                                   Read more →
                                 </span>
                               )}
                            </div>
                          );
                        })()}
                      </div>

                                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                             <h4 className="font-medium text-gray-900 dark:text-white mb-1">Duration</h4>
                             <p className="text-gray-600 dark:text-gray-200 text-sm">{project.duration || 'Not specified'}</p>
                           </div>
                           <div>
                             <h4 className="font-medium text-gray-900 dark:text-white mb-1">Milestones</h4>
                             <p className="text-gray-600 dark:text-gray-200 text-sm">{project.milestones_count}</p>
                           </div>
                           <div>
                             <h4 className="font-medium text-gray-900 dark:text-white mb-1">Goals</h4>
                             <p className="text-gray-600 dark:text-gray-200 text-sm">{project.completed_goals_count}/{project.goals_count} completed</p>
                           </div>
                         </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AllProjects;
