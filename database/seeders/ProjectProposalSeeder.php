<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProjectProposal;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ProjectProposalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting Project Proposal Seeding...');

        // Read the JSON file
        $jsonPath = base_path('seven_museum_projects.json');
        if (!file_exists($jsonPath)) {
            $this->command->error('JSON file not found at: ' . $jsonPath);
            return;
        }

        $projectsData = json_decode(file_get_contents($jsonPath), true);
        if (!$projectsData) {
            $this->command->error('Failed to parse JSON file');
            return;
        }

        $this->command->info('Found ' . count($projectsData) . ' projects to seed');

        foreach ($projectsData as $index => $projectData) {
            $projectNumber = $index + 1;
            $this->command->info("Processing Project {$projectNumber}: {$projectData['title']}");

            try {
                DB::beginTransaction();

                // Check if user exists
                $user = User::find($projectData['user_id']);
                if (!$user) {
                    $this->command->warn("User ID {$projectData['user_id']} not found, skipping project {$projectNumber}");
                    continue;
                }

                // Create project proposal with enhanced data
                $proposal = ProjectProposal::create([
                    'title' => $projectData['title'],
                    'description' => $this->enhanceDescription($projectData['description']),
                    'duration' => $this->formatDuration($projectData['duration_months']),
                    'status' => 'pending',
                    'submitted_at' => Carbon::now()->subDays(rand(1, 30)), // Random submission date
                    'approved_at' => null,
                    'user_id' => $projectData['user_id']
                ]);

                // Attach media files from the corresponding folder
                $this->attachMediaFiles($proposal, $projectNumber);

                DB::commit();
                $this->command->info("✓ Project {$projectNumber} seeded successfully");

            } catch (\Exception $e) {
                DB::rollBack();
                $this->command->error("✗ Failed to seed project {$projectNumber}: " . $e->getMessage());
            }
        }

        $this->command->info('Project Proposal Seeding completed!');
    }

    /**
     * Enhance the description with additional details
     */
    private function enhanceDescription(string $description): string
    {
        $enhancedDescriptions = [
            'Monitoring the lion population in the Maasai Mara and analyzing their genetic diversity to guide conservation policy.' => 
            'This comprehensive study focuses on monitoring the lion population in the Maasai Mara ecosystem and analyzing their genetic diversity to guide conservation policy. The project will employ advanced tracking technologies, genetic sampling, and behavioral analysis to understand population dynamics, genetic health, and migration patterns of lions in this critical ecosystem. Findings will contribute to national conservation strategies and international wildlife management policies.',
            
            'Documenting insect biodiversity in Kenya\'s coastal mangroves, focusing on endangered pollinators and aquatic beetles.' => 
            'This research project aims to document insect biodiversity in Kenya\'s coastal mangrove habitats, with particular focus on endangered pollinators and aquatic beetles. The study will map species distribution, assess population health, and identify conservation priorities in these fragile ecosystems. Results will support coastal ecosystem management and contribute to global biodiversity databases.',
            
            'Conserving and documenting artifacts from pre-colonial trade centers in Lamu and Kilwa linked to Indian Ocean trade.' => 
            'This conservation project focuses on preserving and documenting artifacts from pre-colonial trade centers in Lamu and Kilwa, which were crucial nodes in the Indian Ocean trade network. The project will employ modern conservation techniques, 3D documentation, and historical research to preserve these cultural treasures for future generations and enhance our understanding of East Africa\'s maritime history.',
            
            'Creating interactive, youth-centered museum programs using pop-up exhibits, an app, and school outreach in Nairobi.' => 
            'This innovative project aims to revolutionize museum education for urban youth in Nairobi by creating interactive, technology-driven programs. The initiative includes developing pop-up exhibits, a mobile application, and comprehensive school outreach programs designed to make cultural and scientific education more accessible and engaging for young people.',
            
            'Preserving and digitally recording early hominid footprints discovered in sediment beds to analyze locomotion patterns.' => 
            'This groundbreaking project focuses on preserving and digitally recording early hominid footprints discovered in sediment beds across Northern Kenya. Using advanced 3D scanning and analysis techniques, researchers will analyze locomotion patterns and contribute to our understanding of human evolution and early human behavior in East Africa.',
            
            'Surveying and documenting submerged archaeological sites along Kenya\'s coast, including ancient harbor infrastructure.' => 
            'This underwater archaeology project will survey and document submerged archaeological sites along Kenya\'s coast, including ancient harbor infrastructure from the Swahili civilization. Using modern diving equipment and archaeological techniques, the team will map and preserve these underwater cultural heritage sites.',
            
            'Digitizing traditional music instruments, their sounds, and histories across Kenyan communities for cultural preservation.' => 
            'This cultural preservation project aims to digitize traditional music instruments, their sounds, and histories across diverse Kenyan communities. The initiative will create a comprehensive digital archive of traditional music culture, ensuring these important cultural elements are preserved for future generations and made accessible to researchers and the public.'
        ];

        return $enhancedDescriptions[$description] ?? $description;
    }

    /**
     * Format duration from months to readable string
     */
    private function formatDuration(int $months): string
    {
        if ($months == 1) {
            return '1 Month';
        } elseif ($months < 12) {
            return "{$months} Months";
        } else {
            $years = floor($months / 12);
            $remainingMonths = $months % 12;
            if ($remainingMonths == 0) {
                return $years == 1 ? '1 Year' : "{$years} Years";
            } else {
                return "{$years} Year" . ($years > 1 ? 's' : '') . " {$remainingMonths} Month" . ($remainingMonths > 1 ? 's' : '');
            }
        }
    }

    /**
     * Attach media files from the project folder
     */
    private function attachMediaFiles(ProjectProposal $proposal, int $projectNumber): void
    {
        $projectFolder = base_path("seedingdata/project{$projectNumber}");
        
        if (!is_dir($projectFolder)) {
            $this->command->warn("Project folder not found: {$projectFolder}");
            return;
        }

        $files = scandir($projectFolder);
        $uploadedCount = 0;

        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $filePath = $projectFolder . '/' . $file;
            
            if (!is_file($filePath)) {
                continue;
            }

            try {
                // Determine if it's an image or document based on extension
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                
                if (in_array($extension, $imageExtensions)) {
                    // Add as image
                    $proposal->addMedia($filePath)
                        ->preservingOriginal()
                        ->toMediaCollection('project_proposal_images');
                } else {
                    // Add as document
                    $proposal->addMedia($filePath)
                        ->preservingOriginal()
                        ->toMediaCollection('project_proposal_documents');
                }
                
                $uploadedCount++;
                $this->command->info("  ✓ Attached: {$file}");
                
            } catch (\Exception $e) {
                $this->command->warn("  ✗ Failed to attach {$file}: " . $e->getMessage());
            }
        }

        if ($uploadedCount > 0) {
            $this->command->info("  Total files attached: {$uploadedCount}");
        } else {
            $this->command->warn("  No files were attached for project {$projectNumber}");
        }
    }
} 