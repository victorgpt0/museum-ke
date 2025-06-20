<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goals extends Model
{
    protected $fillable = ['title', 'performance', 'description', 'milestone_id'];

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }
}
