<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
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
        try {
            // Ensure the project belongs to the authenticated user
            $this->authorize('view', $project);

            // Validate the request data
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:2000',
                'due_date' => 'required|date|after_or_equal:today',
                'performance_description' => 'nullable|string|max:2000',
            ], [
                'title.required' => 'Milestone title is required.',
                'title.max' => 'Milestone title cannot exceed 255 characters.',
                'description.required' => 'Milestone description is required.',
                'description.max' => 'Description cannot exceed 2000 characters.',
                'due_date.required' => 'Due date is required.',
                'due_date.date' => 'Due date must be a valid date.',
                'due_date.after_or_equal' => 'Due date cannot be in the past.',
                'performance_description.max' => 'Performance description cannot exceed 2000 characters.',
            ]);

            // Add the project_id to the validated data
            $validated['project_id'] = $project->id;

            // Create the milestone
            $milestone = Milestone::create($validated);

            // Redirect back to project dashboard with success message
            return redirect()
                ->route('projects.dashboard', $project->id)
                ->with('success', 'Milestone created successfully!');

        } catch (ValidationException $e) {
            // Return validation errors
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            // Handle any other errors
            return back()->withErrors([
                'error' => 'Failed to create milestone.',
                'exception' => $e->getMessage(),
            ])->withInput();
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
    public function update(Request $request, Project $project, Milestone $milestone)
    {
        try {
            // Ensure the project belongs to the authenticated user
            $this->authorize('view', $project);
            
            // Ensure the milestone belongs to the project
            if ($milestone->project_id !== $project->id) {
                abort(404);
            }

            // Validate the request data
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:2000',
                'due_date' => 'required|date',
                'performance_description' => 'nullable|string|max:2000',
            ]);

            // Update the milestone
            $milestone->update($validated);

            // Redirect back with success message
            return redirect()
                ->route('projects.dashboard', $project->id)
                ->with('success', 'Milestone updated successfully!');

        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to update milestone.',
                'exception' => $e->getMessage(),
            ])->withInput();
        }
    }

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