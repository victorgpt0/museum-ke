<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectProposal;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
}
