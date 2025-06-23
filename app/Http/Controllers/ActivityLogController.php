<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Activity::where('log_name', 'item')->with('causer');

        if ($request->filled('user_id')) {
            $query->where('causer_id', $request->user_id);
        }
        if ($request->filled('event')) {
            $query->where('description', $request->event);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderByDesc('created_at')->paginate(20)->withQueryString();
        $users = User::select('id', 'name')->get();
        $events = Activity::where('log_name', 'item')->select('description')->distinct()->pluck('description');

        return Inertia::render('activity-logs/index', [
            'logs' => $logs,
            'users' => $users,
            'events' => $events,
            'filters' => $request->only(['user_id', 'event', 'date_from', 'date_to'])
        ]);
    }
} 