<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectProposal extends Model
{
    use HasFactory;

    protected $table = 'project_proposals';

    protected $fillable = [
        'title',
        'description',
        'duration',
        'status',
        'submitted_at',
        'approved_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
    ];
}
