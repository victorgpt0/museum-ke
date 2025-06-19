import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

import { 
  Calendar, 
  Users, 
  Target, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Edit,
  Trash2,
  FileText,
  BarChart3,
  Settings,
  ArrowRight,
  FolderOpen
} from 'lucide-react';

interface Proposal {
  id: number;
  title: string;
  description: string;
  user_id: number;
  // Add other proposal fields as needed
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
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    // post('/team-members', {
    //   onSuccess: () => {
    //     reset();
    //     setShowAddMember(false);
    //   }
    // });
    console.log('Adding member:', data);
    reset();
    setShowAddMember(false);
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    actionText,
    actionLink,
    isEmpty = false
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string; 
    actionText: string;
    actionLink: string;
    isEmpty?: boolean;
  }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      {isEmpty && (
        <Link
          href={actionLink}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {actionText}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  );

  const EmptyState = ({ 
    icon: Icon, 
    title, 
    description, 
    actionText, 
    actionLink 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    actionText: string; 
    actionLink: string; 
  }) => (
    <div className="text-center py-8">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={actionLink}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-8">
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
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="mt-2 text-gray-600">{project.description}</p>
                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Started: {new Date(project.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Duration: {project.duration}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Project
                </Link>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Milestones"
              value="0"
              icon={Target}
              color="border-green-500"
              actionText="Add Milestones"
              actionLink={`/projects/${project.id}/milestones`}
              isEmpty={true}
            />
            <MetricCard
              title="Goals"
              value="0"
              icon={BarChart3}
              color="border-blue-500"
              actionText="Set Goals"
              actionLink={`/projects/${project.id}/goals`}
              isEmpty={true}
            />
            <MetricCard
              title="Findings"
              value="0"
              icon={FileText}
              color="border-purple-500"
              actionText="Add Findings"
              actionLink={`/projects/${project.id}/findings`}
              isEmpty={true}
            />
            <MetricCard
              title="Team Members"
              value="0"
              icon={Users}
              color="border-orange-500"
              actionText="Add Team"
              actionLink="#team-section"
              isEmpty={true}
            />
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                  <span className="text-sm font-medium text-gray-700">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Set up goals and milestones to track progress</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Team Members Section */}
            <div id="team-section" className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </button>
              </div>

              {showAddMember && (
                <form onSubmit={handleAddMember} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={data.position}
                      onChange={(e) => setData('position', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        Add Member
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddMember(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Empty state for team members */}
              <EmptyState
                icon={Users}
                title="No Team Members Yet"
                description="Add team members to collaborate on this project"
                actionText="Add First Member"
                actionLink="#"
              />
            </div>

            {/* Milestones Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
                <Link
                  href={`/projects/${project.id}/milestones`}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Link>
              </div>

              {/* Empty state for milestones */}
              <EmptyState
                icon={Target}
                title="No Milestones Set"
                description="Break down your project into manageable milestones"
                actionText="Create Milestone"
                actionLink={`/projects/${project.id}/milestones`}
              />
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
              <Link
                href={`/projects/${project.id}/goals`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Link>
            </div>

            <EmptyState
              icon={BarChart3}
              title="No Goals Defined"
              description="Set specific goals to track your project's success"
              actionText="Define Goals"
              actionLink={`/projects/${project.id}/goals`}
            />
          </div>

          {/* Findings Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Key Findings</h3>
              <Link
                href={`/projects/${project.id}/findings`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Finding
              </Link>
            </div>

            <EmptyState
              icon={FileText}
              title="No Findings Recorded"
              description="Document important discoveries and insights from your project"
              actionText="Record Finding"
              actionLink={`/projects/${project.id}/findings`}
            />
          </div>

          {/* Project Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Project Details</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Title</dt>
                    <dd className="text-sm font-medium text-gray-900">{project.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Description</dt>
                    <dd className="text-sm text-gray-900">{project.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Duration</dt>
                    <dd className="text-sm text-gray-900">{project.duration}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Start Date</dt>
                    <dd className="text-sm text-gray-900">{new Date(project.start_date).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Related Proposal</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Proposal Title</dt>
                    <dd className="text-sm font-medium text-gray-900">{project.proposal.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Proposal Description</dt>
                    <dd className="text-sm text-gray-900">{project.proposal.description}</dd>
                  </div>
                  <div className="pt-4">
                    <Link
                      href={`/proposals/${project.proposal.id}`}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Original Proposal
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDashboard;