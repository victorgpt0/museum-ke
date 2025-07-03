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
     * Display the specified Archives.
     */
    public function show(Archives $archive)
    {
        $documentUrls = $archive->getMedia('documents')->map(function ($media) {
            return [
                'url' => $media->getUrl(),
                'name' => $media->name,
                'file_name' => $media->file_name,
            ];
        });
        $imageUrls = $archive->getMedia('images')->map(function ($media) {
            return [
                'url' => $media->getUrl(),
                'name' => $media->name,
                'file_name' => $media->file_name,
            ];
        });
        return Inertia::render('Archive/Show', [
            'archive' => $archive,
            'documentUrls' => $documentUrls,
            'imageUrls' => $imageUrls,
        ]);
    }

    /**
     * Show the form for editing the specified archive.
     */
    public function edit(Archives $archive)
    {
        $categories = Category::all();
        
        return Inertia::render('Archive/Edit', [
            'archive' => $archive,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified archive in storage.
     */
    public function update(Request $request, Archives $archive)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'document' => 'nullable|file|mimes:pdf,doc,docx,txt,xlsx,xls,ppt,pptx|max:10240',
        ]);

        // If a new document is uploaded, store it and delete the old one
        if ($request->hasFile('document')) {
            // Delete old file
            Storage::disk('public')->delete($archive->documentpath);
            
            // Store new file
            $validated['documentpath'] = $request->file('document')->store('archives', 'public');
        }

        $archive->update($validated);

        return redirect()->route('archives.index')
                        ->with('success', 'Archive updated successfully!');
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