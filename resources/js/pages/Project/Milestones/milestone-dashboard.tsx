import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  FileText, 
  Save,
  X
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  duration: string;
  start_date: string;
}

interface AddMilestoneProps {
  project: Project;
}

const AddMilestone: React.FC<AddMilestoneProps> = ({ project }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    due_date: '',
    performance_description: '',
    project_id: project.id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/projects/${project.id}/milestones`, {
      onSuccess: () => {
        // Redirect back to project dashboard or milestones list
        // The controller will handle the redirect
      },
    });
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <>
      <Head title={`Add Milestone - ${project.title}`} />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href={`/projects/${project.id}/dashboard`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </Link>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-3xl font-bold text-gray-900">Add New Milestone</h1>
              <p className="mt-2 text-gray-600">
                Create a milestone for <span className="font-medium">{project.title}</span>
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white shadow-md rounded-lg">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Milestone Details</h2>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter milestone title"
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe this milestone and what needs to be accomplished"
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Due Date Field */}
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="due_date"
                    value={data.due_date}
                    onChange={(e) => setData('due_date', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.due_date ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.due_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
                )}
              </div>

              {/* Performance Description Field */}
              <div>
                <label htmlFor="performance_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Description
                </label>
                <textarea
                  id="performance_description"
                  rows={3}
                  value={data.performance_description}
                  onChange={(e) => setData('performance_description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.performance_description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe how performance will be measured for this milestone (optional)"
                />
                {errors.performance_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.performance_description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Optional: Describe success criteria and how this milestone will be evaluated
                </p>
              </div>

              {/* Project Info Display */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Project Information</h3>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Project:</span> {project.title}</p>
                  <p><span className="font-medium">Duration:</span> {project.duration}</p>
                  <p><span className="font-medium">Start Date:</span> {new Date(project.start_date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  * Required fields
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Milestone
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <FileText className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Tips for Creating Milestones</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make milestones specific and measurable</li>
                    <li>Set realistic due dates that align with your project timeline</li>
                    <li>Break down large tasks into smaller, manageable milestones</li>
                    <li>Include clear success criteria in the performance description</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMilestone;