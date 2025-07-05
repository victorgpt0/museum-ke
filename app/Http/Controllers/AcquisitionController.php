<?php

namespace App\Http\Controllers;

use App\Mail\DonorApprovalMail;
use App\Mail\DonorRejectionMail;
use App\Mail\DonorSubmissionMail;
use App\Models\ArtifactProposal;
use App\Models\Donor;
use App\Models\User;
use App\Notifications\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class AcquisitionController extends Controller implements HasMiddleware
{
    /**
     * Describe permissions for this Resource.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:acquisitions.view', only: ['index', 'show']),
            // new Middleware('permission:acquisitions.create', only: ['create', 'store']),
            new Middleware('permission:acquisitions.edit', only: ['edit', 'update', 'approve', 'reject']),
            new Middleware('permission:acquisitions.delete', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $proposals = ArtifactProposal::with(['donor', 'media'])
        ->latest()
        ->paginate(10);

        return Inertia::render('acquisitions/index', [
            'proposals' => $proposals
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

            // Send notification to curators and admins
            User::role(['Curator','SuperAdmin'])->each(function($user) use ($artifactProposal, $request){
                $user->notify(
                    new UserNotification(
                        'info',
                        "New Acquisition Proposal",
                        "$request->donor_full_name wishes to donate to the museum an item titled: $request->title. Please review the proposal and respond accordingly.",
                        route('acquisitions.show', $artifactProposal->id),
                        $user->id
                    ));
            });

            // Send confirmation email to donor
            Mail::to($donor->email)->send(new DonorSubmissionMail($artifactProposal));

            return to_route('home')->with('success','Acquisition Created Successfully');
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
        $artifactProposal = ArtifactProposal::with(['donor', 'media'])->findOrFail($id);

        return Inertia::render('acquisitions/show', [
            'proposal' => $artifactProposal
        ]);
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

    /**
     * Approve an artifact proposal
     */
    public function approve(ArtifactProposal $artifactProposal)
    {
        try {
            DB::beginTransaction();

            // Update status to approved
            $artifactProposal->update([
                'proposal_status' => 'approved'
            ]);

            DB::commit();

            // Send notification to curators and admins
            User::role(['Curator','SuperAdmin'])->each(function($user) use ($artifactProposal){
                $user->notify(
                    new UserNotification(
                        'success',
                        "Acquisition Proposal Approved",
                        "$user->name has approved of an acquisition titled: $artifactProposal->title. Please follow the redirect to know more!",
                        route('acquisitions.show', $artifactProposal->id),
                        $user->id
                    ));
            });

            // Send approval email to donor
            Mail::to($artifactProposal->donor->email)->send(new DonorApprovalMail($artifactProposal));

            return back()->with('success', 'Artifact proposal approved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Failed to approve proposal.',
                'exception' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Reject an artifact proposal
     */
    public function reject(ArtifactProposal $artifactProposal)
    {
        try {
            // Update status to rejected
            $artifactProposal->update([
                'proposal_status' => 'rejected'
            ]);

            // Send notification to curators and admins
            User::role(['Curator','SuperAdmin'])->each(function($user) use ($artifactProposal){
                $user->notify(
                    new UserNotification(
                        'error',
                        "Acquisition Proposal Rejected",
                        "$user->name has rejected of an acquisition titled: $artifactProposal->title. Please follow the redirect to know more!",
                        route('acquisitions.show', $artifactProposal->id),
                        $user->id
                    ));
            });

            // Send rejection email to donor
            Mail::to($artifactProposal->donor->email)->send(new DonorRejectionMail($artifactProposal));

            return back()->with('success', 'Artifact proposal rejected successfully.');

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to reject proposal.',
                'exception' => $e->getMessage(),
            ]);
        }
    }
}
