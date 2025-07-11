<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Artifact extends Model implements HasMedia
{
    use HasFactory;
    use HasHashId;
    use InteractsWithMedia;
//    use LogsActivity;

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
        'description',
        'category_id',
        'condition',
        'location',
        'acquisition_date',
//        'status',
//        'donor_id',
        'user_id',
        'metadata',
        'is_published',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'condition' => 'string',
        'acquisition_date' => 'date',
        'metadata' => 'array',
    ];

    protected $appends = [
        'thumbnail_url',
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
     * Get the donor that owns the artifact.
     */
    public function donor(): BelongsTo
    {
        return $this->belongsTo(Donor::class);
    }

    /**
     * Get the user that created the artifact.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the tags for the artifact.
     */
    public function tags()
    {
        return $this->belongsToMany(
            Tag::class,
            'artifact_tag',
            'artifact_id',
            'tag_id'
        )->withTimestamps();
    }

    /**
     * Get the related artifacts.
     */
    public function related()
    {
        return $this->belongsToMany(
            Artifact::class,
            'artifact_relations',
            'artifact_id',
            'related_artifact_id'
        )->withPivot('relation_type')->withTimestamps();
    }

    /**
     * Get the archives related to this artifact.
     */
    public function archives()
    {
        return $this->belongsToMany(
            Archives::class,
            'artifact_archives',
            'artifact_id',
            'archive_id'
        )->withPivot([
            'relationship_type',
            'notes',
            'document_date',
            'document_author',
            'is_primary'
        ])->withTimestamps();
    }

    /**
     * Get archives by relationship type.
     */
    public function getArchivesByType($type)
    {
        return $this->archives()->wherePivot('relationship_type', $type);
    }

    /**
     * Get the primary archive for this artifact.
     */
    public function getPrimaryArchive()
    {
        return $this->archives()->wherePivot('is_primary', true)->first();
    }

    /**
     * Link an archive to this artifact.
     */
    public function linkArchive($archiveId, $relationshipType = 'other', $notes = null, $isPrimary = false)
    {
        $this->archives()->attach($archiveId, [
            'relationship_type' => $relationshipType,
            'notes' => $notes,
            'is_primary' => $isPrimary,
            'document_date' => now()->toDateString(),
            'document_author' => auth()->user()->name ?? 'Unknown'
        ]);
    }

    /**
     * Unlink an archive from this artifact.
     */
    public function unlinkArchive($archiveId)
    {
        $this->archives()->detach($archiveId);
    }

    /**
     * Get the images for the artifact.
     */
    public function getImagesAttribute()
    {
        return $this->getMedia('images');
    }

    /**
     * Get the documents for the artifact.
     */
    public function getDocumentsAttribute()
    {
        return $this->getMedia('documents');
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->getFirstMediaUrl('images');
    }

    /**
     * Register media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);

        $this->addMediaCollection('documents')
            ->acceptsMimeTypes(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
    }
}
