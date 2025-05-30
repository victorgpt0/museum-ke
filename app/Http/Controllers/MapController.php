<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        return Inertia::render('Map', [
            'mapType' => 'all'
        ]);
    }

    public function museums()
    {
        return Inertia::render('Map', [
            'mapType' => 'museums'
        ]);
    }
}