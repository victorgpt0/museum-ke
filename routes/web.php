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
 




Route::middleware('guest')->group(function () {

    Route::prefix('acquisitions')
        ->controller(AcquisitionController::class)
        ->name('acquisitions.')
        ->group(function () {
            Route::get('/create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
        });

    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');
});


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

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

});

//Guest Routes

Route::get('/artifacts', [ArtifactController::class, 'index']);
Route::get('/artifacts/category/{categoryId}', [ArtifactController::class, 'byCategory']);
Route::get('/artifacts/{id}', [ArtifactController::class, 'show']);

Route::get('/dashboard/new-artifact', [ArtifactController::class, 'create'])->name('artifacts.create');
Route::post('/artifacts', [ArtifactController::class, 'store'])->name('artifacts.store');

// In your web.php routes file
Route::get('/archives', [ArchivesController::class, 'index'])->name('archives.index');
Route::get('/archives/new-file', [ArchivesController::class, 'create'])->name('archives.create');
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
Route::get('/project/dashboard', [ProjectController::class, 'index'])->name('project.index');

Route::get('/project/new-proposal', function () {
    return Inertia::render('Project/proposal/new-proposal');
});
Route::post('/project/saveproposal', [ProjectProposalController::class, 'store'])->name('projectproposal.store');
Route::get('/project/viewproposals', [ProjectProposalController::class, 'index'])->name('project.proposal.index');
Route::post('/project/proposal/approve', [ProjectProposalController::class, 'approve']);
Route::post('/project/proposal/reject', [ProjectProposalController::class, 'reject']);

Route::get('/projects/{project}/findings/create', [FindingController::class, 'create'])->name('findings.create');
Route::post('/projects/{project}/findings', [FindingController::class, 'store'])->name('findings.store');
Route::post('/projects/{project}/team-members', [TeamMembersController::class, 'store'])->name('findings.create');
Route::get('/projects/{project}/team-members/create', [TeamMembersController::class, 'create'])->name('findings.create');





// routes/web.php

// Milestone routes
// Change your milestone create route to include project parameter
Route::get('/projects/{project}/milestones/create', [MilestoneController::class, 'create'])->name('project.milestones.create');
Route::post('/projects/{project}/savemilestones', [MilestoneController::class, 'store'])->name('project.milestones.store');
Route::put('/milestones/{milestone}', [MilestoneController::class, 'update'])->name('milestones.update');

// Goal routes
Route::post('/goals', [GoalController::class, 'storeWithMilestone'])->name('goals.store');
Route::put('/goals/{goal:id}/save', [GoalController::class, 'update'])->name('goals.update');
Route::get('/projects/{project}/milestones/{milestone}', [MilestoneController::class, 'show'])->name('project.milestones.show');
Route::put('/projects/{project}/milestones/{milestone}/goals', [MilestoneController::class, 'updateGoals'])->name('project.milestones.update-goals');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
