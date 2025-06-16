<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectProposal;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
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
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::beginTransaction();

            ProjectProposal::create([
                'title' => $request->title,
                'description' => $request->description,
                'duration' => $request->duration,
                'status' => 'pending',
                'submitted_at' => Carbon::now(),
                'approved_at' => null,
            ]);

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
        $proposals = ProjectProposal::orderBy('submitted_at', 'desc')->paginate(10); // optional: use paginate

        return Inertia::render('Project/proposal/ViewProposals', [
            'proposals' => $proposals
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
        try {
            $request->validate([
                'id' => 'required|integer|exists:project_proposals,id'
            ]);

            $proposal = ProjectProposal::findOrFail($request->id);
            
            // Update status to approved and set approved_at timestamp
            $proposal->update([
                'status' => 'approved',
                'approved_at' => Carbon::now()
            ]);

            return back()->with('success', 'Proposal approved successfully.');
            
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to approve proposal.',
                'exception' => $e->getMessage(),
            ]);
        }
    }

    public function reject(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|integer|exists:project_proposals,id'
            ]);

            $proposal = ProjectProposal::findOrFail($request->id);
            
            // Update status to rejected (no approved_at timestamp needed)
            $proposal->update([
                'status' => 'rejected',
                'approved_at' => null // Clear approved_at if it was previously set
            ]);

            return back()->with('success', 'Proposal rejected successfully.');
            
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to reject proposal.',
                'exception' => $e->getMessage(),
            ]);
        }
    }
}
