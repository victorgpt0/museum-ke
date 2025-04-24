<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArtifactController;


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

Route::get('/map', function () {
    return Inertia::render('Map');
})->name('map');
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
