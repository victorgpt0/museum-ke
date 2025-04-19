<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artifact extends Model
{
    use HasFactory;
    protected $table = 'artifact';

    /**
     * Condition constants
     */
    const CONDITION_GOOD = 'good';
    const CONDITION_POOR = 'poor';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'condition',
        'location',
        'relation',
        'description',
        'category_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'condition' => 'string',
    ];

    /**
     * Check if the artifact is in good condition
     *
     * @return bool
     */
    public function isInGoodCondition(): bool
    {
        return $this->condition === self::CONDITION_GOOD;
    }

    /**
     * Check if the artifact is in poor condition
     *
     * @return bool
     */
    public function isInPoorCondition(): bool
    {
        return $this->condition === self::CONDITION_POOR;
    }

    /**
     * Set the condition to good
     *
     * @return $this
     */
    public function setGoodCondition()
    {
        $this->condition = self::CONDITION_GOOD;
        return $this;
    }

    /**
     * Set the condition to poor
     *
     * @return $this
     */
    public function setPoorCondition()
    {
        $this->condition = self::CONDITION_POOR;
        return $this;
    }

    /**
     * Get the category that owns the artifact.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the parent artifact that this artifact is related to.
     */
    public function relatedTo(): BelongsTo
    {
        return $this->belongsTo(Artifact::class, 'relation');
    }

    /**
     * Get the artifacts that are related to this artifact.
     */
    public function relatedArtifacts(): HasMany
    {
        return $this->hasMany(Artifact::class, 'relation');
    }

    /**
     * Helper method to find all artifacts that are related to each other
     * in the same group (sharing the same root relationship)
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRelatedGroup()
    {
        // If this artifact is related to another one, find the root artifact
        if ($this->relation) {
            $rootArtifact = $this;
            
            // Trace back to find the root artifact
            while ($rootArtifact->relation) {
                $rootArtifact = $rootArtifact->relatedTo;
            }
            
            // Get all artifacts related to the root
            return Artifact::where('id', $rootArtifact->id)
                ->orWhere('relation', $rootArtifact->id)
                ->orWhereIn('relation', function ($query) use ($rootArtifact) {
                    $query->select('id')
                        ->from('artifacts')
                        ->where('relation', $rootArtifact->id);
                })
                ->get();
        }
        
        // This is already a root artifact, get all related artifacts
        return Artifact::where('id', $this->id)
            ->orWhere('relation', $this->id)
            ->orWhereIn('relation', function ($query) {
                $query->select('id')
                    ->from('artifacts')
                    ->where('relation', $this->id);
            })
            ->get();
    }
}