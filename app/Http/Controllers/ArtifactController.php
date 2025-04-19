<?php

namespace App\Http\Controllers;

use App\Models\Artifact;
use App\Models\Category;
use Illuminate\Http\Request;

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
}