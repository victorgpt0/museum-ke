<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Finding;

class FindingController extends Controller
{
    public function create(Project $project)
    {
        return Inertia::render('Project/Milestones/create-findings', [
            'project' => $project,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        Log::info('=== FINDING STORE START ===');
        Log::info('Project ID: ' . $project->id);
        Log::info('Request method: ' . $request->method());
        Log::info('Content-Type: ' . $request->header('Content-Type'));
        
        // Debug request data
        Log::info('All request data:', $request->all());
        Log::info('Has files: ' . ($request->hasFile('documents') ? 'YES' : 'NO'));
        
        if ($request->hasFile('documents')) {
            Log::info('Files count: ' . count($request->file('documents')));
            foreach ($request->file('documents') as $index => $file) {
                Log::info("File {$index}: " . $file->getClientOriginalName() . 
                         ' | Size: ' . $file->getSize() . 
                         ' | MIME: ' . $file->getMimeType());
            }
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'documents' => 'nullable|array',
            'documents.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return back()->withErrors($validator)->withInput();
        }

        Log::info('Validation passed');

        try {
            Log::info('Starting database transaction');
            DB::beginTransaction();

            // Debug finding creation
            $findingData = [
                'title' => $request->title,
                'description' => $request->description,
                'submitted_at' => now(),
            ];
            Log::info('Creating finding with data:', $findingData);

            $finding = $project->findings()->create($findingData);
            Log::info('Finding created with ID: ' . $finding->id);

            if ($request->hasFile('documents')) {
                Log::info('Processing ' . count($request->file('documents')) . ' documents');
                
                foreach ($request->file('documents') as $index => $document) {
                    Log::info("Processing document {$index}: " . $document->getClientOriginalName());
                    
                    try {
                        $mime = $document->getMimeType();
                        $ext = $document->getClientOriginalExtension();
                        Log::info("Document {$index} - MIME: {$mime}, Extension: {$ext}");
                        
                        $imageMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
                        $imageExtensions = ['png', 'jpg', 'jpeg'];

                        $isImage = in_array($mime, $imageMimeTypes) || in_array(strtolower($ext), $imageExtensions);
                        $collection = $isImage ? 'finding_images' : 'finding_documents';
                        
                        Log::info("Document {$index} - Is Image: " . ($isImage ? 'YES' : 'NO') . ", Collection: {$collection}");
                        Log::info("Adding media from request key: documents.{$index}");

                        $mediaItem = $finding->addMediaFromRequest("documents.{$index}")
                                           ->toMediaCollection($collection);
                        
                        Log::info("Media item created with ID: " . $mediaItem->id);
                        
                    } catch (\Exception $mediaException) {
                        Log::error("Media upload failed for document {$index}: " . $mediaException->getMessage());
                        Log::error("Media exception trace: " . $mediaException->getTraceAsString());
                        throw $mediaException;
                    }
                }
            } else {
                Log::info('No documents to process');
            }

            Log::info('Committing transaction');
            DB::commit();
            
            Log::info('Finding created successfully');
            return redirect()->back()->with('success', 'Finding created successfully');

        } catch (\Exception $e) {
            Log::error('=== EXCEPTION CAUGHT ===');
            Log::error('Exception type: ' . get_class($e));
            Log::error('Exception message: ' . $e->getMessage());
            Log::error('Exception file: ' . $e->getFile() . ':' . $e->getLine());
            Log::error('Exception trace: ' . $e->getTraceAsString());
            
            DB::rollBack();
            Log::info('Transaction rolled back');
            
            return back()->withErrors(['error' => 'Failed to create finding. Please try again. Error: ' . $e->getMessage()]);
        } finally {
            Log::info('=== FINDING STORE END ===');
        }
    }
}