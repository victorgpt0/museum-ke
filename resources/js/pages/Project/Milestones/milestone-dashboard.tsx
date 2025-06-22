import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

import { 
  Calendar, 
  Target, 
  FileText, 
  TrendingUp, 
  Save,
  ArrowLeft,
  Clock
} from 'lucide-react';

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
}

export default function MilestoneDashboard({ project, milestone, goals }: Props) {
  const [savingGoals, setSavingGoals] = useState<{ [key: number]: boolean }>({});

  const getPerformanceColor = (performance: number | null) => {
    if (!performance) return 'bg-gray-200';
    if (performance <= 3) return 'bg-red-500';
    if (performance <= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPerformanceLabel = (performance: number | null) => {
    if (!performance) return 'Not Set';
    return `${performance * 10}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{milestone.title}</h1>
                  <p className="text-lg text-gray-600">{project.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={daysUntilDue > 7 ? "default" : daysUntilDue > 0 ? "destructive" : "secondary"}>
                  <Clock className="h-3 w-3 mr-1" />
                  {daysUntilDue > 0 ? `${daysUntilDue} days left` : daysUntilDue === 0 ? 'Due today' : 'Overdue'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Milestone Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Milestone Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="text-gray-600 mt-1">{milestone.description}</p>
                </div>
                {milestone.performance_description && (
                  <div>
                    <h3 className="font-medium text-gray-900">Performance Description</h3>
                    <p className="text-gray-600 mt-1">{milestone.performance_description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{formatDate(milestone.due_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(milestone.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(milestone.updated_at)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Goals & Performance</span>
              </CardTitle>
              <CardDescription>
                Track and update performance for each goal. <strong className="text-red-600">Warning: Saving a goal is irreversible.</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
                      getPerformanceColor={getPerformanceColor}
                      getPerformanceLabel={getPerformanceLabel}
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
  getPerformanceColor, 
  getPerformanceLabel 
}: {
  goal: Goal;
  isSaving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
  getPerformanceColor: (performance: number | null) => string;
  getPerformanceLabel: (performance: number | null) => string;
}) {
  const { data, setData, put, processing } = useForm({
    performance: goal.performance || 1,
    comments: goal.comments || ''
  });

  const handlePerformanceChange = (value: number) => {
    if (!goal.completed) {
      setData('performance', value);
    }
  };

  const handleCommentsChange = (value: string) => {
    if (!goal.completed) {
      setData('comments', value);
    }
  };

  const handleSave = () => {
    if (goal.completed) return;
    setSaving(prev => ({ ...prev, [goal.id]: true }));
    put(route('goals.update', { goal: goal.id }), {
      onSuccess: () => {
        setSaving(prev => ({ ...prev, [goal.id]: false }));
        window.location.reload();
      },
      onError: () => {
        setSaving(prev => ({ ...prev, [goal.id]: false }));
      }
    });
  };

  return (
    <div className={`border rounded-lg p-6 ${goal.completed ? 'bg-green-50' : 'bg-white'}`}>
      {/* Completed Tag - Display above the goal card */}
      {goal.completed && (
        <div className="mb-4 flex justify-center">
          <Badge variant="default" className="bg-green-600 text-white px-4 py-2 text-sm font-medium">
            ✓ Goal Completed
          </Badge>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {goal.title}
          </h3>
        </div>
        <p className="text-gray-600 mt-1">{goal.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Slider */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Performance: {getPerformanceLabel(data.performance)}
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">0%</span>
            <div className="flex-1">
              <input
                type="range"
                min="1"
                max="10"
                value={data.performance}
                onChange={(e) => handlePerformanceChange(parseInt(e.target.value))}
                disabled={goal.completed}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider ${
                  goal.completed ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200'
                }`}
                style={{
                  background: goal.completed 
                    ? '#d1d5db' 
                    : `linear-gradient(to right, ${getPerformanceColor(data.performance)} 0%, ${getPerformanceColor(data.performance)} ${data.performance * 10}%, #e5e7eb ${data.performance * 10}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <span className="text-sm text-gray-500">100%</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Poor</span>
            <span>Average</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Comments
          </label>
          <textarea
            rows={4}
            value={data.comments}
            onChange={(e) => handleCommentsChange(e.target.value)}
            disabled={goal.completed}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 ${
              goal.completed 
                ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder={goal.completed ? "Goal has been completed - no further changes allowed" : "Add comments about this goal's progress..."}
          />
        </div>
      </div>

      {/* Individual Save Button */}
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={goal.completed || isSaving || processing}
          className={`flex items-center space-x-2 ${goal.completed ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300' : ''}`}
        >
          <Save className="h-4 w-4" />
          <span>
            {goal.completed
              ? 'Goal Completed'
              : (isSaving || processing ? 'Saving...' : 'Complete Goal (Irreversible)')}
          </span>
        </Button>
      </div>
    </div>
  );
}