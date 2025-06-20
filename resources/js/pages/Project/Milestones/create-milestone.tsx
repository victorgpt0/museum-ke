import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Upload, Plus, Trash2, Save, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Project {
  id: number;
  title: string;
  start_date: string;
}

interface Goal {
  title: string;
  performance: string;
  description: string;
  tempId: string;
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
  const [goals, setGoals] = useState<Goal[]>([
    { title: '', performance: '', description: '', tempId: Date.now().toString() }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [savingGoals, setSavingGoals] = useState<Set<string>>(new Set());

  const { data, setData, post, processing, errors, reset } = useForm({
    title: milestone?.title || '',
    description: milestone?.description || '',
    due_date: milestone?.due_date || '',
    performance_description: milestone?.performance_description || '',
    project_id: project.id,
    documents: [] as File[]
  });

  const addGoal = () => {
    setGoals([...goals, { 
      title: '', 
      performance: '', 
      description: '', 
      tempId: Date.now().toString() 
    }]);
  };

  const removeGoal = (tempId: string) => {
    setGoals(goals.filter(goal => goal.tempId !== tempId));
  };

  const updateGoal = (tempId: string, field: keyof Omit<Goal, 'tempId'>, value: string) => {
    setGoals(goals.map(goal => 
      goal.tempId === tempId ? { ...goal, [field]: value } : goal
    ));
  };

  const saveGoal = async (goal: Goal) => {
    if (!goal.title.trim()) {
      alert('Goal title is required');
      return;
    }

    setSavingGoals(prev => new Set(prev).add(goal.tempId));
    
    try {
      // First save the milestone to get milestone_id if it doesn't exist
      let milestoneId = milestone?.id;
      
      if (!milestoneId) {
        // Create milestone first
        const milestoneResponse = await fetch('/milestone/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            due_date: data.due_date,
            performance_description: data.performance_description,
            project_id: project.id
          })
        });
        
        if (!milestoneResponse.ok) {
          throw new Error('Failed to create milestone');
        }
        
        const milestoneData = await milestoneResponse.json();
        milestoneId = milestoneData.milestone.id;
      }

      // Save the goal
      const goalResponse = await fetch('/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          title: goal.title,
          performance: goal.performance,
          description: goal.description,
          milestone_id: milestoneId
        })
      });

      if (!goalResponse.ok) {
        throw new Error('Failed to save goal');
      }

      alert('Goal saved successfully!');
      
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Failed to save goal. Please try again.');
    } finally {
      setSavingGoals(prev => {
        const newSet = new Set(prev);
        newSet.delete(goal.tempId);
        return newSet;
      });
    }
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
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('due_date', data.due_date);
    formData.append('performance_description', data.performance_description);
    formData.append('project_id', data.project_id.toString());
    
    data.documents.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });

    router.post('/milestone/save', formData, {
      forceFormData: true,
      onSuccess: () => {
        alert('Milestone saved successfully!');
        reset();
        setGoals([{ title: '', performance: '', description: '', tempId: Date.now().toString() }]);
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
                <button
                  type="button"
                  onClick={addGoal}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Goal
                </button>
              </div>

              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={goal.tempId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-800">Goal {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => saveGoal(goal)}
                          disabled={savingGoals.has(goal.tempId)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {savingGoals.has(goal.tempId) ? 'Saving...' : 'Save Goal'}
                        </button>
                        {goals.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGoal(goal.tempId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Goal Title *
                        </label>
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.tempId, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter goal title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Performance Metric
                        </label>
                        <input
                          type="text"
                          value={goal.performance}
                          onChange={(e) => updateGoal(goal.tempId, 'performance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 90% completion rate"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goal Description
                      </label>
                      <textarea
                        rows={3}
                        value={goal.description}
                        onChange={(e) => updateGoal(goal.tempId, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe this goal in detail..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save Milestone'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}