<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ClearProjectTables extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear:project-tables {--force : Force the operation without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all project-related tables and their associated media files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force')) {
            if (!$this->confirm('This will permanently delete ALL project data including proposals, projects, milestones, goals, findings, team members, budgets, and their media files. Are you sure?')) {
                $this->info('Operation cancelled.');
                return;
            }
        }

        $this->info('Starting to clear project-related tables and media...');

        try {
            DB::beginTransaction();

            // Clear project-related tables in the correct order (respecting foreign keys)
            
            // 1. Clear team_members (depends on projects)
            $this->info('Clearing team_members table...');
            DB::table('team_members')->truncate();
            $this->info('✓ team_members cleared');

            // 2. Clear findings (depends on milestones)
            $this->info('Clearing findings table...');
            DB::table('findings')->truncate();
            $this->info('✓ findings cleared');

            // 3. Clear goals (depends on projects)
            $this->info('Clearing goals table...');
            DB::table('goals')->truncate();
            $this->info('✓ goals cleared');

            // 4. Clear milestones (depends on projects)
            $this->info('Clearing milestones table...');
            DB::table('milestones')->truncate();
            $this->info('✓ milestones cleared');

            // 5. Clear budgets (depends on projects)
            $this->info('Clearing budgets table...');
            DB::table('budgets')->truncate();
            $this->info('✓ budgets cleared');

            // 6. Clear projects (depends on project_proposals)
            $this->info('Clearing projects table...');
            DB::table('projects')->truncate();
            $this->info('✓ projects cleared');

            // 7. Clear project_proposals (base table)
            $this->info('Clearing project_proposals table...');
            DB::table('project_proposals')->truncate();
            $this->info('✓ project_proposals cleared');

            // Clear associated media files
            $this->info('Clearing project-related media files...');
            
            // Clear project proposal media
            $projectProposalMedia = Media::where('collection_name', 'project_proposal_documents')
                ->orWhere('collection_name', 'project_proposal_images')
                ->get();
            
            $this->info("Found {$projectProposalMedia->count()} project proposal media files to delete");
            
            foreach ($projectProposalMedia as $media) {
                $media->delete();
            }
            
            $this->info('✓ Project proposal media files cleared');

            // Clear any other project-related media collections
            $projectMedia = Media::where('collection_name', 'like', '%project%')
                ->orWhere('collection_name', 'like', '%milestone%')
                ->orWhere('collection_name', 'like', '%goal%')
                ->orWhere('collection_name', 'like', '%finding%')
                ->orWhere('collection_name', 'like', '%budget%')
                ->get();
            
            $this->info("Found {$projectMedia->count()} other project-related media files to delete");
            
            foreach ($projectMedia as $media) {
                $media->delete();
            }
            
            $this->info('✓ All project-related media files cleared');

            DB::commit();
            
            $this->newLine();
            $this->info('🎉 SUCCESS: All project-related tables and media have been cleared!');
            $this->newLine();
            $this->info('Cleared tables:');
            $this->line('- project_proposals');
            $this->line('- projects');
            $this->line('- milestones');
            $this->line('- goals');
            $this->line('- findings');
            $this->line('- team_members');
            $this->line('- budgets');
            $this->newLine();
            $this->info('Cleared media collections:');
            $this->line('- project_proposal_documents');
            $this->line('- project_proposal_images');
            $this->line('- All other project-related media');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('❌ ERROR: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
        }
    }
} 