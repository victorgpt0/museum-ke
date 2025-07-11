<?php

namespace App\Http\Controllers;

use App\Models\Artifact;
use App\Models\ArtifactProposal;
use App\Models\Project;
use App\Models\ProjectProposal;
use App\Models\User;
use App\Models\Archives;
use App\Models\Milestone;
use App\Models\Goals;
use App\Models\Finding;
use App\Models\TeamMember;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with permission-based data.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();

        $dashboardData = [
            'stats' => $this->getStats($userPermissions),
            'recentActivities' => $this->getRecentActivities($userPermissions),
            'quickActions' => $this->getQuickActions($userPermissions),
            'recentArtifacts' => $this->getRecentArtifacts($userPermissions),
            'recentAcquisitions' => $this->getRecentAcquisitions($userPermissions),
            'activeProjects' => $this->getActiveProjects($userPermissions),
            'pendingProposals' => $this->getPendingProposals($userPermissions),
            'upcomingMilestones' => $this->getUpcomingMilestones($userPermissions),
            'recentFindings' => $this->getRecentFindings($userPermissions),
            'budgetOverview' => $this->getBudgetOverview($userPermissions),
            'userRole' => $this->getUserRole($user),
            'permissions' => $userPermissions,
        ];

        return Inertia::render('dashboard', $dashboardData);
    }

    /**
     * Get dashboard statistics based on user permissions.
     */
    private function getStats(array $permissions): array
    {
        $stats = [];

        // Artifacts stats
        if (in_array('artifacts.view', $permissions)) {
            $stats['totalArtifacts'] = Artifact::count();
            $stats['artifactsThisMonth'] = Artifact::whereMonth('created_at', now()->month)->count();
//            $stats['artifactsByCondition'] = Artifact::groupBy('condition')
//                ->selectRaw('condition, count(*) as count')
//                ->get();
        }

        // Acquisitions stats
        if (in_array('acquisitions.view', $permissions)) {
            $stats['pendingDonations'] = ArtifactProposal::where('proposal_status', 'pending')->count();
            $stats['approvedDonations'] = ArtifactProposal::where('proposal_status', 'approved')->count();
            $stats['recentAcquisitions'] = ArtifactProposal::where('proposal_status', 'approved')
                ->whereDate('created_at', '>=', now()->subDays(30))
                ->count();
        }

        // Projects stats
        if (in_array('projects.view', $permissions)) {
            $stats['activeProjects'] = Project::where('completed', false)->count();
            $stats['completedProjects'] = Project::where('completed', true)->count();
            $stats['totalProjects'] = Project::count();
        }

        // Users stats
        if (in_array('users.view', $permissions)) {
            $stats['totalUsers'] = User::count();
            $stats['activeUsers'] = User::count(); // All users are considered active for now
        }

        // Archives stats
        if (in_array('archives.view', $permissions)) {
            $stats['totalArchives'] = Archives::count();
            $stats['archivesThisMonth'] = Archives::whereMonth('created_at', now()->month)->count();
        }

        // Proposals stats
        if (in_array('proposals.view', $permissions)) {
            $stats['pendingProposals'] = ProjectProposal::where('status', 'pending')->count();
            $stats['approvedProposals'] = ProjectProposal::where('status', 'approved')->count();
        }

        return $stats;
    }

    /**
     * Get recent activities based on user permissions.
     */
    private function getRecentActivities(array $permissions): array
    {
        $activities = [];

        if (in_array('logs.view', $permissions)) {
            $activities = Activity::with('causer', 'subject')
                ->latest()
                ->take(10)
                ->get()
                ->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'description' => $activity->description,
                        'causer_name' => $activity->causer?->name ?? 'System',
                        'subject_type' => class_basename($activity->subject_type ?? ''),
                        'created_at' => $activity->created_at->diffForHumans(),
                        'properties' => $activity->properties,
                    ];
                })
                ->toArray();
        }

        return $activities;
    }

    /**
     * Get quick actions based on user permissions.
     */
    private function getQuickActions(array $permissions): array
    {
        $actions = [];

        if (in_array('artifacts.create', $permissions)) {
            $actions[] = [
                'title' => 'Add Artifact',
                'description' => 'Register a new artifact',
                'icon' => 'Plus',
                'route' => route('artifacts.create'),
                'color' => 'blue',
            ];
        }

        if (in_array('archives.create', $permissions)) {
            $actions[] = [
                'title' => 'Upload Archive',
                'description' => 'Add new archive file',
                'icon' => 'FileText',
                'route' => route('archives.create'),
                'color' => 'green',
            ];
        }

        if (in_array('projects.create', $permissions)) {
            $actions[] = [
                'title' => 'Create Project',
                'description' => 'Start a new project',
                'icon' => 'FolderOpen',
                'route' => route('projectproposal.new'),
                'color' => 'purple',
            ];
        }

        if (in_array('acquisitions.create', $permissions)) {
            $actions[] = [
                'title' => 'New Acquisition',
                'description' => 'Process acquisition',
                'icon' => 'Package',
                'route' => route('acquisitions.create'),
                'color' => 'orange',
            ];
        }

        if (in_array('users.create', $permissions)) {
            $actions[] = [
                'title' => 'Add User',
                'description' => 'Create new user account',
                'icon' => 'UserPlus',
                'route' => route('users.create'),
                'color' => 'indigo',
            ];
        }

        return $actions;
    }

    /**
     * Get recent artifacts based on user permissions.
     */
    private function getRecentArtifacts(array $permissions): array
    {
        if (!in_array('artifacts.view', $permissions)) {
            return [];
        }

        return Artifact::with(['category', 'donor'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($artifact) {
                return [
                    'id' => $artifact->id,
                    'title' => $artifact->title,
                    'category' => $artifact->category?->title,
                    'donor' => $artifact->donor?->fullname,
                    'condition' => $artifact->condition,
                    'created_at' => $artifact->created_at->diffForHumans(),
                    'route' => route('artifacts.show', $artifact->id),
                ];
            })
            ->toArray();
    }

    /**
     * Get recent acquisitions based on user permissions.
     */
    private function getRecentAcquisitions(array $permissions): array
    {
        if (!in_array('acquisitions.view', $permissions)) {
            return [];
        }

        return ArtifactProposal::with('donor')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($proposal) {
                return [
                    'id' => $proposal->id,
                    'title' => $proposal->title,
                    'donor' => $proposal->donor?->fullname,
                    'status' => $proposal->proposal_status,
                    'created_at' => $proposal->created_at->diffForHumans(),
                    'route' => route('acquisitions.show', $proposal->id),
                ];
            })
            ->toArray();
    }

    /**
     * Get active projects based on user permissions.
     */
    private function getActiveProjects(array $permissions): array
    {
        if (!in_array('projects.view', $permissions)) {
            return [];
        }

        return Project::with(['milestones.goals', 'teamMembers'])
            ->where('completed', false)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'description' => $project->description,
                    'progress' => $this->calculateProjectProgress($project),
                    'team_count' => $project->teamMembers->count(),
                    'milestone_count' => $project->milestones->count(),
                    'created_at' => $project->created_at->diffForHumans(),
                    'route' => route('project.show', $project->id),
                ];
            })
            ->toArray();
    }

    /**
     * Get pending proposals based on user permissions.
     */
    private function getPendingProposals(array $permissions): array
    {
        if (!in_array('proposals.view', $permissions)) {
            return [];
        }

        return ProjectProposal::with('user')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($proposal) {
                return [
                    'id' => $proposal->id,
                    'title' => $proposal->title,
                    'proposer' => $proposal->user?->name,
                    'created_at' => $proposal->created_at->diffForHumans(),
                    'route' => route('proposals.show', $proposal->id),
                ];
            })
            ->toArray();
    }

    /**
     * Get upcoming milestones based on user permissions.
     */
    private function getUpcomingMilestones(array $permissions): array
    {
        if (!in_array('projects.view', $permissions)) {
            return [];
        }

        return Milestone::with('project')
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays(30))
            ->orderBy('due_date')
            ->take(5)
            ->get()
            ->map(function ($milestone) {
                return [
                    'id' => $milestone->id,
                    'title' => $milestone->title,
                    'project' => $milestone->project?->title,
                    'due_date' => $milestone->due_date->format('M d, Y'),
                    'days_remaining' => now()->diffInDays($milestone->due_date, false),
                    'route' => route('project.milestones.show', [$milestone->project_id, $milestone->id]),
                ];
            })
            ->toArray();
    }

    /**
     * Get recent findings based on user permissions.
     */
    private function getRecentFindings(array $permissions): array
    {
        if (!in_array('projects.view', $permissions)) {
            return [];
        }

        return Finding::with('project')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($finding) {
                return [
                    'id' => $finding->id,
                    'title' => $finding->title,
                    'project' => $finding->project?->title,
                    'created_at' => $finding->created_at->diffForHumans(),
                    'route' => route('project.show', $finding->project_id),
                ];
            })
            ->toArray();
    }

    /**
     * Get budget overview based on user permissions.
     */
    private function getBudgetOverview(array $permissions): array
    {
        if (!in_array('projects.view', $permissions)) {
            return [];
        }

        $budgets = Budget::with('milestone.project')->get();

        $totalBudget = $budgets->sum('amount');
        $totalSpent = $budgets->sum('amount_spent');
        $remainingBudget = $totalBudget - $totalSpent;

        return [
            'total_budget' => $totalBudget,
            'total_spent' => $totalSpent,
            'remaining_budget' => $remainingBudget,
            'spent_percentage' => $totalBudget > 0 ? round(($totalSpent / $totalBudget) * 100, 2) : 0,
            'projects_with_budget' => $budgets->count(),
        ];
    }

    /**
     * Get user role information.
     */
    private function getUserRole($user): string
    {
        $role = $user->roles->first();
        return $role ? $role->name : 'User';
    }

    /**
     * Calculate project progress based on completed goals.
     */
    private function calculateProjectProgress($project): int
    {
        $totalGoals = 0;
        $completedGoals = 0;

        // Count all goals and completed goals across all milestones
        foreach ($project->milestones as $milestone) {
            $totalGoals += $milestone->goals->count();
            $completedGoals += $milestone->goals->where('completed', true)->count();
        }

        if ($totalGoals === 0) {
            return 0;
        }

        return round(($completedGoals / $totalGoals) * 100);
    }
}
