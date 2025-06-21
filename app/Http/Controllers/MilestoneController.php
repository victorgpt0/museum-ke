<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
    $this->authorize('view', $project);

    return Inertia::render('Project/Milestones/create-milestone', [
        'project' => $project
    ]);
}

    /**
     * Store a newly created milestone in storage.
     */
  public function store(Request $request, Project $project)
{
    $this->authorize('view', $project);

    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string|max:3000',
        'due_date' => 'nullable|date_format:Y-m-d',
        'performance_description' => 'nullable|string|max:3000',
        'documents.*' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,txt,png,jpg,jpeg,webp|max:10240',
        'goals' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return redirect()->back()->withErrors($validator)->withInput();
    }

    try {
        DB::beginTransaction();

        $dueDate = $request->due_date ? Carbon::createFromFormat('Y-m-d', $request->due_date) : null;

        $milestone = Milestone::create([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $dueDate,
            'performance_description' => $request->performance_description,
            'project_id' => $project->id,
        ]);

        // Add debug logging for goals
        \Log::debug('Received goals data:', ['raw' => $request->goals]);
        
        if ($request->filled('goals')) {
            $goals = json_decode($request->goals, true);
            
            \Log::debug('Decoded goals:', ['goals' => $goals]);
            
            if (json_last_error() === JSON_ERROR_NONE && is_array($goals)) {
                foreach ($goals as $goalData) {
                    // Add validation for each goal
                    $validatedGoal = validator($goalData, [
                        'title' => 'required|string|max:255',
                        'description' => 'nullable|string',
                        'performance' => 'nullable|string',
                    ])->validate();

                    $milestone->goals()->create([
                        'title' => $validatedGoal['title'],
                        'description' => $validatedGoal['description'] ?? null,
                        'performance' => $validatedGoal['performance'] ?? null,
                    ]);
                }
            } else {
                \Log::error('Invalid goals JSON:', [
                    'error' => json_last_error_msg(),
                    'input' => $request->goals
                ]);
            }
        }

        // ... rest of your document handling code ...

        DB::commit();

        return redirect()->back()->with([
            'success' => 'Milestone and goals created successfully!',
            'milestone' => $milestone->load(['project', 'goals'])
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        
        \Log::error('Milestone creation failed: ' . $e->getMessage());
        \Log::error($e->getTraceAsString());

        return redirect()->back()->withErrors([
            'error' => 'Failed to create milestone and goals. Please try again.',
            'exception' => $e->getMessage(),
        ]);
    }
}
    /**
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
        // Ensure the project belongs to the authenticated user
        $this->authorize('view', $project);
        
        // Ensure the milestone belongs to the project
        if ($milestone->project_id !== $project->id) {
            abort(404);
        }

        return Inertia::render('Milestone/ShowMilestone', [
            'project' => $project,
            'milestone' => $milestone
        ]);
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