<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema; // Add this import
use Illuminate\Database\Schema\Blueprint; // Add this import

class CategorySeeder extends Seeder
{
    public function run()
    {
        // Check if table exists first
        if (!Schema::hasTable('category')) {
            Schema::create('category', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        $categories = [
            ['title' => 'Traditional Culture', 'description' => 'Artifacts from indigenous Kenyan cultures'],
            ['title' => 'Colonial Period', 'description' => 'Items from the British colonial era in Kenya'],
            ['title' => 'Palaeontology', 'description' => 'Fossil records and ancient remains'],
            ['title' => 'Numismatic', 'description' => 'Historical currency and coins'],
            ['title' => 'Entomology', 'description' => 'Insect specimens and related artifacts'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['title' => $category['title']],
                $category
            );
        }
    }
}