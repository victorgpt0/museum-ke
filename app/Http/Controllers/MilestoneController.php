<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Goals;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MilestoneController extends Controller
{
      use AuthorizesRequests;
    /**
     * Display the form for creating a new milestone.
     */
   public function create(Project $project)
{
    // Ensure the project belongs to the authenticated user

    return Inertia::render('Project/Milestones/create-milestone', [
        'project' => $project
    ]);
}

    /**
     * Store a newly created milestone in storage.
     */
  public function store(Request $request, $projectId) 
{
    // Validate incoming data
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'description' => 'required|string|max:3000',
        'due_date' => 'required|date',
        'project_id' => 'required|integer|exists:projects,id',
        'goals' => 'nullable|array',
        'goals.*.title' => 'required|string|max:255',
        'goals.*.description' => 'nullable|string|max:1000',
        'goals.*.performance' => 'nullable|integer|min:1|max:10',
        'budgetItems' => 'nullable|array',
        'budgetItems.*.title' => 'required|string|max:255',
        'budgetItems.*.description' => 'required|string|max:1000',
        'budgetItems.*.amount' => 'required|numeric|min:0',
        'documents.*' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,txt,png,jpg,jpeg,webp|max:10240', // 10MB max per file
    ]);
    
    if ($validator->fails()) {
        return back()->withErrors($validator)->withInput();
    }
    
    try {
        DB::beginTransaction();
        
        // Verify project exists and user has access
        $project = Project::findOrFail($projectId);
        
        // You might want to add authorization check here
        // $this->authorize('create-milestone', $project);
        
        // Create the milestone first
        $milestone = Milestone::create([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'project_id' => $projectId,
        ]);
        
        // Handle goals if provided
        if ($request->has('goals') && is_array($request->goals)) {
            foreach ($request->goals as $goalData) {
                // Create each goal with the milestone_id
                Goals::create([
                    'title' => $goalData['title'],
                    'description' => $goalData['description'] ?? null,
                    'performance' => isset($goalData['performance']) ? (int)$goalData['performance'] : null,
                    'comments' => null, // Set default or handle if needed
                    'milestone_id' => $milestone->id,
                ]);
            }
        }

        // Handle budget items if provided
        if ($request->has('budgetItems') && is_array($request->budgetItems)) {
            foreach ($request->budgetItems as $budgetData) {
                // Create each budget item with the milestone_id
                \App\Models\Budget::create([
                    'title' => $budgetData['title'],
                    'description' => $budgetData['description'],
                    'amount' => $budgetData['amount'],
                    'amount_spent' => 0, // Default to 0
                    'milestone_id' => $milestone->id,
                ]);
            }
        }
        
        // Handle document uploads
        if ($request->hasFile('documents') && is_array($request->file('documents'))) {
            foreach ($request->file('documents') as $index => $document) {
                if ($document && $document->isValid()) {
                    $mime = $document->getMimeType();
                    $ext = $document->getClientOriginalExtension();
                    $imageMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
                    $imageExtensions = ['png', 'jpg', 'jpeg', 'webp'];
                    
                    try {
                        if (in_array($mime, $imageMimeTypes) || in_array(strtolower($ext), $imageExtensions)) {
                            $milestone->addMediaFromRequest("documents.{$index}")
                                ->toMediaCollection('milestone_images');
                        } else {
                            $milestone->addMediaFromRequest("documents.{$index}")
                                ->toMediaCollection('milestone_documents');
                        }
                    } catch (\Exception $mediaException) {
                        Log::warning('Failed to upload document: ' . $mediaException->getMessage(), [
                            'milestone_id' => $milestone->id,
                            'document_index' => $index,
                            'file_name' => $document->getClientOriginalName()
                        ]);
                        // Continue with other files even if one fails
                    }
                }
            }
        }
        
        DB::commit();
        
        $goalsCount = count($request->goals ?? []);
        $budgetItemsCount = count($request->budgetItems ?? []);
        
        return redirect()->back()->with('success', "Milestone created successfully with {$goalsCount} goals and {$budgetItemsCount} budget items!");
        
    } catch (\Exception $e) {
        DB::rollBack();
        
        Log::error('Milestone creation failed: ' . $e->getMessage(), [
            'project_id' => $projectId,
            'user_id' => auth()->user()->id,
            'request_data' => $request->except(['documents']),
            'exception' => $e->getTraceAsString()
        ]);
        
        return back()->withErrors([
            'error' => 'Failed to create milestone. Please try again.',
            'exception' => config('app.debug') ? $e->getMessage() : 'An error occurred while processing your request.',
        ])->withInput();
    }
}/**
     * Update an existing milestone
     */
    public function update(Request $request, Milestone $milestone)
    {
        // Ensure the milestone belongs to a project owned by the authenticated user
        $this->authorize('view', $milestone->project);

        // Validate incoming data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:3000',
            'due_date' => 'nullable|date',
            'performance_description' => 'nullable|string|max:3000',
            'documents.*' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,txt,png,jpg,jpeg,webp|max:10240',
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

            // Update the milestone
            $milestone->update([
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date ? Carbon::parse($request->due_date) : null,
                'performance_description' => $request->performance_description,
            ]);

            // Handle document uploads if present
            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $index => $document) {
                    $mime = $document->getMimeType();
                    $ext = $document->getClientOriginalExtension();
                    $imageMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
                    $imageExtensions = ['png', 'jpg', 'jpeg', 'webp'];
                    
                    if (in_array($mime, $imageMimeTypes) || in_array(strtolower($ext), $imageExtensions)) {
                        $milestone->addMediaFromRequest("documents.{$index}")
                            ->toMediaCollection('milestone_images');
                    } else {
                        $milestone->addMediaFromRequest("documents.{$index}")
                            ->toMediaCollection('milestone_documents');
                    }
                }
            }

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Milestone updated successfully!',
                    'milestone' => $milestone->fresh()->load('project')
                ]);
            }

            return redirect()->back()->with('success', 'Milestone updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update milestone. Please try again.',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->withErrors([
                'error' => 'Failed to update milestone. Please try again.',
                'exception' => $e->getMessage(),
            ]);
        }
    }
    /**
     * Display the specified milestone.
     */
     public function show(Project $project, Milestone $milestone)
    {
        // Ensure the milestone belongs to the project
        if ($milestone->project_id !== $project->id) {
            abort(404, 'Milestone not found for this project');
        }

        // Load milestone with its goals
        $milestone->load('goals', 'budgets');

        return Inertia::render('Project/Milestones/milestone-dashboard', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'start_date' => $project->start_date,
            ],
            'milestone' => [
                'id' => $milestone->id,
                'title' => $milestone->title,
                'description' => $milestone->description,
                'due_date' => $milestone->due_date?->format('Y-m-d'),
                'performance_description' => $milestone->performance_description,
                'project_id' => $milestone->project_id,
                'created_at' => $milestone->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $milestone->updated_at?->format('Y-m-d H:i:s'),
            ],
            'goals' => $milestone->goals->map(function ($goal) {
                return [
                    'id' => $goal->id,
                    'title' => $goal->title,
                    'description' => $goal->description,
                    'performance' => $goal->performance,
                    'comments' => $goal->comments,
                    'milestone_id' => $goal->milestone_id,
                ];
            }),
            'budgets' => $milestone->budgets->map(function ($budget) {
                // Log the budget data for debugging
                Log::info('Budget data being sent to frontend', [
                    'budget_id' => $budget->id,
                    'amount_spent_raw' => $budget->amount_spent,
                    'amount_spent_type' => gettype($budget->amount_spent),
                    'amount_spent_is_null' => is_null($budget->amount_spent),
                    'amount_spent_is_zero' => $budget->amount_spent == 0,
                ]);
                
                return [
                    'id' => $budget->id,
                    'title' => $budget->title,
                    'description' => $budget->description,
                    'amount' => $budget->amount,
                    'amount_spent' => $budget->amount_spent,
                    'milestone_id' => $budget->milestone_id,
                ];
            }),
        ]);
    }
    public function updateGoals(Request $request, Project $project, Milestone $milestone)
{
    // Ensure the milestone belongs to the project
    if ($milestone->project_id !== $project->id) {
        abort(404, 'Milestone not found for this project');
    }

    $validated = $request->validate([
        'goals' => 'required|array',
        'goals.*.performance' => 'required|integer|min:1|max:10',
        'goals.*.comments' => 'nullable|string|max:1000',
    ]);

    foreach ($validated['goals'] as $goalId => $goalData) {
        $goal = $milestone->goals()->findOrFail($goalId);
        $goal->update([
            'performance' => $goalData['performance'],
            'comments' => $goalData['comments'],
        ]);
    }

    return redirect()->back()->with('success', 'Goals updated successfully!');
}

