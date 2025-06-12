<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Milestone Model Template
 * 
 * REUSABLE TEMPLATE INSTRUCTIONS:
 * 1. Change class name from 'Milestone' to your desired model name
 * 2. Update $table property to match your table name
 * 3. Modify $fillable array with your model's fields
 * 4. Update $casts array for proper data type casting
 * 5. Change relationship method names and related models
 * 6. Update foreign key references in relationships
 */
class Milestone extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * Change this to your table name (usually plural of model name)
     */
    protected $table = 'milestones';

    /**
     * The attributes that are mass assignable.
     * Add/remove fields based on your model requirements
     */
    protected $fillable = [
        'title',                    // Main title/name field
        'description',              // Detailed description
        'due_date',                // Date field
        'performance_description',  // Additional text field
        'project_id',              // Foreign key - change to match your relationship
    ];

    /**
     * The attributes that should be cast to native types.
     * Update based on your field types
     */
    protected $casts = [
        'due_date' => 'date',           // Cast to Carbon date instance
        'created_at' => 'datetime',     // Automatic timestamp casting
        'updated_at' => 'datetime',     // Automatic timestamp casting
    ];

    /**
     * RELATIONSHIP METHODS
     * Update these based on your model relationships
     */

    /**
     * Get the project that owns this milestone.
     * 
     * TEMPLATE USAGE:
     * - Change method name to match your relationship (e.g., user(), category(), etc.)
     * - Change 'Project::class' to your related model class
     * - Change 'project_id' to your foreign key field name
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /**
     * ADDITIONAL RELATIONSHIP EXAMPLES FOR REUSE:
     * 
     * // One-to-Many (if this model has many related records)
     * public function relatedItems(): HasMany
     * {
     *     return $this->hasMany(RelatedModel::class, 'foreign_key_field');
     * }
     * 
     * // Many-to-Many
     * public function tags(): BelongsToMany
     * {
     *     return $this->belongsToMany(Tag::class, 'pivot_table_name');
     * }
     * 
     * // Has One
     * public function detail(): HasOne
     * {
     *     return $this->hasOne(DetailModel::class, 'foreign_key_field');
     * }
     */

    /**
     * SCOPE METHODS (Query Filters)
     * Add custom query scopes for common filtering
     */

    /**
     * Scope to filter by project
     * Usage: Milestone::forProject($projectId)->get()
     */
    public function scopeForProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    /**
     * Scope to filter by due date
     * Usage: Milestone::dueBefore('2024-12-31')->get()
     */
    public function scopeDueBefore($query, $date)
    {
        return $query->where('due_date', '<=', $date);
    }

    /**
     * ACCESSOR METHODS (Computed Attributes)
     * Add methods to modify how attributes are retrieved
     */

    /**
     * Get formatted due date
     * Usage: $milestone->formatted_due_date
     */
    public function getFormattedDueDateAttribute()
    {
        return $this->due_date ? $this->due_date->format('M d, Y') : null;
    }

    /**
     * MUTATOR METHODS (Modify attributes before saving)
     * Add methods to modify how attributes are stored
     */

    /**
     * Ensure title is always capitalized
     */
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = ucfirst(trim($value));
    }
}