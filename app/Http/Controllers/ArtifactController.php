<?php

namespace App\Http\Controllers;

use App\Models\Artifact;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArtifactController extends Controller
{
    /**
     * Get all artifacts
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10); // Default 10 items per page
        $page = $request->input('page', 1);

        $query = Artifact::with(['category', 'relatedTo']);

        // Handle any filtering here if needed
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhereHas('category', function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                });
        }

        $artifacts = $query->paginate($perPage);
        $totalArtifacts = Artifact::count();

        return response()->json([
            'artifacts' => $artifacts->items(),
            'total' => $totalArtifacts,
            'current_page' => $artifacts->currentPage(),
            'per_page' => $artifacts->perPage(),
            'last_page' => $artifacts->lastPage(),
            'total_pages' => ceil($totalArtifacts / $perPage)
        ]);
    }

    /**
     * Get artifacts by category
     */
    public function byCategory($categoryId)
    {
        $artifacts = Artifact::where('category_id', $categoryId)
            ->with(['category', 'relatedTo'])
            ->get();

        return response()->json($artifacts);
    }

    /**
     * Get single artifact by ID
     */
    public function show($id)
    {
        $artifact = Artifact::with(['category', 'relatedTo', 'relatedArtifacts'])
            ->findOrFail($id);

        return response()->json($artifact);
    }



    /**
     * Store a newly created artifact in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'category_id' => 'required|exists:category,id', // Changed validation rule
        'condition' => 'required|in:good,poor',
        'location' => 'nullable|string|max:255',
    ]);

    Artifact::create($validated);

    return redirect()->route('dashboard')->with('message', 'Artifact created successfully');
}
    public function create()
{
    $categories = \App\Models\Category::all();
    return Inertia::render('NewArtifact', [
        'categories' => $categories
    ]);
}
}
