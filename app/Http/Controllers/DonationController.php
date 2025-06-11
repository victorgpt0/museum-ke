<?php

namespace App\Http\Controllers;

use App\Models\Donor;
use App\Models\ArtifactProposal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class DonationController extends Controller
{
    /**
     * Show the donation form
     */
    public function create()
    {
        return Inertia::render('curator/acquisition-portal');
    }

    /**
     * Store a new donation proposal
     */
    public function store(Request $request)
    {
        // Validate the request
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
            return back()->withErrors($validator)->withInput();
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
                foreach ($request->file('images') as $image) {
                    $artifactProposal->addMediaFromRequest('images')
                        ->each(function ($fileAdder) {
                            $fileAdder->toMediaCollection('artifact_images');
                        });
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Your artifact donation proposal has been submitted successfully! We will review it and contact you soon.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'submission' => 'There was an error submitting your proposal. Please try again.'
            ])->withInput();
        }
    }

    /**
     * Create or update donor information
     */
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
     * Show all donation proposals (admin view)
     */
    public function index()
    {
        $proposals = ArtifactProposal::with(['donor', 'media'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/DonationProposals', [
            'proposals' => $proposals
        ]);
    }

    /**
     * Show a specific donation proposal
     */
    public function show(ArtifactProposal $artifactProposal)
    {
        $artifactProposal->load(['donor', 'media']);

        return Inertia::render('Admin/DonationProposalDetail', [
            'proposal' => $artifactProposal
        ]);
    }

    /**
     * Update proposal status
     */
    public function updateStatus(Request $request, ArtifactProposal $artifactProposal)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected,under_review'
        ]);

        $artifactProposal->update([
            'proposal_status' => $request->status
        ]);

        return back()->with('success', 'Proposal status updated successfully.');
    }
}