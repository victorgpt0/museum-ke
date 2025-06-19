<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProjectProposal extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

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
     protected $appends = [
        'all_image_urls',
        'thumbnail_url',
         'all_documents_urls',
     ];
      public function registerMediaCollections(): void
    {
        $this->addMediaCollection('project_proposal_images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
    }

    // Optional: Define media conversions (thumbnails, etc.)
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10);
    }
    public function getAllImageUrlsAttribute()
    {
        return $this->getMedia('project_proposal_images')->map(function ($media) {
            return $media->getUrl();
        })->toArray();
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->getFirstMediaUrl('project_proposal_images', 'thumb');
    }

    public function getAllDocumentsUrlsAttribute()
    {
        return $this->getMedia('project_proposal_documents')->map(function ($media) {
            return $media->getUrl();
        })->toArray();
    }
}
