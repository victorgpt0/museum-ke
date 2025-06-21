<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Milestone;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class GoalController extends Controller
{
    /**
     * Store a newly created goal
     * This endpoint also handles milestone creation/update if needed
     */
    public function store(Request $request)
{
    // Validate incoming data
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'performance' => 'nullable|string|max:3000',
        'description' => 'nullable|string|max:3000',
        'milestone_id' => 'nullable|exists:milestones,id',
        'project_id' => 'required_without:milestone_id|exists:projects,id',
        
        // Milestone creation/update fields
        'milestone_title' => 'required_without:milestone_id|string|max:255',
        'milestone_description' => 'nullable|string|max:3000',
        'milestone_due_date' => 'nullable|date',
        'milestone_performance_description' => 'nullable|string|max:3000',
        'update_milestone' => 'nullable|boolean',
    ]);

    if ($validator->fails()) {
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        return back()->withErrors($validator)->withInput();
    }

    try {
        DB::beginTransaction();

        $milestone = null;

        // Handle milestone creation or retrieval
        if ($request->milestone_id) {
            // Use existing milestone
            $milestone = Milestone::with('project')->findOrFail($request->milestone_id);
            $this->authorize('view', $milestone->project);
            
            // Update milestone if requested
            if ($request->boolean('update_milestone')) {
                $milestoneUpdateData = [];
                
                if ($request->filled('milestone_title')) {
                    $milestoneUpdateData['title'] = $request->milestone_title;
                }
                
                if ($request->filled('milestone_description')) {
                    $milestoneUpdateData['description'] = $request->milestone_description;
                }
                
                if ($request->filled('milestone_due_date')) {
                    $milestoneUpdateData['due_date'] = Carbon::parse($request->milestone_due_date);
                }
                
                if ($request->filled('milestone_performance_description')) {
                    $milestoneUpdateData['performance_description'] = $request->milestone_performance_description;
                }
                
                if (!empty($milestoneUpdateData)) {
                    $milestone->update($milestoneUpdateData);
                }
            }
        } else {
            // Create new milestone
            $project = Project::findOrFail($request->project_id);
            $this->authorize('view', $project);
            
            $milestone = Milestone::create([
                'title' => $request->milestone_title,
                'description' => $request->milestone_description,
                'due_date' => $request->milestone_due_date ? Carbon::parse($request->milestone_due_date) : null,
                'performance_description' => $request->milestone_performance_description,
                'project_id' => $project->id,
            ]);
        }

        // Create the goal
        $goal = Goal::create([
            'title' => $request->title,
            'performance' => $request->performance,
            'description' => $request->description,
            'milestone_id' => $milestone->id,
        ]);

        DB::commit();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Goal saved successfully!',
                'goal' => $goal->load('milestone.project'),
                'milestone' => $milestone->load('project'),
                'milestone_created' => !$request->milestone_id,
                'milestone_updated' => $request->boolean('update_milestone')
            ], 201);
        }

        return redirect()->back()
            ->with('success', 'Goal saved successfully!')
            ->with('milestone', $milestone);

    } catch (\Exception $e) {
        DB::rollBack();
        
        \Log::error('Goal creation failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'request_data' => $request->all()
        ]);
        
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save goal. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }

        return back()->withErrors([
            'error' => 'Failed to save goal. Please try again.',
        ])->withInput();
    }
}

    /**
     * Alternative store method that creates milestone if it doesn't exist
     * Use this if you want to handle milestone creation within the goal creation process
     */
    public function storeWithMilestone(Request $request)
    {
        // Validate incoming data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'performance' => 'nullable|string|max:3000',
            'description' => 'nullable|string|max:3000',
            'project_id' => 'required|exists:projects,id',
            // Milestone fields (required if milestone doesn't exist)
            'milestone_title' => 'required|string|max:255',
            'milestone_description' => 'nullable|string|max:3000',
            'milestone_due_date' => 'nullable|date',
            'milestone_performance_description' => 'nullable|string|max:3000',
            'milestone_id' => 'nullable|exists:milestones,id', // If provided, use existing milestone
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::beginTransaction();

            // Get the project and verify ownership
            $project = Project::findOrFail($request->project_id);
            $this->authorize('view', $project);

            $milestone = null;

            // Use existing milestone if provided, otherwise create new one
            if ($request->filled('milestone_id')) {
                $milestone = Milestone::findOrFail($request->milestone_id);
                // Verify the milestone belongs to the same project
                if ($milestone->project_id !== $project->id) {
                    throw new \Exception('Milestone does not belong to the specified project.');
                }
            } else {
                // Create new milestone
                $milestone = Milestone::create([
                    'title' => $request->milestone_title,
                    'description' => $request->milestone_description,
                    'due_date' => $request->milestone_due_date ? Carbon::parse($request->milestone_due_date) : null,
                    'performance_description' => $request->milestone_performance_description,
                    'project_id' => $project->id,
                ]);
            }

            // Create the goal
            $goal = Goal::create([
                'title' => $request->title,
                'performance' => $request->performance,
                'description' => $request->description,
                'milestone_id' => $milestone->id,
            ]);

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Goal and milestone saved successfully!',
                    'goal' => $goal->load('milestone.project'),
                    'milestone' => $milestone,
                    'milestone_created' => !$request->filled('milestone_id')
                ], 201);
            }

            return redirect()->back()->with('success', 'Goal and milestone saved successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save goal and milestone. Please try again.',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->withErrors([
                'error' => 'Failed to save goal and milestone. Please try again.',
                'exception' => $e->getMessage(),
            ]);
        }
    }
}