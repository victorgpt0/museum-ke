<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ArtifactProposal extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title', 
        'description', 
        'source',
        'proposal_status', 
        'donor_id'
    ];

    protected $attributes = [
        'proposal_status' => 'pending' // Default status
    ];

    public function donor()
    {
        return $this->belongsTo(Donor::class);
    }

    // Define media collections for different types of media
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('artifact_images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
    }

    // Optional: Define media conversions (thumbnails, etc.)
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10);
    }
}