import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import { ArrowLeft, Calendar, Clock, DollarSign, FileText, Save, Target } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    start_date: string;
}

interface Goal {
    id: number;
    title: string;
    description: string;
    performance: number | null;
    comments: string | null;
    milestone_id: number;
    completed: boolean;
}

interface Budget {
    id: number;
    title: string;
    description: string;
    amount: number;
    amount_spent: number;
    milestone_id: number;
}

interface Milestone {
    id: number;
    title: string;
    description: string;
    due_date: string;
    performance_description: string;
    project_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    project: Project;
    milestone: Milestone;
    goals: Goal[];
    budgets: Budget[];
}

export default function MilestoneDashboard({ project, milestone, goals, budgets }: Props) {
    const [savingGoals, setSavingGoals] = useState<{ [key: number]: boolean }>({});
    const [savingBudgets, setSavingBudgets] = useState<{ [key: number]: boolean }>({});

    const getPerformanceColor = (performance: number | null) => {
        if (!performance) return 'bg-gray-200';
        if (performance <= 3) return 'bg-red-500';
        if (performance <= 6) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPerformanceLabel = (performance: number | null) => {
        if (performance === null) return 'Not Set';
        return `${performance * 10}%`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilDue = getDaysUntilDue(milestone.due_date);

    return (
        <AppLayout>
            <Head title={`${milestone.title} - ${project.title}`} />

            <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.history.back()}
                                    className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Back</span>
                                </Button>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{milestone.title}</h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-300">{project.title}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant={daysUntilDue > 7 ? 'default' : daysUntilDue > 0 ? 'destructive' : 'secondary'}>
                                    <Clock className="mr-1 h-3 w-3" />
                                    {daysUntilDue > 0 ? `${daysUntilDue} days left` : daysUntilDue === 0 ? 'Due today' : 'Overdue'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Milestone Overview */}
                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Card className="border border-gray-200 lg:col-span-2 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                    <FileText className="h-5 w-5" />
                                    <span>Milestone Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Description</h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">{milestone.description}</p>
                                </div>
                                {milestone.performance_description && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Performance Description</h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">{milestone.performance_description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                    <Calendar className="h-5 w-5" />
                                    <span>Timeline</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(milestone.due_date)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(milestone.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(milestone.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Goals Section */}
                    <Card className="mb-8 border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                <Target className="h-5 w-5" />
                                <span>Goals & Performance</span>
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                Track and update performance for each goal.{' '}
                                <strong className="text-red-600 dark:text-red-400">Warning: Saving a goal is irreversible.</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {goals.length === 0 ? (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    <Target className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>No goals have been set for this milestone.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {goals.map((goal) => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            isSaving={savingGoals[goal.id] || false}
                                            setSaving={setSavingGoals}
                                            getPerformanceLabel={getPerformanceLabel}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Budget Section */}
                    <Card className="border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                <DollarSign className="h-5 w-5" />
                                <span>Budget Utilization</span>
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                Track budget spending for each budget item.{' '}
                                <strong className="text-red-600 dark:text-red-400">Warning: Saving amount spent is irreversible.</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {budgets.length === 0 ? (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    <DollarSign className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>No budget items have been set for this milestone.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {budgets.map((budget) => (
                                        <BudgetCard
                                            key={budget.id}
                                            budget={budget}
                                            projectId={project.id}
                                            milestoneId={milestone.id}
                                            isSaving={savingBudgets[budget.id] || false}
                                            setSaving={setSavingBudgets}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// Separate component for individual goal cards
function GoalCard({
    goal,
    isSaving,
    setSaving,
    getPerformanceLabel,
}: {
    goal: Goal;
    isSaving: boolean;
    setSaving: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
    getPerformanceLabel: (performance: number | null) => string;
}) {
    const { data, setData, put, processing } = useForm({
        performance: goal.performance ?? 0,
        comments: goal.comments || '',
    });

    // Check if goal is completed (has both performance and comments)
    const isCompleted = goal.performance !== null && goal.performance > 0 && goal.comments && goal.comments.trim() !== '';

    const handlePerformanceChange = (value: number) => {
        if (!isCompleted) {
            setData('performance', value);
        }
    };

    const handleCommentsChange = (value: string) => {
        if (!isCompleted) {
            setData('comments', value);
        }
    };

    const handleSave = () => {
        if (isCompleted) return;

        // Validate that both performance and comments are provided
        if (!data.performance || data.performance === 0) {
            alert('Please set a performance rating');
            return;
        }

        if (!data.comments || data.comments.trim() === '') {
            alert('Please add comments about this goal');
            return;
        }

        setSaving((prev) => ({ ...prev, [goal.id]: true }));
        put(route('goals.update', { goal: goal.id }), {
            onSuccess: () => {
                setSaving((prev) => ({ ...prev, [goal.id]: false }));
                window.location.reload();
            },
            onError: () => {
                setSaving((prev) => ({ ...prev, [goal.id]: false }));
            },
        });
    };

    return (
        <div
            className={`rounded-lg border p-6 ${
                isCompleted
                    ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800'
            }`}
        >
            {/* Completed Tag - Display above the goal card */}
            {isCompleted && (
                <div className="mb-4 flex justify-center">
                    <Badge variant="default" className="bg-green-600 px-4 py-2 text-sm font-medium text-white">
                        ✓ Goal Completed
                    </Badge>
                </div>
            )}

            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                </div>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{goal.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Performance Slider */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Performance: {getPerformanceLabel(data.performance)}
                    </label>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">0%</span>
                        <div className="flex-1">
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={data.performance}
                                onChange={(e) => handlePerformanceChange(parseInt(e.target.value))}
                                disabled={isCompleted || false}
                                className={`slider h-2 w-full cursor-pointer appearance-none rounded-lg ${
                                    isCompleted ? 'cursor-not-allowed bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                                style={
                                    !isCompleted
                                        ? {
                                              backgroundImage: `linear-gradient(to right, #3b82f6, #3b82f6)`,
                                              backgroundRepeat: 'no-repeat',
                                              backgroundSize: `${data.performance * 10}% 100%`,
                                          }
                                        : {}
                                }
                            />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">100%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                        <span>Poor</span>
                        <span>Average</span>
                        <span>Excellent</span>
                    </div>
                </div>

                {/* Comments */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comments</label>
                    <textarea
                        rows={4}
                        value={data.comments}
                        onChange={(e) => handleCommentsChange(e.target.value)}
                        disabled={isCompleted || false}
                        className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:outline-none dark:focus:border-blue-400 ${
                            isCompleted
                                ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400'
                        }`}
                        placeholder={
                            isCompleted ? 'Goal has been completed - no further changes allowed' : "Add comments about this goal's progress..."
                        }
                    />
                </div>
            </div>

            {/* Individual Save Button */}
            <div className="mt-4 flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isCompleted || isSaving || processing}
                    className={`flex items-center space-x-2 ${
                        isCompleted
                            ? 'cursor-not-allowed border border-gray-300 bg-gray-300 text-gray-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400'
                            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                >
                    <Save className="h-4 w-4" />
                    <span>{isCompleted ? 'Goal Completed' : isSaving || processing ? 'Saving...' : 'Complete Goal (Irreversible)'}</span>
                </Button>
            </div>
        </div>
    );
}

// Separate component for individual budget cards
function BudgetCard({
    budget,
    projectId,
    milestoneId,
    isSaving,
    setSaving,
}: {
    budget: Budget;
    projectId: number;
    milestoneId: number;
    isSaving: boolean;
    setSaving: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}) {
    const { data, setData, put, processing } = useForm({
        budget_id: budget.id,
        amount_spent: (() => {
            const amountSpent = typeof budget.amount_spent === 'string' ? parseFloat(budget.amount_spent) : budget.amount_spent;
            return amountSpent > 0 && amountSpent !== null && !isNaN(amountSpent) ? amountSpent : '';
        })(),
    });

    const handleAmountSpentChange = (value: string) => {
        // Only allow changes if no amount has been saved yet
        const amountSpent = typeof budget.amount_spent === 'string' ? parseFloat(budget.amount_spent) : budget.amount_spent;
        if (amountSpent === 0 || amountSpent === null || isNaN(amountSpent)) {
            setData('amount_spent', value);
        }
    };

    const handleSave = () => {
        const amountSpent = typeof budget.amount_spent === 'string' ? parseFloat(budget.amount_spent) : budget.amount_spent;
        if (amountSpent > 0 && amountSpent !== null && !isNaN(amountSpent)) return; // Already spent, cannot edit

        // Validate that amount_spent is not empty and is a valid number
        const amountSpentValue = typeof data.amount_spent === 'string' ? parseFloat(data.amount_spent) : data.amount_spent;
        if (!data.amount_spent || isNaN(amountSpentValue) || amountSpentValue < 0) {
            alert('Please enter a valid amount spent');
            return;
        }

        // Debug: Log the data being sent
        console.log('Sending budget update data:', {
            budget_id: budget.id,
            amount_spent: amountSpentValue,
            data_object: data,
            budget_object: budget,
        });

        setSaving((prev) => ({ ...prev, [budget.id]: true }));

        put(route('project.milestones.update-budget', { project: projectId, milestone: milestoneId }), {
            onSuccess: () => {
                console.log('Budget update success');
                setSaving((prev) => ({ ...prev, [budget.id]: false }));
                window.location.reload();
            },
            onError: (errors: any) => {
                console.error('Budget update error:', errors);
                setSaving((prev) => ({ ...prev, [budget.id]: false }));
            },
        });
    };

    // Convert amount_spent to number and check if it's actually been set
    const amountSpent = typeof budget.amount_spent === 'string' ? parseFloat(budget.amount_spent) : budget.amount_spent;
    const isCompleted = amountSpent > 0 && amountSpent !== null && !isNaN(amountSpent);
    const utilizationPercentage = budget.amount > 0 ? (budget.amount_spent / budget.amount) * 100 : 0;

    return (
        <div
            className={`rounded-lg border p-6 ${
                isCompleted
                    ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800'
            }`}
        >
            {/* Completed Tag - Display above the budget card */}
            {isCompleted && (
                <div className="mb-4 flex justify-center">
                    <Badge variant="default" className="bg-green-600 px-4 py-2 text-sm font-medium text-white">
                        ✓ Budget Spent
                    </Badge>
                </div>
            )}

            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.title}</h3>
                </div>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{budget.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Budget Information */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budgeted Amount</label>
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">Ksh {budget.amount.toLocaleString()}</span>
                    </div>

                    {isCompleted && (
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount Spent</label>
                            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Ksh {budget.amount_spent.toLocaleString()}</span>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Utilization</label>
                            <span
                                className={`text-sm font-medium ${
                                    utilizationPercentage > 100
                                        ? 'text-red-600 dark:text-red-400'
                                        : utilizationPercentage > 80
                                          ? 'text-yellow-600 dark:text-yellow-400'
                                          : 'text-green-600 dark:text-green-400'
                                }`}
                            >
                                {utilizationPercentage.toFixed(1)}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Amount Spent Input */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount Spent (Ksh)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.amount_spent}
                        onChange={(e) => handleAmountSpentChange(e.target.value)}
                        disabled={isCompleted}
                        className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:outline-none dark:focus:border-blue-400 ${
                            isCompleted
                                ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400'
                        }`}
                        placeholder={isCompleted ? 'Budget already spent - no further changes allowed' : 'Enter amount spent...'}
                    />
                    {!isCompleted && <p className="text-xs text-gray-500 dark:text-gray-400">Enter the actual amount spent on this budget item</p>}
                </div>
            </div>

            {/* Individual Save Button */}
            <div className="mt-4 flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isCompleted || isSaving || processing}
                    className={`flex items-center space-x-2 ${
                        isCompleted
                            ? 'cursor-not-allowed border border-gray-300 bg-gray-300 text-gray-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400'
                            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                >
                    <Save className="h-4 w-4" />
                    <span>{isCompleted ? 'Budget Spent' : isSaving || processing ? 'Saving...' : 'Save Amount Spent (Irreversible)'}</span>
                </Button>
            </div>
        </div>
    );
}
