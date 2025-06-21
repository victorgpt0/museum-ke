<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goals extends Model
{
    protected $fillable = ['title', 'performance', 'description', 'milestone_id','performance_indicator'];
  protected $casts = [
        'performance_indicator' => 'integer', // Add casting
    ];

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }
    public function setPerformanceIndicatorAttribute($value)
    {
        $this->attributes['performance_indicator'] = $value === null ? 
            null : 
            max(1, min(10, (int)$value));
    }
}