public function updateBudget(Request $request, Project $project, Milestone $milestone)
{
    try {
        // Ensure the milestone belongs to the project
        if ($milestone->project_id !== $project->id) {
            abort(404, 'Milestone not found for this project');
        }

        // Log the incoming request data for debugging
        Log::info('Budget update request received', [
            'request_data' => $request->all(),
            'project_id' => $project->id,
            'milestone_id' => $milestone->id
        ]);

        $validated = $request->validate([
            'budget_id' => 'required|exists:budgets,id',
            'amount_spent' => 'required|numeric|min:0',
        ]);

        Log::info('Validation passed', ['validated_data' => $validated]);

        $budget = $milestone->budgets()->findOrFail($validated['budget_id']);
        
        Log::info('Budget found', [
            'budget_id' => $budget->id,
            'current_amount_spent' => $budget->amount_spent,
            'new_amount_spent' => $validated['amount_spent']
        ]);

        $result = $budget->update([
            'amount_spent' => $validated['amount_spent'],
        ]);

        Log::info('Budget update result', [
            'update_result' => $result,
            'budget_id' => $budget->id,
            'new_amount_spent' => $budget->fresh()->amount_spent
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Budget amount spent updated successfully!',
                'budget' => $budget->fresh()
            ]);
        }

        return redirect()->back()->with('success', 'Budget amount spent updated successfully!');
        
    } catch (\Exception $e) {
        Log::error('Budget update failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'request_data' => $request->all()
        ]);
        
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update budget amount spent.',
                'error' => $e->getMessage()
            ], 500);
        }
        
        return back()->withErrors([
            'error' => 'Failed to update budget amount spent.',
            'exception' => $e->getMessage(),
        ]);
    }
}

    /**
     * Display milestones for a specific project.
     */
    public function index(Project $project)
    {
        // Ensure the project belongs to the authenticated user
        $this->authorize('view', $project);

        $milestones = $project->milestones()
            ->orderBy('due_date', 'asc')
            ->get();

        return Inertia::render('Milestone/MilestonesList', [
            'project' => $project,
            'milestones' => $milestones
        ]);
    }

    /**
     * Show the form for editing the specified milestone.
     */
    public function edit(Project $project, Milestone $milestone)
    {
        // Ensure the project belongs to the authenticated user
        $this->authorize('view', $project);
        
        // Ensure the milestone belongs to the project
        if ($milestone->project_id !== $project->id) {
            abort(404);
        }

        return Inertia::render('Milestone/EditMilestone', [
            'project' => $project,
            'milestone' => $milestone
        ]);
    }

    /**
     * Update the specified milestone in storage.
     */
   
    /**
     * Remove the specified milestone from storage.
     */
    public function destroy(Project $project, Milestone $milestone)
    {
        try {
            // Ensure the project belongs to the authenticated user
            $this->authorize('view', $project);
            
            // Ensure the milestone belongs to the project
            if ($milestone->project_id !== $project->id) {
                abort(404);
            }

            // Delete the milestone
            $milestone->delete();

            // Redirect back with success message
            return redirect()
                ->route('projects.dashboard', $project->id)
                ->with('success', 'Milestone deleted successfully!');

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to delete milestone.',
                'exception' => $e->getMessage(),
            ]);
        }
    }
}