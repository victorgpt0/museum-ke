import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Calendar, Upload, Plus, Trash2, Save, FileText, Target } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
  id: number;
  title: string;
  start_date: string;
}

interface Goal {
  id: string;
  title: string;
  performance: number | null; // 1-10 scale based on your model
  description: string;
  comments?: string; // Optional since it exists in your model
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

  // New goal being built - only title and description needed
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: ''
  });

  // In your component, update the useForm data structure:
const { data, setData, post, processing, errors, reset } = useForm({
    title: milestone?.title || '',
    description: milestone?.description || '',
    due_date: milestone?.due_date || '',
    project_id: project.id,
    documents: [] as File[],
    goals: [] as Goal[]
});

// Remove any references to performance_description from your form

  // Add goal to the list
  const addGoal = () => {
    // Validate that at least title is provided
    if (!newGoal.title.trim()) {
          toast.success(' goal Title required');
      return;
    }

    // Create the new goal from the current newGoal state
    const goalWithId: Goal = {
      title: newGoal.title,
      description: newGoal.description,
      performance: null, // Set as null since it will be set later
      id: Date.now().toString()
    };

    // Get the current goals and add the new one
    const updatedGoals = [...data.goals, goalWithId];
    
    // Update the form data
    setData('goals', updatedGoals);
    
    // Console log the updated goals list
    console.log('Updated goals:', updatedGoals);
          toast.success(' goal added ');

    // Clear the form
    setNewGoal({
      title: '',
      description: ''
    });
  };

  // Remove goal from the list
  const removeGoal = (goalId: string) => {
    const updatedGoals = data.goals.filter(goal => goal.id !== goalId);
    setData('goals', updatedGoals);
          toast.error(' goal removed');
  };

  // Rest of your component logic goes here...

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files || []);
  
  if (files.length === 0) return;

  // Validate file types - allow various document types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  
  const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
  if (invalidFiles.length > 0) {
    alert('Please upload only supported document types (PDF, Word, Excel, Text, or Image files).');
    return;
  }

  // Validate file sizes (10MB max per file)
  const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    alert('Some files are too large. Maximum file size is 10MB. Please choose smaller files.');
    return;
  }

  // Add new files to existing uploaded files
  const newUploadedFiles = [...uploadedFiles, ...files];
  const newDocuments = [...data.documents, ...files];
  
  // Update both state and form data
  setUploadedFiles(newUploadedFiles);
  setData('documents', newDocuments);
  
  // Success feedback
      toast.success(`${files.length} file(s) added successfully`);

  // Clear the input value so the same file can be selected again if needed
  event.target.value = '';
};

