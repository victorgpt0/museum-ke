<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Finding extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    protected $appends = [
        'all_image_urls',
        'thumbnail_url',
        'all_documents_urls',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('finding_images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
        
        $this->addMediaCollection('finding_documents')
            ->acceptsMimeTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
    }

    // Optional: Define media conversions (thumbnails, etc.)
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10);
    }

    public function getImageUrlAttribute()
    {
        return $this->getFirstMediaUrl('finding_images');
    }

    public function getAllImageUrlsAttribute()
    {
        return $this->getMedia('finding_images')->map(function ($media) {
            return $media->getUrl();
        })->toArray();
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->getFirstMediaUrl('finding_images', 'thumb');
    }

    public function getAllDocumentsUrlsAttribute()
    {
        return $this->getMedia('finding_documents')->map(function ($media) {
            return [
                'url' => $media->getUrl(),
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
            ];
        })->toArray();
    }
}