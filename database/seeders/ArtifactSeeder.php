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
        $artId = Category::where('title', 'Art')->first()->id;

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
            // Traditional Culture (continued)
            [
                'title' => 'Luo Traditional Fishing Basket',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Cultural Hall A15',
                'description' => 'Handwoven fishing basket used by communities along Lake Victoria',
                'category_id' => $traditionalId,
            ],
            [
                'title' => 'Samburu Beaded Necklace',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Cultural Hall A18',
                'description' => 'Ceremonial beaded necklace worn by Samburu women during marriage ceremonies',
                'category_id' => $traditionalId,
            ],
            [
                'title' => 'Kamba Wooden Stool',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Storage Room 3',
                'description' => 'Hand-carved three-legged stool with traditional geometric patterns',
                'category_id' => $traditionalId,
            ],
            [
                'title' => 'Giriama Ceremonial Drum',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Musical Instruments Display',
                'description' => 'Large drum used during coastal community celebrations and rituals',
                'category_id' => $traditionalId,
            ],
            [
                'title' => 'Pokot Woman\'s Necklace',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Cultural Hall B2',
                'description' => 'Traditional neck ornament with brass and copper beads from West Pokot',
                'category_id' => $traditionalId,
            ],

// Colonial Period (continued)
            [
                'title' => 'British Colonial Officer\'s Uniform',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Colonial Wing C5',
                'description' => 'Military uniform worn by British officers stationed in Kenya circa 1935',
                'category_id' => $colonialId,
            ],
            [
                'title' => 'Early Settler\'s Farming Tools',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Agricultural History Section',
                'description' => 'Collection of tools used by early European settlers in the White Highlands',
                'category_id' => $colonialId,
            ],
            [
                'title' => 'Colonial-Era Map of Nairobi',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Maps and Geography Room',
                'description' => 'Hand-drawn map of Nairobi from 1910 showing original city planning',
                'category_id' => $colonialId,
            ],
            [
                'title' => 'Missionary Bible and Hymnal',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Religious Artifacts Section',
                'description' => 'Early translations of Christian texts used by missionaries in Central Kenya',
                'category_id' => $colonialId,
            ],

// Palaeontology (continued)
            [
                'title' => 'Proconsul Jaw Fragment',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Early Primates Exhibit',
                'description' => 'Cast of 18-million-year-old ape ancestor discovered on Rusinga Island',
                'category_id' => $paleoId,
            ],
            [
                'title' => 'Olduvai Gorge Stone Tools',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Early Human Technology',
                'description' => 'Collection of Oldowan and Acheulean stone tools dating 1.8 million years',
                'category_id' => $paleoId,
            ],
            [
                'title' => 'Permineralized Tree Trunk Section',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Paleobotany Gallery',
                'description' => 'Fossilized wood showing cellular structure from prehistoric Kenya forests',
                'category_id' => $paleoId,
            ],
            [
                'title' => 'Dinosaur Footprint Cast',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Mesozoic Hall',
                'description' => 'Cast of therapod dinosaur tracks discovered in Northern Kenya sediments',
                'category_id' => $paleoId,
            ],

// Numismatic (continued)
            [
                'title' => 'Pre-Colonial Trade Beads',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Currency Collection',
                'description' => 'Glass and shell beads used as currency along East African trade routes',
                'category_id' => $numismaticId,
            ],
            [
                'title' => 'Italian East Africa Coins',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Colonial Currency Cabinet',
                'description' => 'Set of coins from brief Italian occupation of neighboring Somalia',
                'category_id' => $numismaticId,
            ],
            [
                'title' => 'Early Central Bank of Kenya Notes',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Modern Currency Display',
                'description' => 'First series of banknotes issued after independence featuring Jomo Kenyatta',
                'category_id' => $numismaticId,
            ],
            [
                'title' => 'Traditional Dowry Payment Items',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Cultural Exchange Section',
                'description' => 'Collection of items historically used for bride price payments in various communities',
                'category_id' => $numismaticId,
            ],

// Entomology (continued)
            [
                'title' => 'Goliath Beetle Collection',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Insectarium Hall B',
                'description' => 'Preserved specimens of one of Africa\'s largest beetles from various regions',
                'category_id' => $entomologyId,
            ],
            [
                'title' => 'Malaria Vector Mosquito Specimens',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Medical Entomology Section',
                'description' => 'Collection of Anopheles mosquitoes with historical significance to tropical medicine',
                'category_id' => $entomologyId,
            ],
            [
                'title' => 'Butterfly Migration Map and Specimens',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Insect Ecology Room',
                'description' => 'Display showing butterfly migration patterns across East Africa with specimens',
                'category_id' => $entomologyId,
            ],
            [
                'title' => 'Agricultural Pest Collection',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Insectarium Hall C',
                'description' => 'Historical collection of insects that impacted Kenyan agriculture with documentation',
                'category_id' => $entomologyId,
            ],

// Art & Sculpture
            [
                'title' => 'Contemporary Kenyan Soapstone Carving',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'Modern Art Gallery',
                'description' => 'Kisii soapstone sculpture depicting family unity by renowned artist Wanjau',
                'category_id' => $artId,
            ],
            [
                'title' => 'Traditional Mwanzi Flute',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Musical Instruments Room',
                'description' => 'Bamboo flute with intricate burn patterns used in traditional ceremonies',
                'category_id' => $artId,
            ],
            [
                'title' => 'Early Independence Era Paintings',
                'condition' => Artifact::CONDITION_GOOD,
                'location' => 'National Heritage Gallery',
                'description' => 'Collection of oil paintings depicting Kenya\'s independence movement',
                'category_id' => $artId,
            ],
            [
                'title' => 'Ancient Rock Art Documentation',
                'condition' => Artifact::CONDITION_POOR,
                'location' => 'Prehistoric Art Section',
                'description' => 'Field notes and photographs of rock paintings from Northern Kenya dating 5000+ years',
                'category_id' => $artId,
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
