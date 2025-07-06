<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\MediaCollections\Models\MediaCollection;
use Spatie\MediaLibrary\Conversions\Conversion;
use Spatie\MediaLibrary\Conversions\ConversionCollection;
use Spatie\MediaLibrary\MediaCollections\FileAdder;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection as MediaCollectionModel;

class MediaLibraryController extends Controller
{
    /**
     * Display the media library index with filtering and search.
     */
    public function index(Request $request)
    {
        $query = Media::query();

        // Apply filters
        if ($request->filled('collection')) {
            $query->where('collection_name', $request->collection);
        }

        if ($request->filled('type')) {
            $query->where('mime_type', 'like', $request->type . '%');
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('file_name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Get media with pagination
        $media = $query->with('model')
            ->orderBy('created_at', 'desc')
            ->paginate(24)
            ->withQueryString();

        // Get collections for filter
        $collections = Media::select('collection_name')
            ->distinct()
            ->whereNotNull('collection_name')
            ->pluck('collection_name');

        // Get media types for filter
        $mediaTypes = Media::select('mime_type')
            ->distinct()
            ->get()
            ->map(function ($media) {
                return explode('/', $media->mime_type)[0];
            })
            ->unique()
            ->values();



        // Get statistics
        $stats = [
            'total' => Media::count(),
            'images' => Media::where('mime_type', 'like', 'image/%')->count(),
            'videos' => Media::where('mime_type', 'like', 'video/%')->count(),
            'documents' => Media::where('mime_type', 'like', 'application/%')->count(),
            'audio' => Media::where('mime_type', 'like', 'audio/%')->count(),
            'total_size' => Media::sum('size'),
        ];

        return Inertia::render('media-library/index', [
            'media' => $media,
            'collections' => $collections,
            'mediaTypes' => $mediaTypes,
            'stats' => $stats,
            'filters' => $request->only(['collection', 'type', 'search', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the media library by type (images, videos, documents, etc.).
     */
    public function byType(Request $request, $type)
    {
        $query = Media::query();

        // Filter by media type
        switch ($type) {
            case 'images':
                $query->where('mime_type', 'like', 'image/%');
                break;
            case 'videos':
                $query->where('mime_type', 'like', 'video/%');
                break;
            case 'documents':
                $query->where('mime_type', 'like', 'application/%');
                break;
            case 'audio':
                $query->where('mime_type', 'like', 'audio/%');
                break;
            case 'archives':
                $query->where('mime_type', 'like', 'application/zip%')
                      ->orWhere('mime_type', 'like', 'application/x-rar%')
                      ->orWhere('mime_type', 'like', 'application/x-7z%');
                break;
            default:
                return redirect()->route('media-library.index');
        }

        // Apply additional filters
        if ($request->filled('collection')) {
            $query->where('collection_name', $request->collection);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('file_name', 'like', '%' . $request->search . '%');
        }

        $media = $query->with('model')
            ->orderBy('created_at', 'desc')
            ->paginate(24)
            ->withQueryString();

        // Get collections for this type
        $collections = Media::select('collection_name')
            ->distinct()
            ->whereNotNull('collection_name')
            ->where('mime_type', 'like', $this->getMimeTypePattern($type))
            ->pluck('collection_name');

        return Inertia::render('media-library/by-type', [
            'media' => $media,
            'type' => $type,
            'collections' => $collections,
            'filters' => $request->only(['collection', 'search']),
        ]);
    }

    /**
     * Show a specific media item with details and conversions.
     */
    public function show($id)
    {
        $media = Media::with('model')->findOrFail($id);

        // Get available conversions
        $conversions = $media->getMediaConversionNames();

        // Get related media from same collection
        $relatedMedia = Media::where('collection_name', $media->collection_name)
            ->where('id', '!=', $media->id)
            ->limit(6)
            ->get();

        return Inertia::render('media-library/show', [
            'media' => $media,
            'conversions' => $conversions,
            'relatedMedia' => $relatedMedia,
        ]);
    }

    /**
     * Show the form for editing media metadata.
     */
    public function edit($id)
    {
        $media = Media::with('model')->findOrFail($id);

        // Get available collections
        $collections = Media::select('collection_name')
            ->distinct()
            ->whereNotNull('collection_name')
            ->pluck('collection_name');

        return Inertia::render('media-library/edit', [
            'media' => $media,
            'collections' => $collections,
        ]);
    }

    /**
     * Update media metadata.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'collection_name' => 'nullable|string|max:255',
            'custom_properties' => 'nullable|array',
        ]);

        $media = Media::findOrFail($id);

        $media->update([
            'name' => $request->name,
            'collection_name' => $request->collection_name,
            'custom_properties' => $request->custom_properties ?? [],
        ]);

        return redirect()->route('media-library.show', $media->id)
            ->with('success', 'Media updated successfully.');
    }

    /**
     * Delete a media item.
     */
    public function destroy($id)
    {
        $media = Media::findOrFail($id);
        $media->delete();

        return redirect()->route('media-library.index')
            ->with('success', 'Media deleted successfully.');
    }

    /**
     * Download a media file.
     */
    public function download($id)
    {
        $media = Media::findOrFail($id);

        return response()->download($media->getPath(), $media->file_name);
    }

    /**
     * Get media conversions (thumbnails, etc.).
     */
    public function conversion($id, $conversionName)
    {
        $media = Media::findOrFail($id);

        if (!$media->hasGeneratedConversion($conversionName)) {
            $media->generateConversion($conversionName);
        }

        return response()->file($media->getPath($conversionName));
    }

    /**
     * Bulk operations on media items.
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,move,download',
            'media_ids' => 'required|array',
            'media_ids.*' => 'exists:media,id',
        ]);

        $mediaIds = $request->media_ids;
        $action = $request->action;

        switch ($action) {
            case 'delete':
                Media::whereIn('id', $mediaIds)->delete();
                $message = 'Selected media items deleted successfully.';
                break;

            case 'move':
                $request->validate(['collection_name' => 'required|string']);
                Media::whereIn('id', $mediaIds)
                    ->update(['collection_name' => $request->collection_name]);
                $message = 'Selected media items moved successfully.';
                break;

            case 'download':
                // Create a zip file for download
                $zipPath = $this->createZipForDownload($mediaIds);
                return response()->download($zipPath)->deleteFileAfterSend();
        }

        return back()->with('success', $message);
    }

    /**
     * Get media statistics and analytics.
     */
    public function analytics()
    {
        $stats = [
            'total' => Media::count(),
            'by_type' => Media::select('mime_type')
                ->get()
                ->groupBy(function ($media) {
                    return explode('/', $media->mime_type)[0];
                })
                ->map(function ($group, $type) {
                    return [
                        'type' => $type,
                        'count' => $group->count()
                    ];
                })
                ->values(),

            'by_collection' => Media::select('collection_name')
                ->whereNotNull('collection_name')
                ->get()
                ->groupBy('collection_name')
                ->map(function ($group, $collection) {
                    return [
                        'collection_name' => $collection,
                        'count' => $group->count()
                    ];
                })
                ->sortByDesc('count')
                ->take(10)
                ->values(),

            'by_month' => Media::select('created_at')
                ->get()
                ->groupBy(function ($media) {
                    return $media->created_at->format('Y-m');
                })
                ->map(function ($group, $month) {
                    return [
                        'month' => $month,
                        'count' => $group->count()
                    ];
                })
                ->sortByDesc('month')
                ->take(12)
                ->values(),
            'total_size' => Media::sum('size'),
            'average_size' => Media::avg('size'),
        ];

        return Inertia::render('media-library/analytics', [
            'stats' => $stats,
        ]);
    }

    /**
     * Search media items.
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');

        $media = Media::where('name', 'like', "%{$query}%")
            ->orWhere('file_name', 'like', "%{$query}%")
            ->orWhere('collection_name', 'like', "%{$query}%")
            ->with('model')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($media);
    }

    /**
     * Get MIME type pattern for media type.
     */
    private function getMimeTypePattern($type)
    {
        $patterns = [
            'images' => 'image/%',
            'videos' => 'video/%',
            'documents' => 'application/%',
            'audio' => 'audio/%',
            'archives' => 'application/zip%',
        ];

        return $patterns[$type] ?? '%';
    }

    /**
     * Create a zip file for bulk download.
     */
    private function createZipForDownload($mediaIds)
    {
        $zip = new \ZipArchive();
        $zipPath = storage_path('app/temp/media_download_' . time() . '.zip');

        $zip->open($zipPath, \ZipArchive::CREATE);

        foreach ($mediaIds as $mediaId) {
            $media = Media::find($mediaId);
            if ($media && Storage::disk($media->disk)->exists($media->getPath())) {
                $zip->addFromString($media->file_name, Storage::disk($media->disk)->get($media->getPath()));
            }
        }

        $zip->close();

        return $zipPath;
    }
}
