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
  const [editingGoals, setEditingGoals] = useState<{ [key: number]: Goal }>({});

  const { data, setData, put, processing } = useForm({
    goals: goals.reduce((acc, goal) => {
      acc[goal.id] = {
        performance: goal.performance || 1,
        comments: goal.comments || ''
      };
      return acc;
    }, {} as { [key: number]: { performance: number; comments: string } })
  });

  const handleGoalUpdate = (goalId: number, field: 'performance' | 'comments', value: string | number) => {
    setData('goals', {
      ...data.goals,
      [goalId]: {
        ...data.goals[goalId],
        [field]: value
      }
    });
  };

  const handleSubmit = () => {
    put(route('project.milestones.update-goals', { project: project.id, milestone: milestone.id }));
  };

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
                Track and update performance for each goal
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
                    <div key={goal.id} className="border rounded-lg p-6 bg-white">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-gray-600 mt-1">{goal.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Performance Slider */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Performance: {getPerformanceLabel(data.goals[goal.id]?.performance)}
                          </label>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">0%</span>
                            <div className="flex-1">
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={data.goals[goal.id]?.performance || 1}
                                onChange={(e) => handleGoalUpdate(goal.id, 'performance', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(to right, ${getPerformanceColor(data.goals[goal.id]?.performance)} 0%, ${getPerformanceColor(data.goals[goal.id]?.performance)} ${(data.goals[goal.id]?.performance || 1) * 10}%, #e5e7eb ${(data.goals[goal.id]?.performance || 1) * 10}%, #e5e7eb 100%)`
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
                            value={data.goals[goal.id]?.comments || ''}
                            onChange={(e) => handleGoalUpdate(goal.id, 'comments', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add comments about this goal's progress..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          {goals.length > 0 && (
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={processing}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{processing ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}