const removeFile = (index: number) => {
  // Remove file from both uploadedFiles state and form data
  const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
  const newDocuments = data.documents.filter((_, i) => i !== index);
  
  setUploadedFiles(newUploadedFiles);
  setData('documents', newDocuments);
  
      toast.error('file removed successfully');
};
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Milestone submission started');
    console.log('Original form data:', data);
    console.log('Uploaded files:', uploadedFiles);
    console.log('Goals data:', data.goals);
    
    // Basic validation
    if (!data.title.trim()) {
        alert('Please enter a milestone title');
        return;
    }
    
    if (!data.description.trim()) {
        alert('Please enter a milestone description');
        return;
    }
    
    if (!data.due_date) {
        alert('Please select a due date');
        return;
    }
    
    // Format the date to YYYY-MM-DD
    const formattedDueDate = data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : '';
    
    // Create the submission data object
    const formData = {
        title: data.title.trim(),
        description: data.description.trim(),
        due_date: formattedDueDate,
        project_id: data.project_id,
        goals: data.goals, // Send goals array directly
        documents: data.documents || [] // Include uploaded documents
    };
    
    console.log('Formatted Milestone Data:', formData);
    console.log('Goals being sent:', data.goals);
    console.log('Documents being sent:', data.documents?.map(doc => doc.name) || []);
    
    // Send data to backend using router.post with forceFormData
    router.post(
        `/projects/${project.id}/savemilestones`,
        formData,
        {
            forceFormData: true, // This ensures files are handled properly
            preserveState: false,
            preserveScroll: true,
            onStart: () => {
                console.log('[DEBUG] 🛫 Milestone submission started...');
            },
            onProgress: (event) => {
                console.log('[DEBUG] Progress event:', event);
            },
            onSuccess: (page) => {
                console.log('[✅] Milestone submission successful! Server response:', page);
                toast.success('Milestone has been created successfully');
                
                // Reset form data
                reset();
                setNewGoal({ title: '', description: '' });
                setUploadedFiles([]);
            },
            onError: (errors) => {
                console.error('[❌] Milestone submission failed with errors:', errors);
                
                // Show specific error messages
                if (errors.title) toast.error(`Title: ${errors.title}`);
                if (errors.description) toast.error(`Description: ${errors.description}`);
                if (errors.due_date) toast.error(`Due Date: ${errors.due_date}`);
                if (errors.goals) toast.error(`Goals: ${errors.goals}`);
                if (errors.documents) toast.error(`Documents: ${errors.documents}`);
                
                // Fallback error message
                if (!Object.keys(errors).length) {
                    toast.error('There was an error creating the milestone. Check console for details.');
                }
            },
            onFinish: () => {
                console.log('[DEBUG] ✅ Milestone submission finished (success or failure)');
            }
        }
    );
};

  return (
    <AppLayout>
      <Head title={`Milestone Dashboard - ${project.title}`} />
      {flash.success && (
    <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
        {flash.success}
    </div>
)}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Started: {new Date(project.start_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  Active Project
                </span>
              </div>
            </div>
          </div>
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
            }
          }}
        />
          {/* Milestone Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Milestone Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Milestone Name *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter milestone name"
                    required
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="due_date"
                      value={data.due_date}
                      onChange={(e) => setData('due_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      required
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {errors.due_date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.due_date}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe this milestone..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
              </div>

              <div className="mt-6">
                <label htmlFor="performance_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Performance Description
                </label>
                <textarea
                  id="performance_description"
                  rows={3}
                  value={data.performance_description}
                  onChange={(e) => setData('performance_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe expected performance outcomes..."
                />
                {errors.performance_description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.performance_description}</p>}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents & Images</h3>
              
              <div className="mb-4">
                <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF, DOC up to 10MB</p>
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
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Files:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Goals Section */}
           <Card className="border border-gray-200 dark:border-gray-700">
  <CardHeader>
    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
      <Target className="h-5 w-5" />
      <span>Goals</span>
    </CardTitle>
    <CardDescription className="text-gray-600 dark:text-gray-300">
      Define the specific goals for this milestone
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Title *</label>
        <input
          type="text"
          value={newGoal.title}
          onChange={e => setNewGoal({...newGoal, title: e.target.value})}
          placeholder="Enter goal title"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Description</label>
        <textarea
          rows={3}
          value={newGoal.description}
          onChange={e => setNewGoal({...newGoal, description: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe this goal in detail..."
        />
      </div>
    </div>
    
    <div className="flex justify-end">
      <button 
        type="button" 
        onClick={addGoal}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Goal
      </button>
    </div>

    {errors.goals && <div className="text-red-500 dark:text-red-400 text-sm">{errors.goals}</div>}

    {/* Goals List */}
    {Array.isArray(data.goals) && data.goals.length > 0 && (
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 dark:text-white">Added Goals:</h4>
        {data.goals.map((goal) => (
          <div key={goal.id} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-700">
            <div className="flex-1">
              <h5 className="font-medium text-gray-900 dark:text-white">{goal.title}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
            </div>
            <button
              type="button"
              onClick={() => removeGoal(goal.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 border border-red-300 dark:border-red-600 rounded"
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
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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