<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Archives extends Model
{
    use HasFactory;

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
        'documentpath',
        'category',
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
            self::CATEGORY_DOCUMENTATION => 'Documentation',
            self::CATEGORY_HISTORICAL => 'Historical',
            self::CATEGORY_CULTURAL => 'Cultural',
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
}