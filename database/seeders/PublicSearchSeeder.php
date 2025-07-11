<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Artifact;
use App\Models\Project;
use App\Models\Archives;
use App\Models\Category;
use App\Models\User;

class PublicSearchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a user for the sample data
        $user = User::first() ?? User::factory()->create();
        
        // Get or create categories
        $categories = Category::all();
        if ($categories->isEmpty()) {
            $categories = Category::factory(3)->create();
        }

        // Create sample published artifacts
        $artifacts = [
            [
                'title' => 'Ancient Kenyan Pottery Fragment',
                'description' => 'A well-preserved pottery fragment from the early Iron Age, discovered in the Rift Valley region. This artifact provides valuable insights into early Kenyan ceramic traditions.',
                'category_id' => $categories->first()->id,
                'condition' => 'good',
                'location' => 'Rift Valley, Kenya',
                'acquisition_date' => '2023-05-15',
                'is_published' => true,
                'user_id' => $user->id,
            ],
            [
                'title' => 'Traditional Maasai Beaded Necklace',
                'description' => 'A beautiful beaded necklace crafted by Maasai artisans, featuring traditional patterns and colors. This piece represents the rich cultural heritage of the Maasai people.',
                'category_id' => $categories->first()->id,
                'condition' => 'good',
                'location' => 'Narok County, Kenya',
                'acquisition_date' => '2023-08-22',
                'is_published' => true,
                'user_id' => $user->id,
            ],
            [
                'title' => 'Colonial Era Coin Collection',
                'description' => 'A collection of coins from the British East Africa Protectorate period, including rare specimens that tell the story of Kenya\'s colonial history.',
                'category_id' => $categories->first()->id,
                'condition' => 'good',
                'location' => 'Nairobi, Kenya',
                'acquisition_date' => '2023-11-10',
                'is_published' => true,
                'user_id' => $user->id,
            ],
        ];

        foreach ($artifacts as $artifactData) {
            Artifact::create($artifactData);
        }

        // Create sample published projects
        $projects = [
            [
                'title' => 'Archaeological Survey of Lamu Old Town',
                'description' => 'A comprehensive archaeological survey of Lamu Old Town, a UNESCO World Heritage site. This project aims to document and preserve the rich cultural heritage of this historic Swahili settlement.',
                'duration' => '18 months',
                'start_date' => '2023-01-15',
                'is_published' => true,
                'user_id' => $user->id,
            ],
            [
                'title' => 'Conservation of Traditional Musical Instruments',
                'description' => 'A research project focused on the conservation and documentation of traditional Kenyan musical instruments, including their cultural significance and preservation techniques.',
                'duration' => '12 months',
                'start_date' => '2023-06-01',
                'is_published' => true,
                'user_id' => $user->id,
            ],
            [
                'title' => 'Digital Documentation of Rock Art Sites',
                'description' => 'Using modern technology to digitally document and preserve ancient rock art sites across Kenya, creating a comprehensive database for future research and education.',
                'duration' => '24 months',
                'start_date' => '2023-03-10',
                'is_published' => true,
                'user_id' => $user->id,
            ],
        ];

        foreach ($projects as $projectData) {
            Project::create($projectData);
        }

        // Create sample published archives/reports
        $archives = [
            [
                'title' => 'Excavation Report: Fort Jesus Archaeological Site',
                'author' => 'Dr. Sarah Mwangi',
                'category' => 'research',
                'is_published' => true,
                'user_id' => $user->id,
            ],
            [
                'title' => 'Cultural Heritage Assessment: Coastal Kenya',
                'author' => 'Prof. James Ochieng',
                'category' => 'documentation',
                'is_published' => true,
                'user_id' => $user->id,
            ],
            [
                'title' => 'Traditional Medicine Practices in Western Kenya',
                'author' => 'Dr. Mary Akinyi',
                'category' => 'cultural',
                'is_published' => true,
                'user_id' => $user->id,
            ],
            [
                'title' => 'Historical Analysis of Kenyan Independence Movement',
                'author' => 'Prof. David Kamau',
                'category' => 'historical',
                'is_published' => true,
                'user_id' => $user->id,
            ],
        ];

        foreach ($archives as $archiveData) {
            Archives::create($archiveData);
        }

        $this->command->info('Sample published data created successfully for public search testing!');
    }
}
