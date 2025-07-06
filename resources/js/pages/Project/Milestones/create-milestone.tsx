import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, DollarSign, FileText, Plus, Target, Trash2, Upload, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
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

interface BudgetItem {
    id: string;
    title: string;
    description: string;
    amount: string;
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
        description: '',
    });

    // New budget item being built
    const [newBudgetItem, setNewBudgetItem] = useState({
        title: '',
        description: '',
        amount: '',
    });

    // In your component, update the useForm data structure:
    const { data, setData, post, processing, errors, reset } = useForm({
        title: milestone?.title || '',
        description: milestone?.description || '',
        due_date: milestone?.due_date || '',
        project_id: project.id,
        documents: [] as File[],
        goals: [] as Goal[],
        budgetItems: [] as BudgetItem[],
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
            id: Date.now().toString(),
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
            description: '',
        });
    };

    // Remove goal from the list
    const removeGoal = (goalId: string) => {
        const updatedGoals = data.goals.filter((goal) => goal.id !== goalId);
        setData('goals', updatedGoals);
        toast.error(' goal removed');
    };

    // Add budget item to the list
    const addBudgetItem = () => {
        // Validate that all fields are provided
        if (!newBudgetItem.title.trim() || !newBudgetItem.description.trim() || !newBudgetItem.amount.trim()) {
            toast.error('Please fill in all budget item fields');
            return;
        }

        // Validate amount is a positive number
        const amount = parseFloat(newBudgetItem.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid positive amount');
            return;
        }

        // Create the new budget item from the current newBudgetItem state
        const budgetItemWithId: BudgetItem = {
            title: newBudgetItem.title,
            description: newBudgetItem.description,
            amount: newBudgetItem.amount,
            id: Date.now().toString(),
        };

        // Get the current budget items and add the new one
        const updatedBudgetItems = [...data.budgetItems, budgetItemWithId];

        // Update the form data
        setData('budgetItems', updatedBudgetItems);

        // Console log the updated budget items list
        console.log('Updated budget items:', updatedBudgetItems);
        toast.success('Budget item added successfully');

        // Clear the form
        setNewBudgetItem({
            title: '',
            description: '',
            amount: '',
        });
    };

    // Remove budget item from the list
    const removeBudgetItem = (budgetItemId: string) => {
        const updatedBudgetItems = data.budgetItems.filter((item) => item.id !== budgetItemId);
        setData('budgetItems', updatedBudgetItems);
        toast.error('Budget item removed');
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
            'image/png',
        ];

        const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            alert('Please upload only supported document types (PDF, Word, Excel, Text, or Image files).');
            return;
        }

        // Validate file sizes (10MB max per file)
        const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
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
        console.log('Budget items data:', data.budgetItems);

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
            budgetItems: data.budgetItems, // Send budget items array directly
            documents: data.documents || [], // Include uploaded documents
        };

        console.log('Formatted Milestone Data:', formData);
        console.log('Goals being sent:', data.goals);
        console.log('Budget items being sent:', data.budgetItems);
        console.log('Documents being sent:', data.documents?.map((doc) => doc.name) || []);

        // Send data to backend using router.post with forceFormData
        router.post(`/projects/${project.id}/savemilestones`, formData, {
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
                setNewBudgetItem({ title: '', description: '', amount: '' });
                setUploadedFiles([]);
                
                // Redirect to project dashboard with refresh
                router.visit(`/project/dashboard/${project.id}`, {
                    method: 'get',
                    preserveState: false,
                    preserveScroll: false,
                });
            },
            onError: (errors) => {
                console.error('[❌] Milestone submission failed with errors:', errors);

                // Show specific error messages
                if (errors.title) toast.error(`Title: ${errors.title}`);
                if (errors.description) toast.error(`Description: ${errors.description}`);
                if (errors.due_date) toast.error(`Due Date: ${errors.due_date}`);
                if (errors.goals) toast.error(`Goals: ${errors.goals}`);
                if (errors.budgetItems) toast.error(`Budget Items: ${errors.budgetItems}`);
                if (errors.documents) toast.error(`Documents: ${errors.documents}`);

                // Fallback error message
                if (!Object.keys(errors).length) {
                    toast.error('There was an error creating the milestone. Check console for details.');
                }
            },
            onFinish: () => {
                console.log('[DEBUG] ✅ Milestone submission finished (success or failure)');
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Milestone Dashboard - ${project.title}`} />
            {flash.success && (
                <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300">
                    {flash.success}
                </div>
            )}
            <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button and Project Header */}
                    <div className="mb-8 flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit(`/project/dashboard/${project.id}`, {
                                method: 'get',
                                preserveState: false,
                                preserveScroll: false,
                            })}
                            className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Dashboard</span>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Milestone</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">{project.title}</p>
                        </div>
                    </div>

                    {/* Project Header */}
                    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    Started:{' '}
                                    {new Date(project.start_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
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
                            },
                        }}
                    />
                    {/* Milestone Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Milestone Details</h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Milestone Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        placeholder="Enter milestone name"
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                                </div>

                                <div>
                                    <label htmlFor="due_date" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Due Date *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            id="due_date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            min={(() => {
                                                // Get today's date in YYYY-MM-DD format
                                                const today = new Date().toISOString().split('T')[0];
                                                // Get project start date in YYYY-MM-DD format
                                                const projectStartDate = new Date(project.start_date).toISOString().split('T')[0];
                                                // Return the later of the two dates
                                                return today > projectStartDate ? today : projectStartDate;
                                            })()}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            required
                                        />
                                        <Calendar className="absolute top-2.5 right-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Due date cannot be before {new Date(Math.max(new Date().getTime(), new Date(project.start_date).getTime())).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    {errors.due_date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.due_date}</p>}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="Describe this milestone..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
                            </div>

                            <div className="mt-6">
                                <label htmlFor="performance_description" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Performance Description
                                </label>
                                <textarea
                                    id="performance_description"
                                    rows={3}
                                    value={data.performance_description}
                                    onChange={(e) => setData('performance_description', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="Describe expected performance outcomes..."
                                />
                                {errors.performance_description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.performance_description}</p>
                                )}
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Documents & Images</h3>

                            <div className="mb-4">
                                <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="mb-3 h-8 w-8 text-gray-400 dark:text-gray-500" />
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
                                        <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                                            <div className="flex items-center">
                                                <FileText className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Budget Section */}
                        <Card className="border border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                    <DollarSign className="h-5 w-5" />
                                    <span>Budget Items</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300">Define budget items for this milestone</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Title *</label>
                                        <input
                                            type="text"
                                            value={newBudgetItem.title}
                                            onChange={(e) => setNewBudgetItem({ ...newBudgetItem, title: e.target.value })}
                                            placeholder="e.g., Equipment rental"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
                                        <input
                                            type="text"
                                            value={newBudgetItem.description}
                                            onChange={(e) => setNewBudgetItem({ ...newBudgetItem, description: e.target.value })}
                                            placeholder="Brief description"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (Ksh) *</label>
                                        <input
                                            type="number"
                                            value={newBudgetItem.amount}
                                            onChange={(e) => setNewBudgetItem({ ...newBudgetItem, amount: e.target.value })}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={addBudgetItem}
                                        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm leading-4 font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none dark:bg-green-700 dark:hover:bg-green-600"
                                    >
                                        <Plus className="mr-1 h-4 w-4" />
                                        Add Budget Item
                                    </button>
                                </div>

                                {errors.budgetItems && <div className="text-sm text-red-500 dark:text-red-400">{errors.budgetItems}</div>}

                                {/* Budget Items List */}
                                {Array.isArray(data.budgetItems) && data.budgetItems.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Added Budget Items:</h4>
                                        {data.budgetItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/20"
                                            >
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900 dark:text-white">{item.title}</h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Ksh {item.amount}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeBudgetItem(item.id)}
                                                    className="rounded border border-red-300 px-2 py-1 text-red-600 hover:text-red-800 dark:border-red-600 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

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
                                            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                            placeholder="Enter goal title"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Description</label>
                                        <textarea
                                            rows={3}
                                            value={newGoal.description}
                                            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            placeholder="Describe this goal in detail..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={addGoal}
                                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm leading-4 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-600"
                                    >
                                        <Plus className="mr-1 h-4 w-4" />
                                        Add Goal
                                    </button>
                                </div>

                                {errors.goals && <div className="text-sm text-red-500 dark:text-red-400">{errors.goals}</div>}

                                {/* Goals List */}
                                {Array.isArray(data.goals) && data.goals.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Added Goals:</h4>
                                        {data.goals.map((goal) => (
                                            <div
                                                key={goal.id}
                                                className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/20"
                                            >
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900 dark:text-white">{goal.title}</h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeGoal(goal.id)}
                                                    className="rounded border border-red-300 px-2 py-1 text-red-600 hover:text-red-800 dark:border-red-600 dark:text-red-400 dark:hover:text-red-300"
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
                                className="inline-flex items-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:opacity-50"
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
