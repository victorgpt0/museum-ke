<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\UserNotification;
use Illuminate\Http\Request;
use App\Models\ProjectProposal;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Project;

use Carbon\Carbon;
use Inertia\Inertia;


class ProjectProposalController extends Controller
{
    public function store(Request $request)
{
    // Validate incoming data
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'description' => 'required|string|max:3000', // contains all details
        'duration' => 'required|string|max:255',
        'documents.*' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,txt,png,jpg,jpeg,webp|max:10240', // 10MB max per file
    ]);

    if ($validator->fails()) {
        return back()->withErrors($validator)->withInput();
    }

    try {
        DB::beginTransaction();

        // Create the project proposal and store it in a variable
        $projectProposal = ProjectProposal::create([
            'title' => $request->title,
            'description' => $request->description,
            'duration' => $request->duration,
            'status' => 'pending',
            'submitted_at' => Carbon::now(),
            'approved_at' => null,
            'user_id' => auth()->user()->id
        ]);

        // Handle document uploads
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $index => $document) {
                $mime = $document->getMimeType();
                $ext = $document->getClientOriginalExtension();
                $imageMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
                $imageExtensions = ['png', 'jpg', 'jpeg', 'webp'];
                if (in_array($mime, $imageMimeTypes) || in_array(strtolower($ext), $imageExtensions)) {
                    $projectProposal->addMediaFromRequest("documents.{$index}")
                        ->toMediaCollection('project_proposal_images');
                } else{
                    $projectProposal->addMediaFromRequest("documents.{$index}")
                        ->toMediaCollection('project_proposal_documents');
                }
            }
        }

        DB::commit();

        return redirect()->back()->with('success', 'Proposal submitted successfully!');
    } catch (\Exception $e) {
        DB::rollBack();
        return back()->withErrors([
            'error' => 'Failed to submit proposal. Please try again.',
            'exception' => $e->getMessage(),
        ]);
    }
}
   public function index()
{
    try {
        $proposals = ProjectProposal::with('user')->orderBy('submitted_at', 'desc')->paginate(10); // eager load user
        // Transform proposals to include user name
        $proposals->getCollection()->transform(function ($proposal) {
            $proposal->user_name = $proposal->user ? $proposal->user->name : 'Unknown';
            return $proposal;
        });
        
        // Get current user's roles for authorization
        $user = auth()->user();
        $userRoles = $user ? $user->getRoleNames()->toArray() : [];
        $canApproveReject = $user && $user->hasRole(['SuperAdmin', 'HOD']);
        
        return Inertia::render('Project/proposal/ViewProposals', [
            'proposals' => $proposals,
            'userRoles' => $userRoles,
            'canApproveReject' => $canApproveReject
        ]);
    } catch (\Exception $e) {
        return back()->withErrors([
            'error' => 'Failed to retrieve project proposals.',
            'exception' => $e->getMessage(),
        ]);
    }
}
 public function approve(Request $request)
{
    // Check if user has permission to approve proposals
    if (!auth()->user()->hasRole(['SuperAdmin', 'HOD'])) {
        return back()->withErrors([
            'error' => 'You do not have permission to approve proposals.',
        ]);
    }

    try {
        $request->validate([
            'id' => 'required|integer|exists:project_proposals,id'
        ]);

        DB::beginTransaction();

        $proposal = ProjectProposal::findOrFail($request->id);

        // Update status to approved and set approved_at timestamp
        $proposal->update([
            'status' => 'approved',
            'approved_at' => Carbon::now()
        ]);

        // Create a new project from the approved proposal
        Project::create([
            'title' => $proposal->title,
            'description' => $proposal->description,
            'start_date' => Carbon::now(),
            'duration' => $proposal->duration,
            'project_proposal_id' => $proposal->id,
        ]);

        DB::commit();

        User::role(['HOD','SuperAdmin'])->each(function($user) use ($proposal){
            $user->notify(
                new UserNotification(
                    'success',
                    "Project Proposal Approved",
                    "$user->name has approved of a project titled: $proposal->title. Please follow the redirect to know more!",
                    route('proposals.show', $proposal->id),
                    $user->id
                ));
        });

        return back()->with('success', 'Proposal approved and project created successfully.');

    } catch (\Exception $e) {
        DB::rollBack();
        return back()->withErrors([
            'error' => 'Failed to approve proposal.',
            'exception' => $e->getMessage(),
        ]);
    }
}
    public function reject(Request $request)
    {
        // Check if user has permission to reject proposals
        if (!auth()->user()->hasRole(['SuperAdmin', 'HOD'])) {
            return back()->withErrors([
                'error' => 'You do not have permission to reject proposals.',
            ]);
        }

        try {
            $request->validate([
                'id' => 'required|integer|exists:project_proposals,id'
            ]);

            $proposal = ProjectProposal::findOrFail($request->id);

            // Update status to rejected (no approved_at timestamp needed)
            $proposal->update([
                'status' => 'rejected',
                'approved_at' =>Carbon::now()
            ]);

            User::role(['HOD','SuperAdmin'])->each(function($user) use ($proposal){
                $user->notify(
                    new UserNotification(
                        'error',
                        "Project Proposal Rejected",
                        "$user->name has rejected of a project titled: $proposal->title. Please follow the redirect to know more!",
                        route('proposals.show', $proposal->id),
                        $user->id
                    ));
            });

            return back()->with('success', 'Proposal rejected successfully.');

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to reject proposal.',
                'exception' => $e->getMessage(),
            ]);
        }
    }

    public function show($id)
    {
        $proposal = ProjectProposal::with('user')->findOrFail($id);
        $proposal->user_name = $proposal->user ? $proposal->user->name : 'Unknown';
        $proposal->all_documents_urls = $proposal->all_documents_urls;
        $proposal->all_image_urls = $proposal->all_image_urls;
        return Inertia::render('Project/proposal/proposal', [
            'proposal' => $proposal
        ]);
    }
}
