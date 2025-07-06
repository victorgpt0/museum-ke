<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArtifactRequest;
use App\Models\Artifact;
use App\Models\Category;
use App\Models\Donor;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArtifactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Artifact::query()->with(['category', 'donor', 'tags']);

        // Apply filters
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }
        if ($request->filled('location')) {
            $query->where('location', 'ilike', '%'.$request->location.'%');
        }
        if ($request->filled('search')) {
            $query->where('title', 'ilike', '%'.$request->search.'%');
        }
        if ($request->filled('user_id')) {
            if (str_starts_with($request->user_id, 'not:')) {
                $id = substr($request->user_id, 4);
                $query->where('user_id', '!=', $id);
            } else {
                $query->where('user_id', $request->user_id);
            }
        }

        $artifacts = $query->paginate(request('perPage', 8))->withQueryString();
        $condition = Artifact::select('condition')->distinct()->pluck('condition');
        $tags = Tag::all();

        return Inertia::render('artifacts/index', [
            'artifacts' => $artifacts,
            'categories' => Category::all(),
            'condition' => $condition,
            'tags' => $tags,
            'filters' => $request->only(['category_id', 'condition', 'location', 'search', 'user_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('artifacts/create', [
            'categories' => Category::all(),
            'donors' => Donor::all(),
            'tags' => Tag::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ArtifactRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['user_id'] = auth()->id();

            // Remove file fields so they're not passed to the DB
            unset($validated['images'], $validated['documents']);

//            dd($validated);

            $artifact = Artifact::create($validated);

            // Handle file uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $artifact->addMedia($image)->toMediaCollection('images');
                }
            }

            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $doc) {
                    $artifact->addMedia($doc)->toMediaCollection('documents');
                }
            }

            // Handle tags
            if ($request->filled('tags')) {
                $artifact->tags()->sync($request->input('tags'));
            }

            return redirect()->route('artifacts.index')->with('success', 'Artifact created successfully.');
        } catch (\Exception $e) {
            return back()->with('error' ,'Failed to create artifact: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $artifact = Artifact::with(['category', 'donor', 'tags'])->findOrFail($id);
            $images = $artifact->getMedia('images');
            $documents = $artifact->getMedia('documents');

            return Inertia::render('artifacts/show', [
                'artifact' => $artifact,
                'images' => $images,
                'documents' => $documents,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('artifacts.index')->withErrors(['error' => 'Artifact not found.']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $artifact = Artifact::with(['category', 'donor', 'tags'])->findOrFail($id);
            $images = $artifact->getMedia('images');
            $documents = $artifact->getMedia('documents');

            return Inertia::render('artifacts/edit', [
                'artifact' => $artifact,
                'categories' => Category::all(),
                'donors' => Donor::all(),
                'tags' => Tag::all(),
                'images' => $images,
                'documents' => $documents,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('artifacts.index')->withErrors(['error' => 'Artifact not found.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ArtifactRequest $request, string $id)
    {
        try {
            $artifact = Artifact::findOrFail($id);
            $artifact->update($request->validated());

            // Handle file uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $artifact->addMedia($image)->toMediaCollection('images');
                }
            }

            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $doc) {
                    $artifact->addMedia($doc)->toMediaCollection('documents');
                }
            }

            // Handle tags
            if ($request->filled('tags')) {
                $artifact->tags()->sync($request->input('tags'));
            }

            return redirect()->route('artifacts.index')->with('success', 'Artifact updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update artifact: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $artifact = Artifact::findOrFail($id);
            $artifact->delete();

            return redirect()->route('artifacts.index')->with('success', 'Artifact deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete artifact: ' . $e->getMessage()]);
        }
    }
}
