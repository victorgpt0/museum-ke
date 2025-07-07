<?php

namespace App\Http\Controllers;

use App\Models\Artifact;
use App\Models\Project;
use App\Models\Archives;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Handle public search for artifacts, projects, and archives.
     */
    public function search(Request $request)
    {
        $query = $request->get('query', '');
        $type = $request->get('type', 'all');

        $results = [
            'artifacts' => [],
            'projects' => [],
            'archives' => [],
            'total' => 0,
        ];

        if (empty($query)) {
            return Inertia::render('explore', [
                'searchResults' => $results,
            ]);
        }

        // Search artifacts (only published ones)
        if ($type === 'all' || $type === 'artifacts') {
            $artifacts = Artifact::where('is_published', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                      ->orWhere('description', 'like', "%{$query}%")
//                      ->orWhere('category', 'like', "%{$query}%")
                      ->orWhere('location', 'like', "%{$query}%")
//                      ->orWhere('period', 'like', "%{$query}%")
                    ;
                })

                ->with(['media' => function ($q) {
                    $q->limit(1); // Only get first image for preview
                }])
                ->limit(6)
                ->get();

            $results['artifacts'] = $artifacts;
        }

        // Search projects (only published ones)
        if ($type === 'all' || $type === 'projects') {
            $projects = Project::where('is_published', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                      ->orWhere('description', 'like', "%{$query}%")
//                      ->orWhere('status', 'like', "%{$query}%")
                    ;
                })
                ->limit(6)
                ->get();

            $results['projects'] = $projects;
        }

        // Search archives (only published ones)
        if ($type === 'all' || $type === 'reports') {
            $archives = Archives::where('is_published', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                      ->orWhere('author', 'like', "%{$query}%")
                      ->orWhere('category', 'like', "%{$query}%");
                })
                ->limit(6)
                ->get();

            $results['archives'] = $archives;
        }

        // Calculate total results
        $results['total'] = count($results['artifacts']) + count($results['projects']) + count($results['archives']);

        return Inertia::render('explore', [
            'searchResults' => $results,
        ]);
    }
}
