<?php

use App\Http\Controllers\AcquisitionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArtifactController;
use App\Http\Controllers\ArchivesController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ProjectProposalController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\MilestoneController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\FindingController;
use App\Http\Controllers\TeamMembersController;



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/landingpage', function () {
        return Inertia::render('theDashboard');
    })->name('landingpage');

    Route::prefix('acquisitions')
        ->controller(AcquisitionController::class)
        ->name('acquisitions.')
        ->group(function () {
            Route::get('/create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
        });
});


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);

    Route::prefix('notifications')
        ->controller(\App\Http\Controllers\NotificationController::class)
        ->name('notifications.')
        ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/{id}/read','markAsRead')->name('mark-as-read');
        Route::post('/read-all', 'markAllAsRead')->name('mark-all-as-read');
        Route::delete('/{id}', 'destroy')->name('destroy');
    });

    Route::resource('acquisitions', AcquisitionController::class)->except(['create', 'store']);
    Route::resource('artifacts', \App\Http\Controllers\ArtifactController::class);

    // Approve and reject artifact proposals
    Route::post('/acquisition/{artifactProposal}/approve', [AcquisitionController::class, 'approve'])->name('acquisitions.approve');
    Route::post('/acquisition/{artifactProposal}/reject', [AcquisitionController::class, 'reject'])->name('acquisitions.reject');

});

//Guest Routes

Route::get('/dashboard/new-artifact', [ArtifactController::class, 'create'])->name('artifact.create');

// In your web.php routes file
Route::get('/archives', [ArchivesController::class, 'index'])->name('archives.index');
Route::get('/archives/new-file', [ArchivesController::class, 'create'])->name('archives.create');
Route::post('/archives', [ArchivesController::class, 'store'])->name('archives.store');
// Existing routes...
Route::get('/archives/{archive}', [ArchivesController::class, 'show'])->name('archives.show');
Route::get('/archives/{archive}/edit', [ArchivesController::class, 'edit'])->name('archives.edit');
Route::put('/archives/{archive}', [ArchivesController::class, 'update'])->name('archives.update');
Route::delete('/archives/{archive}', [ArchivesController::class, 'destroy'])->name('archives.destroy');
Route::get('/archives/{archive}/download', [ArchivesController::class, 'download'])->name('archives.download');
Route::get('/map', function () {
    return Inertia::render('Map');
})->name('map');

Route::middleware('guest')->group(function () {
    Route::get('/curator/acquisition-portal', [DonationController::class, 'create'])->name('donations.create');
    Route::post('/curator/save', [DonationController::class, 'store'])->name('donations.store');
});


    // Display all donation proposals
    Route::get('/curator/acquisition-history', [DonationController::class, 'index'])->name('admin.donations.index');

    // Show specific donation proposal
    Route::get('/curator/acquisition-history/{artifactProposal}', [DonationController::class, 'show'])->name('admin.donations.show');

    // Update proposal status
    Route::patch('/curator/acquisition-history/status', [DonationController::class, 'updateStatus'])->name('admin.donations.update-status');

// Public donation form
Route::get('/donate', [DonationController::class, 'create'])->name('donations2.create');
Route::post('/donate', [DonationController::class, 'store'])->name('donations2.store');
// AI Page Route
Route::get('/ai', function () {
    return Inertia::render('AI');
})->middleware(['auth'])->name('ai');

// AI API Endpoint
Route::post('/api/ai/query', [App\Http\Controllers\AIController::class, 'query'])
    ->middleware(['auth'])
    ->name('ai.query');

//------PROJECT-------->
//proposals
Route::get('/project/all-projects', [ProjectController::class, 'showAll'])->name('project.all');
Route::get('/project/dashboard/{id}', [ProjectController::class, 'show'])->name('project.show');

Route::get('/project/new-proposal', function () {
    return Inertia::render('Project/proposal/new-proposal');
})->name('projectproposal.new');
Route::post('/project/saveproposal', [ProjectProposalController::class, 'store'])->name('projectproposal.store');
Route::get('/project/viewproposals', [ProjectProposalController::class, 'index'])->name('project.proposal.index');
Route::post('/project/proposal/approve', [ProjectProposalController::class, 'approve']);
Route::post('/project/proposal/reject', [ProjectProposalController::class, 'reject']);

Route::get('/projects/{project}/findings/create', [FindingController::class, 'create'])->name('findings.create');
Route::post('/projects/{project}/findings', [FindingController::class, 'store'])->name('findings.store');
Route::post('/projects/{project}/team-members', [TeamMembersController::class, 'store'])->name('findings.team-members');
Route::get('/projects/{project}/team-members/create', [TeamMembersController::class, 'create'])->name('findings.team-members.create');





// routes/web.php

// Milestone routes
// Change your milestone create route to include project parameter
Route::post('/projects/{project}/savemilestones', [MilestoneController::class, 'store'])->name('project.milestones.store');
Route::put('/milestones/{milestone}', [MilestoneController::class, 'update'])->name('milestones.update');
Route::get('/projects/{project}/milestones/create', [MilestoneController::class, 'create'])->name('project.milestones.create');

// Goal routes
Route::post('/goals', [GoalController::class, 'storeWithMilestone'])->name('goals.store');
Route::put('/goals/{goal:id}/save', [GoalController::class, 'update'])->name('goals.update');
Route::get('/projects/{project}/milestones/{milestone}', [MilestoneController::class, 'show'])->name('project.milestones.show');
Route::put('/projects/{project}/milestones/{milestone}/goals', [MilestoneController::class, 'updateGoals'])->name('project.milestones.update-goals');
Route::put('/projects/{project}/milestones/{milestone}/budget', [MilestoneController::class, 'updateBudget'])->name('project.milestones.update-budget');




Route::get('activity-logs', [App\Http\Controllers\ActivityLogController::class, 'index'])->name('activity-logs.index');

// Media Library Routes
Route::prefix('media-library')->name('media-library.')->group(function () {
    Route::get('/', [App\Http\Controllers\MediaLibraryController::class, 'index'])->name('index');
    Route::get('/type/{type}', [App\Http\Controllers\MediaLibraryController::class, 'byType'])->name('by-type');
    Route::get('/{id}', [App\Http\Controllers\MediaLibraryController::class, 'show'])->name('show');
    Route::get('/{id}/edit', [App\Http\Controllers\MediaLibraryController::class, 'edit'])->name('edit');
    Route::put('/{id}', [App\Http\Controllers\MediaLibraryController::class, 'update'])->name('update');
    Route::delete('/{id}', [App\Http\Controllers\MediaLibraryController::class, 'destroy'])->name('destroy');
    Route::get('/{id}/download', [App\Http\Controllers\MediaLibraryController::class, 'download'])->name('download');
    Route::get('/{id}/conversion/{conversion}', [App\Http\Controllers\MediaLibraryController::class, 'conversion'])->name('conversion');
    Route::post('/bulk-action', [App\Http\Controllers\MediaLibraryController::class, 'bulkAction'])->name('bulk-action');
    Route::get('/analytics', [App\Http\Controllers\MediaLibraryController::class, 'analytics'])->name('analytics');
    Route::get('/search', [App\Http\Controllers\MediaLibraryController::class, 'search'])->name('search');
});

Route::post('/project/{id}/complete', [ProjectController::class, 'markComplete'])->middleware(['auth'])->name('project.complete');

Route::get('/proposals/{id}', [App\Http\Controllers\ProjectProposalController::class, 'show'])->name('proposals.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
