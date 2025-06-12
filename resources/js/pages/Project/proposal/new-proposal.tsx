import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, CheckCircle, AlertCircle, Plus, Trash2, User, Target, Flag } from 'lucide-react';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Milestone {
  id: string;
  title: string;
  duration: string;
  description: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  context: string;
}

interface ProposalFormData {
  title: string;
  description: string;
  duration: string;
  objectives: Objective[];
  teamMembers: TeamMember[];
  milestones: Milestone[];
  goals: Goal[];
}

export default function NewProposalForm() {
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([]);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form data state
  const [data, setData] = useState<ProposalFormData>({
    title: '',
    description: '',
    duration: '',
    objectives: [],
    teamMembers: [],
    milestones: [],
    goals: []
  });

  // Sub-form states for adding new items
  const [newObjective, setNewObjective] = useState({ title: '', description: '', context: '' });
  const [newTeamMember, setNewTeamMember] = useState({ fullName: '', email: '', role: '' });
  const [newMilestone, setNewMilestone] = useState({ title: '', duration: '', description: '' });
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>('');

  // Duration options in months
  const durationOptions = [
    { value: '', label: 'Select Duration' },
    { value: '1', label: '1 Month' },
    { value: '2', label: '2 Months' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '9', label: '9 Months' },
    { value: '12', label: '12 Months' },
    { value: '18', label: '18 Months' },
    { value: '24', label: '24 Months' },
    { value: '36', label: '36 Months' }
  ];

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      documentPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [documentPreviews]);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
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

    const newDocuments = [...selectedDocuments, ...files];
    const newPreviews = [...documentPreviews, ...files.map(file => file.name)];
    
    setSelectedDocuments(newDocuments);
    setDocumentPreviews(newPreviews);
  };

  const removeDocument = (index: number) => {
    const newDocuments = selectedDocuments.filter((_, i) => i !== index);
    const newPreviews = documentPreviews.filter((_, i) => i !== index);
    
    setSelectedDocuments(newDocuments);
    setDocumentPreviews(newPreviews);
  };

  // Objective handlers
  const addObjective = () => {
    if (!newObjective.title.trim() || !newObjective.description.trim()) {
      alert('Please fill in all objective fields');
      return;
    }

    const objective: Objective = {
      id: Date.now().toString(),
      ...newObjective
    };

    setData(prev => ({
      ...prev,
      objectives: [...prev.objectives, objective]
    }));

    setNewObjective({ title: '', description: '', context: '' });
  };

  const removeObjective = (id: string) => {
    setData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  // Team member handlers
  const addTeamMember = () => {
    if (!newTeamMember.fullName.trim() || !newTeamMember.email.trim() || !newTeamMember.role.trim()) {
      alert('Please fill in all team member fields');
      return;
    }

    const teamMember: TeamMember = {
      id: Date.now().toString(),
      ...newTeamMember
    };

    setData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, teamMember]
    }));

    setNewTeamMember({ fullName: '', email: '', role: '' });
  };

  const removeTeamMember = (id: string) => {
    setData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };

  // Milestone handlers
  const addMilestone = () => {
    if (!newMilestone.title.trim() || !newMilestone.duration.trim() || !newMilestone.description.trim()) {
      alert('Please fill in all milestone fields');
      return;
    }

    const milestone: Milestone = {
      id: Date.now().toString(),
      ...newMilestone
    };

    setData(prev => ({
      ...prev,
      milestones: [...prev.milestones, milestone]
    }));

    setNewMilestone({ title: '', duration: '', description: '' });
  };

  const removeMilestone = (id: string) => {
    setData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== id)
    }));
  };

  // Goal handlers
  const addGoal = () => {
    if (!newGoal.title.trim() || !newGoal.description.trim()) {
      alert('Please fill in all goal fields');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal
    };

    setData(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));

    setNewGoal({ title: '', description: '' });
  };

  const removeGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    if (!data.title.trim()) newErrors.title = 'Title is required';
    if (!data.description.trim()) newErrors.description = 'Description is required';
    if (!data.duration) newErrors.duration = 'Duration is required';
    if (data.objectives.length === 0) newErrors.objectives = 'At least one objective is required';
    if (data.teamMembers.length === 0) newErrors.teamMembers = 'At least one team member is required';
    if (data.milestones.length === 0) newErrors.milestones = 'At least one milestone is required';
    if (data.goals.length === 0) newErrors.goals = 'At least one goal is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setProcessing(true);

    // Simulate form submission
    setTimeout(() => {
      setProcessing(false);
      setSuccess('Proposal submitted successfully!');
      console.log('Proposal Data:', data);
      console.log('Documents:', selectedDocuments);
    }, 2000);
  };

  return (
        <AppLayout>
    
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            New Proposal Form
          </h1>
          <p className="text-gray-600">
            Submit your project proposal with detailed information
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 border border-green-200 bg-green-50 p-4 rounded-md flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the fundamental details of your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your proposal title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide a detailed description of your proposal"
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="duration">Duration *</Label>
                  <select
                    id="duration"
                    value={data.duration}
                    onChange={e => setData(prev => ({ ...prev, duration: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.duration && <div className="text-red-500 text-sm">{errors.duration}</div>}
                </div>

                <div className="space-y-2">
                  <Label>Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <Label 
                          htmlFor="documents" 
                          className={`cursor-pointer px-3 py-1 rounded-md text-sm inline-block transition-colors ${
                            isUploadingDocs 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isUploadingDocs ? 'Uploading...' : 'Choose Files'}
                        </Label>
                        <Input
                          id="documents"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                          onChange={handleDocumentUpload}
                          className="hidden"
                          disabled={isUploadingDocs}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, Word, Excel, Text, Images (Max 10MB each)
                      </p>
                    </div>
                  </div>

                  {/* Document Previews */}
                  {documentPreviews.length > 0 && (
                    <div className="space-y-2">
                      {documentPreviews.map((fileName, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <span className="text-sm truncate">{fileName}</span>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Objectives</span>
              </CardTitle>
              <CardDescription>
                Define the specific objectives of your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    value={newObjective.title}
                    onChange={e => setNewObjective(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Objective title"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    value={newObjective.description}
                    onChange={e => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Context</Label>
                  <Input
                    value={newObjective.context}
                    onChange={e => setNewObjective(prev => ({ ...prev, context: e.target.value }))}
                    placeholder="Additional context"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={addObjective} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Objective
                </Button>
              </div>

              {errors.objectives && <div className="text-red-500 text-sm">{errors.objectives}</div>}

              {/* Objectives List */}
              {data.objectives.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Added Objectives:</h4>
                  {data.objectives.map((objective) => (
                    <div key={objective.id} className="flex items-center justify-between bg-blue-50 p-3 rounded">
                      <div className="flex-1">
                        <h5 className="font-medium">{objective.title}</h5>
                        <p className="text-sm text-gray-600">{objective.description}</p>
                        {objective.context && <p className="text-xs text-gray-500">Context: {objective.context}</p>}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeObjective(objective.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Team Members</span>
              </CardTitle>
              <CardDescription>
                Add the team members who will work on this proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input
                    value={newTeamMember.fullName}
                    onChange={e => setNewTeamMember(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newTeamMember.email}
                    onChange={e => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Input
                    value={newTeamMember.role}
                    onChange={e => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Enter role/position"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={addTeamMember} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Team Member
                </Button>
              </div>

              {errors.teamMembers && <div className="text-red-500 text-sm">{errors.teamMembers}</div>}

              {/* Team Members List */}
              {data.teamMembers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Team Members:</h4>
                  {data.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between bg-green-50 p-3 rounded">
                      <div className="flex-1">
                        <h5 className="font-medium">{member.fullName}</h5>
                        <p className="text-sm text-gray-600">{member.email} • {member.role}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTeamMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Flag className="h-5 w-5" />
                <span>Milestones</span>
              </CardTitle>
              <CardDescription>
                Define key milestones for your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    value={newMilestone.title}
                    onChange={e => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Milestone title"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Duration</Label>
                  <Input
                    value={newMilestone.duration}
                    onChange={e => setNewMilestone(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 2 weeks, 1 month"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    value={newMilestone.description}
                    onChange={e => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={addMilestone} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </div>

              {errors.milestones && <div className="text-red-500 text-sm">{errors.milestones}</div>}

              {/* Milestones List */}
              {data.milestones.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Milestones:</h4>
                  {data.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between bg-yellow-50 p-3 rounded">
                      <div className="flex-1">
                        <h5 className="font-medium">{milestone.title}</h5>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <p className="text-xs text-gray-500">Duration: {milestone.duration}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMilestone(milestone.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Goals</span>
              </CardTitle>
              <CardDescription>
                Define the main goals of your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    value={newGoal.title}
                    onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Goal title"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    value={newGoal.description}
                    onChange={e => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Goal description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={addGoal} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Goal
                </Button>
              </div>

              {errors.goals && <div className="text-red-500 text-sm">{errors.goals}</div>}

              {/* Goals List */}
              {data.goals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Goals:</h4>
                  {data.goals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between bg-purple-50 p-3 rounded">
                      <div className="flex-1">
                        <h5 className="font-medium">{goal.title}</h5>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeGoal(goal.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <Card>
            <CardFooter className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => window.history.back()}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={processing}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {processing ? 'Submitting...' : 'Submit Proposal'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
    </AppLayout>
    
  );
}