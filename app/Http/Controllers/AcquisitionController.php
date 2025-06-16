<?php

namespace App\Http\Controllers;

use App\Models\ArtifactProposal;
use App\Models\Donor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AcquisitionController extends Controller implements HasMiddleware
{
    /**
     * Describe permissions for this Resource.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:acquisitions.view', only: ['index', 'show']),
            new Middleware('permission:acquisitions.create', only: ['create', 'store']),
            new Middleware('permission:acquisitions.edit', only: ['edit', 'update']),
            new Middleware('permission:acquisitions.delete', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('acquisitions/index', [
            'acquisitions' => ArtifactProposal::with('donor')
                ->paginate(request('perPage', 10))
                ->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('acquisitions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Donation proposal submitted',[$request->all()]);

        Log::info('images',[$request->allFiles()]);

        $validator = Validator::make($request->all(), [
            // Artifact information
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'source' => 'required|string|max:500',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max per image

            // Donor information
            'donor_full_name' => 'required|string|max:255',
            'donor_email' => 'required|email|max:255',
            'donor_phone' => 'required|string|max:20',

            // Next of kin information (optional)
            'next_of_kin_name' => 'nullable|string|max:255',
            'next_of_kin_email' => 'nullable|email|max:255',
            'next_of_kin_phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors($validator);
        }

        try {
            DB::beginTransaction();
            // Create or find donor
            $donor = $this->createOrUpdateDonor($request);

            // Create artifact proposal
            $artifactProposal = ArtifactProposal::create([
                'title' => $request->title,
                'description' => $request->description,
                'source' => $request->source,
                'donor_id' => $donor->id,
                'proposal_status' => 'pending'
            ]);

            // Handle image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $artifactProposal->addMediaFromRequest("images.{$index}")
                        ->toMediaCollection('artifact_images');
                }
            }

            DB::commit();

            return to_route('acquisitions.index')->with('success','Acquisition Created Successfully');
        } catch (\Exception $exception){
            Log::error('Acquisition Create Error:',[$exception]);
            return redirect()->back()->with('error','Something went wrong');
        }
    }

    private function createOrUpdateDonor(Request $request)
    {
        // Check if donor already exists by email
        $donor = Donor::where('email', $request->donor_email)->first();

        if ($donor) {
            // Update existing donor with new information
            $donor->update([
                'fullname' => $request->donor_full_name,
                'contact' => $request->donor_phone,
                'next_of_kin_fullname' => $request->next_of_kin_name,
                'next_of_kin_email' => $request->next_of_kin_email,
                'next_of_kin_contact' => $request->next_of_kin_phone,
            ]);
        } else {
            // Create new donor
            $donor = Donor::create([
                'fullname' => $request->donor_full_name,
                'email' => $request->donor_email,
                'contact' => $request->donor_phone,
                'next_of_kin_fullname' => $request->next_of_kin_name,
                'next_of_kin_email' => $request->next_of_kin_email,
                'next_of_kin_contact' => $request->next_of_kin_phone,
            ]);
        }

        return $donor;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
