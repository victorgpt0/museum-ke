<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TeamMember;
use App\Models\Project;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeamMembersController extends Controller
{
  
    public function create(Project $project)
    {
        return Inertia::render('Project/Milestones/create-members', [
            'project' => $project,
        ]);
    }
  public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'email_address' => 'required|email|max:255',
            'phone_number' => 'required|string|max:30',
        ]);

        $validated['project_id'] = $project->id;
        $teamMember = TeamMember::create($validated);

        // If request expects JSON (e.g., Inertia/AJAX), return JSON, else redirect back
        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'team_member' => $teamMember]);
        }
        return redirect()->back()->with('success', 'Team member added successfully.');
    }
}
