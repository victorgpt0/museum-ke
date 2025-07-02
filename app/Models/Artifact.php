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

//    protected static string $logName = 'artifact';
//    protected static array $logAttributes = ['title', 'description', 'category_id', 'location', 'acquisition_date', 'status', 'donor_id', 'condition'];
//    protected static bool $logOnlyDirty = true;
//    protected static bool $submitEmptyLogs = false;
//
//    public function getActivitylogOptions(): LogOptions
//    {
//        return LogOptions::defaults()
//            ->logOnly(['title', 'description', 'category_id', 'location', 'acquisition_date', 'status', 'donor_id', 'condition'])
//            ->logOnlyDirty()
//            ->dontSubmitEmptyLogs();
//    }
}
