<?php

namespace App\Http\Controllers;

use App\Models\Archives;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ArchivesController extends Controller
{
    /**
     * Display a listing of archives ordered by recency.
     */
    public function index(Request $request)
    {
        $query = Archives::query();

        // Filter by category if provided
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Search by title if provided
        if ($request->has('search') && $request->search) {
            $query->where('title', 'LIKE', '%' . $request->search . '%');
        }

        // Filter by author if provided
        if ($request->has('author') && $request->author) {
            $query->where('author', 'LIKE', '%' . $request->author . '%');
        }

        $archives = $query->with('user')->orderBy('created_at', 'desc')
                         ->paginate(12)
                         ->withQueryString();

        $categories = Category::all();

        // Add uploader name to each archive
        $archives->getCollection()->transform(function ($archive) {
            $archive->uploader_name = $archive->user ? $archive->user->name : 'Unknown';
            return $archive;
        });

        return Inertia::render('Archives', [
            'archives' => $archives,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'author']),
        ]);
    }

    /**
     * Show the form for creating a new archive.
     */
    public function create()
    {
        return Inertia::render('NewArchive');
    }

    /**
     * Store a newly created archive in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category' => ['required', 'string', Rule::in(['research', 'context'])],
            'document' => 'nullable|file|mimes:pdf,doc,docx,txt,xlsx,xls,ppt,pptx|max:10240',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $archive = Archives::create([
            'title' => $validated['title'],
            'author' => $validated['author'],
            'category' => $validated['category'],
            'user_id' => auth()->id(),
        ]);

        // Attach document if uploaded
        if ($request->hasFile('document')) {
            $archive->addMediaFromRequest('document')->toMediaCollection('documents');
        }
        // Attach image if uploaded
        if ($request->hasFile('image')) {
            $archive->addMediaFromRequest('image')->toMediaCollection('images');
        }

        return redirect()->route('archives.index')
                        ->with('success', 'Archive created successfully!');
    }

    /**
     * Display the specified archive.
     */
    public function show(Archives $archive)
    {
        // Get media collections using Spatie MediaLibrary
        $documents = $archive->getMedia('documents');
        $images = $archive->getMedia('images');
        
        // Load related artifacts with pivot data
        $archive->load(['artifacts' => function ($query) {
            $query->withPivot(['relationship_type', 'notes', 'document_date', 'document_author', 'is_primary']);
        }]);
        
        return Inertia::render('Archive/Show', [
            'archive' => $archive,
            'documents' => $documents,
            'images' => $images,
        ]);
    }

    /**
     * Show the form for editing the specified archive.
     */
    public function edit(Archives $archive)
    {
        // Get media collections using Spatie MediaLibrary
        $documents = $archive->getMedia('documents');
        $images = $archive->getMedia('images');
        
        return Inertia::render('Archive/Edit', [
            'archive' => $archive,
            'documents' => $documents,
            'images' => $images,
        ]);
    }

    /**
     * Update the specified archive in storage.
     */
    public function update(Request $request, Archives $archive)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'documents.*' => 'nullable|file|mimes:pdf,doc,docx,txt,xlsx,xls,ppt,pptx|max:10240',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $archive->update([
            'title' => $request->title,
            'author' => $request->author,
            'category' => $request->category,
        ]);

        // Handle document uploads
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $document) {
                $archive->addMedia($document)
                    ->toMediaCollection('documents');
            }
        }

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $archive->addMedia($image)
                    ->toMediaCollection('images');
            }
        }

        return redirect()->route('archives.show', $archive)
            ->with('success', 'Archive updated successfully.');
    }

    /**
     * Remove the specified archive from storage.
     */
    public function destroy(Archives $archive)
    {
        // Delete the file from storage
        Storage::disk('public')->delete($archive->documentpath);
        
        // Delete the archive record
        $archive->delete();

        return redirect()->route('archives.index')
                        ->with('success', 'Archive deleted successfully!');
    }

    /**
     * Download the archive document.
     */
    public function download(Archives $archive)
    {
        $filePath = storage_path('app/public/' . $archive->documentpath);
        
        if (!file_exists($filePath)) {
            abort(404, 'File not found.');
        }

        return response()->download($filePath, $archive->title . '.' . $archive->file_extension);
    }
}