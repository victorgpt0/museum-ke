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
            ->with('proposal') // Optional: get related proposal info
            ->orderBy('created_at', 'desc')
            ->first();

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
