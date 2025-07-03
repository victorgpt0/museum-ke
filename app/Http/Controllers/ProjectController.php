<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use Carbon\Carbon;
use Inertia\Inertia;

class ProjectController extends Controller
{
public function index()
{
    try {
        $userId = auth()->id();

        // Find the latest project where the related proposal belongs to the current user
        $latestProject = Project::whereHas('proposal', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with([
                'proposal', 
                'proposal.user',
                'milestones', 
                'milestones.goals' => function($query) {
                    $query->orderBy('completed', 'desc')
                          ->orderBy('performance', 'desc');
                },
                'milestones.budgets', // Add budgets to eager loading
                'findings.media', // Eager load findings and their media
                'teamMembers', // Eager load team members
            ])
            ->orderBy('created_at', 'desc')
            ->first();

        // Transform the data to flatten goals with milestone info and calculate counts
        $milestonesCount = 0;
        $goalsCount = 0;
        $completedGoalsCount = 0;
        $goals = collect();
        $findings = collect();
        $findingsCount = 0;
        $teamMembers = collect();
        $teamMembersCount = 0;
        
        if ($latestProject) {
            $milestonesCount = $latestProject->milestones->count();
            
            foreach ($latestProject->milestones as $milestone) {
                foreach ($milestone->goals as $goal) {
                    $goals->push([
                        'id' => $goal->id,
                        'title' => $goal->title,
                        'description' => $goal->description,
                        'performance' => $goal->performance,
                        'comments' => $goal->comments,
                        'completed' => $goal->completed,
                        'milestone' => [
                            'id' => $milestone->id,
                            'title' => $milestone->title,
                        ]
                    ]);
                    
                    // Count completed goals
                    if ($goal->completed) {
                        $completedGoalsCount++;
                    }
                }
            }
            
            $goalsCount = $goals->count();
            $projectProgress = $goalsCount > 0 ? round(($completedGoalsCount / $goalsCount) * 100, 1) : 0;
            
            $latestProject->goals = $goals->toArray();
            $latestProject->milestones_count = $milestonesCount;
            $latestProject->goals_count = $goalsCount;
            $latestProject->completed_goals_count = $completedGoalsCount;
            $latestProject->project_progress = $projectProgress;

            // Add findings
            if ($latestProject->relationLoaded('findings')) {
                foreach ($latestProject->findings as $finding) {
                    $findings->push([
                        'id' => $finding->id,
                        'title' => $finding->title,
                        'description' => $finding->description,
                        'all_documents_urls' => $finding->all_documents_urls,
                        'all_image_urls' => $finding->all_image_urls,
                        'created_at' => $finding->created_at,
                    ]);
                }
                $findingsCount = $findings->count();
            }
            $latestProject->findings = $findings->toArray();
            $latestProject->findings_count = $findingsCount;

            // Add team members
            if ($latestProject->relationLoaded('teamMembers')) {
                foreach ($latestProject->teamMembers as $member) {
                    $teamMembers->push([
                        'id' => $member->id,
                        'fullname' => $member->fullname,
                        'email_address' => $member->email_address,
                        'position' => $member->position,
                        'phone_number' => $member->phone_number,
                        'created_at' => $member->created_at,
                    ]);
                }
                $teamMembersCount = $teamMembers->count();
            }
            $latestProject->team_members = $teamMembers->toArray();
            $latestProject->team_members_count = $teamMembersCount;

            // Add creator name
            $latestProject->creator_name = $latestProject->proposal && $latestProject->proposal->user ? $latestProject->proposal->user->name : '';
        }

        return Inertia::render('Project/project-dashboard', [
            'project' => $latestProject
        ]);
    } catch (\Exception $e) {
        return back()->withErrors([
            'error' => 'Failed to retrieve project.',
            'exception' => $e->getMessage(),
        ]);
    }
}

public function showAll()
{
    try {
        $userId = auth()->id();
        $user = auth()->user();
        
        // Check if user is HOD or SuperAdmin
        $isAdmin = $user->hasRole(['HOD', 'SuperAdmin']);
        
        $query = Project::query();
        
        // Only filter by user's proposals if not admin
        if (!$isAdmin) {
            $query->whereHas('proposal', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            });
        }
        
        $projects = $query->with([
                'proposal',
                'proposal.user',
                'milestones',
                'milestones.goals' => function($query) {
                    $query->orderBy('completed', 'desc')
                          ->orderBy('performance', 'desc');
                },
                'milestones.budgets', // Add budgets to eager loading
                'findings.media',
                'teamMembers',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Add status and progress for each project
        $projects = $projects->map(function ($project) {
            $milestonesCount = $project->milestones->count();
            $goals = collect();
            $completedGoalsCount = 0;
            foreach ($project->milestones as $milestone) {
                foreach ($milestone->goals as $goal) {
                    $goals->push($goal);
                    if ($goal->completed) {
                        $completedGoalsCount++;
                    }
                }
            }
            $goalsCount = $goals->count();
            $projectProgress = $goalsCount > 0 ? round(($completedGoalsCount / $goalsCount) * 100, 1) : 0;
            $project->milestones_count = $milestonesCount;
            $project->goals_count = $goalsCount;
            $project->completed_goals_count = $completedGoalsCount;
            $project->project_progress = $projectProgress;
            $project->status = ($projectProgress < 100) ? 'Ongoing' : 'Completed';

            // Add creator name
            $project->creator_name = $project->proposal && $project->proposal->user ? $project->proposal->user->name : '';

            return $project;
        });

        return Inertia::render('Project/all-projects', [
            'projects' => $projects
        ]);
    } catch (\Exception $e) {
        return back()->withErrors([
            'error' => 'Failed to retrieve projects.',
            'exception' => $e->getMessage(),
        ]);
    }
}

public function show($id)
{
    try {
        $userId = auth()->id();
        $project = Project::where('id', $id)
            ->whereHas('proposal', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with([
                'proposal',
                'proposal.user',
                'milestones',
                'milestones.goals' => function($query) {
                    $query->orderBy('completed', 'desc')
                          ->orderBy('performance', 'desc');
                },
                'milestones.budgets', // Add budgets to eager loading
                'findings.media',
                'teamMembers',
            ])
            ->firstOrFail();

        // Transform and add counts/progress as in index
        $milestonesCount = $project->milestones->count();
        $goals = collect();
        $completedGoalsCount = 0;
        foreach ($project->milestones as $milestone) {
            foreach ($milestone->goals as $goal) {
                $goals->push([
                    'id' => $goal->id,
                    'title' => $goal->title,
                    'description' => $goal->description,
                    'performance' => $goal->performance,
                    'comments' => $goal->comments,
                    'completed' => $goal->completed,
                    'milestone' => [
                        'id' => $milestone->id,
                        'title' => $milestone->title,
                    ]
                ]);
                if ($goal->completed) {
                    $completedGoalsCount++;
                }
            }
        }
        $goalsCount = $goals->count();
        $projectProgress = $goalsCount > 0 ? round(($completedGoalsCount / $goalsCount) * 100, 1) : 0;
        $project->goals = $goals->toArray();
        $project->milestones_count = $milestonesCount;
        $project->goals_count = $goalsCount;
        $project->completed_goals_count = $completedGoalsCount;
        $project->project_progress = $projectProgress;

        // Add findings
        $findings = collect();
        if ($project->relationLoaded('findings')) {
            foreach ($project->findings as $finding) {
                $findings->push([
                    'id' => $finding->id,
                    'title' => $finding->title,
                    'description' => $finding->description,
                    'all_documents_urls' => $finding->all_documents_urls,
                    'all_image_urls' => $finding->all_image_urls,
                    'created_at' => $finding->created_at,
                ]);
            }
        }
        $project->findings = $findings->toArray();
        $project->findings_count = $findings->count();

        // Add team members
        $teamMembers = collect();
        if ($project->relationLoaded('teamMembers')) {
            foreach ($project->teamMembers as $member) {
                $teamMembers->push([
                    'id' => $member->id,
                    'fullname' => $member->fullname,
                    'email_address' => $member->email_address,
                    'position' => $member->position,
                    'phone_number' => $member->phone_number,
                    'created_at' => $member->created_at,
                ]);
            }
        }
        $project->team_members = $teamMembers->toArray();
        $project->team_members_count = $teamMembers->count();

        // Add creator name
        $project->creator_name = $project->proposal && $project->proposal->user ? $project->proposal->user->name : '';

        return Inertia::render('Project/project-dashboard', [
            'project' => $project
        ]);
    } catch (\Exception $e) {
        return back()->withErrors([
            'error' => 'Failed to retrieve project.',
            'exception' => $e->getMessage(),
        ]);
    }
}

public function markComplete($id)
{
    $userId = auth()->id();
    $project = Project::where('id', $id)
        ->whereHas('proposal', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->firstOrFail();
    $project->completed = true;
    $project->save();
    return redirect()->back()->with('success', 'Project marked as complete.');
}
}
