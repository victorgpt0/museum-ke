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
  proposal?: {
    id: number;
    title: string;
    description: string;
    user_id: number;
    user_name?: string;
    all_image_urls?: string[];
    all_documents_urls?: string[];
  };
  creator_name?: string;
  all_image_urls?: string[];
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
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Projects" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
            <p className="mt-2 text-muted-foreground">
              View and manage your project portfolio
            </p>
          </div>

          {/* Projects List */}
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="museum-gradient rounded-xl border border-border p-8 shadow-sm text-center">
                <p className="text-muted-foreground">You have no projects yet.</p>
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/dashboard/${project.id}`}
                  className="block museum-gradient rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
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
                         <span className="text-sm text-muted-foreground">
                           Progress: {project.project_progress}%
                         </span>
                       </div>
                       <div className="text-sm text-muted-foreground">
                         Created by: <span className="font-medium text-foreground">{project.creator_name || 'Unknown'}</span>
                       </div>
                    </div>
                                         <div className="text-right text-sm text-muted-foreground">
                       Created: {formatDate(project.created_at)}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Images */}
                    <div className="lg:col-span-1">
                      <h4 className="font-medium text-foreground mb-2">Project Images</h4>
                      {(() => {
                        // Priority: 1. Project images, 2. Proposal images, 3. Placeholder
                        const projectImages = project.all_image_urls || [];
                        const proposalImages = project.proposal?.all_image_urls || [];
                        const allImages = [...projectImages, ...proposalImages];
                        
                        if (allImages.length > 0) {
                          return (
                            <div className="grid grid-cols-2 gap-2">
                              {allImages.slice(0, 4).map((image: string, index) => (
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
                          );
                        } else {
                          return (
                            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                              No images uploaded
                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Description</h4>
                        {(() => {
                          const { text, truncated } = truncateText(project.description);
                          return (
                            <div>
                                                             <p className="text-muted-foreground text-sm leading-relaxed">
                                 {text}
                               </p>
                               {truncated && (
                                 <span className="mt-2 text-primary text-sm font-medium">
                                   Read more →
                                 </span>
                               )}
                            </div>
                          );
                        })()}
                      </div>

                                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                             <h4 className="font-medium text-foreground mb-1">Duration</h4>
                             <p className="text-muted-foreground text-sm">{project.duration || 'Not specified'}</p>
                           </div>
                           <div>
                             <h4 className="font-medium text-foreground mb-1">Milestones</h4>
                             <p className="text-muted-foreground text-sm">{project.milestones_count}</p>
                           </div>
                           <div>
                             <h4 className="font-medium text-foreground mb-1">Goals</h4>
                             <p className="text-muted-foreground text-sm">{project.completed_goals_count}/{project.goals_count} completed</p>
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
