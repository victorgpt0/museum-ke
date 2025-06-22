<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goals extends Model
{
    protected $fillable = ['title', 'performance', 'description', 'comments', 'milestone_id', 'completed'];
    
    protected $casts = [
        'performance' => 'integer',
        'completed' => 'boolean',
    ];

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }
    
    public function setPerformanceIndicatorAttribute($value)
    {
        $this->attributes['performance'] = $value === null ? 
            null : 
            max(1, min(10, (int)$value));
    }
}
