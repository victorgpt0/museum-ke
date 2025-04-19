<?php

namespace Database\Seeders;

use App\Models\Artifact;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ArtifactSeeder extends Seeder
{
    public function run()
    {
        // Get category IDs
        $traditionalId = Category::where('title', 'Traditional Culture')->first()->id;
        $colonialId = Category::where('title', 'Colonial Period')->first()->id;
        $paleoId = Category::where('title', 'Palaeontology')->first()->id;
        $numismaticId = Category::where('title', 'Numismatic')->first()->id;
        $entomologyId = Category::where('title', 'Entomology')->first()->id;

        $artifacts = [
            // Traditional Culture
            [
                'title' => 'Kikuyu Initiation Ceremony Gourd',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Cultural Hall A12',
                'description' => 'Decorated gourd used in traditional Kikuyu circumcision ceremonies',
                'category_id' => $traditionalId,
            ],
            [
                'title' => 'Maasai Warrior Shield',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Cultural Hall B7',
                'description' => 'Ox-hide shield with traditional patterns used by Moran warriors',
                'category_id' => $traditionalId,
            ],

            // Colonial Period
            [
                'title' => 'British Colonial Administrator\'s Desk',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Colonial Wing C3',
                'description' => 'Mahogany desk used in Nairobi government offices during 1920s',
                'category_id' => $colonialId,
            ],
            [
                'title' => 'Lunatic Express Railroad Spike',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Transportation Exhibit',
                'description' => 'Original spike from the Uganda Railway construction (1896-1901)',
                'category_id' => $colonialId,
            ],

            // Palaeontology
            [
                'title' => 'Homo erectus Skull Cast (KNM-ER 3733)',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Human Origins Gallery',
                'description' => 'Cast of 1.6 million-year-old skull discovered at Koobi Fora',
                'category_id' => $paleoId,
            ],
            [
                'title' => 'Fossilized Prehistoric Elephant Tooth',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Prehistoric Mammals Section',
                'description' => 'Tooth from extinct Elephas recki species found in Turkana Basin',
                'category_id' => $paleoId,
            ],

            // Numismatic
            [
                'title' => '1942 East African Shilling',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Currency Collection',
                'description' => 'Silver coin minted during World War II for East African territories',
                'category_id' => $numismaticId,
            ],
            [
                'title' => '1964 Kenya Independence Medal',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Special Exhibits',
                'description' => 'Commemorative medal issued for Kenya\'s independence',
                'category_id' => $numismaticId,
            ],

            // Entomology
            [
                'title' => 'African Queen Butterfly Specimen',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Insectarium',
                'description' => 'Preserved Danaus chrysippus collected in Nairobi in 1948',
                'category_id' => $entomologyId,
            ],
            [
                'title' => 'Giant African Mantis Display',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Insectarium',
                'description' => 'Preserved Sphodromantis viridis specimen from coastal Kenya',
                'category_id' => $entomologyId,
            ],
        ];

        foreach ($artifacts as $artifact) {
            Artifact::firstOrCreate(
                ['title' => $artifact['title']],
                $artifact
            );
        }
    }
}