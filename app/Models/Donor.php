<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    use HasFactory;

    protected $fillable = [
        'fullname', 
        'contact', 
        'email',
        'next_of_kin_fullname', 
        'next_of_kin_email', 
        'next_of_kin_contact'
    ];

    public function artifactProposals()
    {
        return $this->hasMany(ArtifactProposal::class);
    }
}