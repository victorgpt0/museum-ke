import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Calendar, Upload, Plus, Trash2, Save, FileText, Target } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@headlessui/react';


interface Project {
  id: number;
  title: string;
  start_date: string;
}

interface Goal {
  id: string;
  title: string;
  performance: string;
  description: string;
}

interface Props {
  project: Project;
  milestone?: {
    id: number;
    title: string;
    description: string;
    due_date: string;
    performance_description: string;
  };
}

export default function MilestoneDashboard({ project, milestone }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { flash } = usePage().props;

  // New goal being built
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    title: '',
    performance: '',
    description: ''
  });

  const { data, setData, post, processing, errors, reset } = useForm({
    title: milestone?.title || '',
    description: milestone?.description || '',
    due_date: milestone?.due_date || '',
    performance_description: milestone?.performance_description || '',
    project_id: project.id,
    documents: [] as File[],
    goals: [] as Goal[] // Goals list
  });

  // Add goal to the list
  // Add goal to the list
const addGoal = () => {
    // Create the new goal from the current newGoal state
    const goalWithId: Goal = {
        title: newGoal.title,
        performance: newGoal.performance,
        description: newGoal.description,
        id: Date.now().toString()
    };

    // Use the functional update form to ensure we get the latest goals
    setData('goals', (prevGoals) => [...prevGoals, goalWithId]);
    
    // Clear the form
    setNewGoal({
        title: '',
        performance: '',
        description: ''
    });
    console.log(data);  
};
  // Remove goal from the list
  const removeGoal = (goalId: string) => {
    setData('goals', data.goals.filter(goal => goal.id !== goalId));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setData('documents', [...data.documents, ...files]);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setData('documents', newFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the date to YYYY-MM-DD if it exists
    const formattedDueDate = data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : '';
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('due_date', formattedDueDate);
    formData.append('performance_description', data.performance_description);
    formData.append('project_id', data.project_id.toString());
    
    // Add goals data
    const goalsString = JSON.stringify(data.goals);
    formData.append('goals', goalsString);
    
    data.documents.forEach((file, index) => {
        formData.append(`documents[${index}]`, file);
    });

    // Debugging logs
    console.log('Goals data being sent:', data.goals);
    console.log('Stringified goals:', goalsString);
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    router.post(`/projects/${project.id}/milestones`, formData, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
            reset();
            setNewGoal({ title: '', performance: '', description: '' });
            setUploadedFiles([]);
        },
        onError: (errors) => {
            console.error('Validation errors:', errors);
        }
    });
};

  return (
    <AppLayout>
      <Head title={`Milestone Dashboard - ${project.title}`} />
      {flash.success && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {flash.success}
    </div>
)}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Started: {new Date(project.start_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Active Project
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Milestone Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Milestone Name *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter milestone name"
                    required
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      required
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe this milestone..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="mt-6">
                <label htmlFor="performance_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Description
                </label>
                <textarea
                  id="performance_description"
                  rows={3}
                  value={data.performance_description}
                  onChange={(e) => setData('performance_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe expected performance outcomes..."
                />
                {errors.performance_description && <p className="mt-1 text-sm text-red-600">{errors.performance_description}</p>}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Images</h3>
              
              <div className="mb-4">
                <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Goals Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Goals</span>
                </CardTitle>
                <CardDescription>
                  Define the specific goals for this milestone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Goal Title *</label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="Enter goal title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Performance Metric</label>
                    <input
                      type="text"
                      value={newGoal.performance}
                      onChange={e => setNewGoal({...newGoal, performance: e.target.value})}
                      placeholder="e.g., 90% completion rate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Goal Description</label>
                  <textarea
                    rows={3}
                    value={newGoal.description}
                    onChange={e => setNewGoal({...newGoal, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:  ring-blue-500 focus:border-blue-500"
                    placeholder="Describe this goal in detail..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={addGoal}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </button>
                </div>

                {errors.goals && <div className="text-red-500 text-sm">{errors.goals}</div>}

                {/* Goals List */}
{Array.isArray(data.goals) && data.goals.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Added Goals:</h4>
                    {data.goals.map((goal) => (
                      <div key={goal.id} className="flex items-center justify-between bg-green-50 p-3 rounded">
                        <div className="flex-1">
                          <h5 className="font-medium">{goal.title}</h5>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                          {goal.performance && <p className="text-xs text-gray-500">Performance Metric: {goal.performance}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGoal(goal.id)}
                          className="text-red-600 hover:text-red-800 px-2 py-1 border border-red-300 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save Milestone & Goals'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}