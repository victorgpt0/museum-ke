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
    public function index()
    {
        $artifacts = Artifact::with(['category', 'relatedTo'])->get();
        $totalArtifacts = Artifact::count();
        
        return response()->json([
            'artifacts' => $artifacts,
            'total' => $totalArtifacts
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