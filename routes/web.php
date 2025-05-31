<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArtifactController;
use App\Http\Controllers\ArchivesController;



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

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
// AI Page Route
Route::get('/ai', function () {
    return Inertia::render('AI');
})->middleware(['auth'])->name('ai');

// AI API Endpoint
Route::post('/api/ai/query', [App\Http\Controllers\AIController::class, 'query'])
    ->middleware(['auth'])
    ->name('ai.query');
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
