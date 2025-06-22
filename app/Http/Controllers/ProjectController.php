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
            ->with(['proposal', 'milestones', 'milestones.goals' => function($query) {
                $query->orderBy('completed', 'desc')
                      ->orderBy('performance', 'desc');
            }]) // Load proposal, milestones, and goals with relationships
            ->orderBy('created_at', 'desc')
            ->first();

        // Transform the data to flatten goals with milestone info and calculate counts
        $milestonesCount = 0;
        $goalsCount = 0;
        $goals = collect();
        
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
                }
            }
            
            $goalsCount = $goals->count();
            $latestProject->goals = $goals->toArray();
            $latestProject->milestones_count = $milestonesCount;
            $latestProject->goals_count = $goalsCount;
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
}
