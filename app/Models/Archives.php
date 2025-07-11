<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Archives extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'archives';

    /**
     * Category constants
     */
    const CATEGORY_RESEARCH = 'research';
    const CATEGORY_CONTEXT = 'context';
    const CATEGORY_DOCUMENTATION = 'documentation';
    const CATEGORY_HISTORICAL = 'historical';
    const CATEGORY_CULTURAL = 'cultural';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'author',
        'category',
        'user_id',
        'is_published',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get all available categories
     *
     * @return array
     */
    public static function getCategories(): array
    {
        return [
            self::CATEGORY_RESEARCH => 'Research',
            self::CATEGORY_CONTEXT => 'Context',
            'documentation' => 'Documentation',
            'historical' => 'Historical',
            'cultural' => 'Cultural',
        ];
    }

    /**
     * Check if the archive is a research document
     *
     * @return bool
     */
    public function isResearch(): bool
    {
        return $this->category === self::CATEGORY_RESEARCH;
    }

    /**
     * Check if the archive is a context document
     *
     * @return bool
     */
    public function isContext(): bool
    {
        return $this->category === self::CATEGORY_CONTEXT;
    }

    /**
     * Get the category display name
     *
     * @return string
     */
    public function getCategoryDisplayName(): string
    {
        $categories = self::getCategories();
        return $categories[$this->category] ?? $this->category;
    }

    /**
     * Scope to filter by category
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $category
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to search archives by title or author
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
    }

    /**
     * Get the file extension from document path
     *
     * @return string
     */
    public function getFileExtension(): string
    {
        return pathinfo($this->documentpath, PATHINFO_EXTENSION);
    }

    /**
     * Get the file name from document path
     *
     * @return string
     */
    public function getFileName(): string
    {
        return pathinfo($this->documentpath, PATHINFO_BASENAME);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('documents')
            ->acceptsMimeTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']);
        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
    }

    public function getDocumentsAttribute()
    {
        return $this->getMedia('documents');
    }

    public function getImagesAttribute()
    {
        return $this->getMedia('images');
    }

    /**
     * Get the user who uploaded the archive
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Get the artifacts related to this archive.
     */
    public function artifacts()
    {
        return $this->belongsToMany(
            Artifact::class,
            'artifact_archives',
            'archive_id',
            'artifact_id'
        )->withPivot([
            'relationship_type',
            'notes',
            'document_date',
            'document_author',
            'is_primary'
        ])->withTimestamps();
    }

    /**
     * Get relationship types for museum documentation.
     */
    public static function getRelationshipTypes(): array
    {
        return [
            'conservation_report' => 'Conservation Report',
            'excavation_notes' => 'Excavation Notes',
            'research_paper' => 'Research Paper',
            'exhibition_catalog' => 'Exhibition Catalog',
            'provenance_document' => 'Provenance Document',
            'condition_assessment' => 'Condition Assessment',
            'acquisition_document' => 'Acquisition Document',
            'photographic_record' => 'Photographic Record',
            'technical_analysis' => 'Technical Analysis',
            'other' => 'Other'
        ];
    }

    /**
     * Get the display name for a relationship type.
     */
    public function getRelationshipTypeDisplayName($type): string
    {
        $types = self::getRelationshipTypes();
        return $types[$type] ?? $type;
    }

    /**
     * Check if this archive is linked to any artifacts.
     */
    public function hasLinkedArtifacts(): bool
    {
        return $this->artifacts()->exists();
    }

    /**
     * Get the primary artifact for this archive.
     */
    public function getPrimaryArtifact()
    {
        return $this->artifacts()->wherePivot('is_primary', true)->first();
    }
}