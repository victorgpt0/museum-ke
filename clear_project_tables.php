<?php

/**
 * Clear Project Tables Script
 * 
 * This script clears all project-related tables and their associated media files.
 * Run this script from your Laravel project root directory.
 * 
 * Usage: php clear_project_tables.php
 */

// Check if we're in the right directory
if (!file_exists('artisan')) {
    die("❌ ERROR: Please run this script from your Laravel project root directory (where artisan file is located)\n");
}

// Load Composer autoloader
if (!file_exists('vendor/autoload.php')) {
    die("❌ ERROR: Composer dependencies not found. Please run 'composer install' first.\n");
}

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🚀 PROJECT TABLES CLEARING SCRIPT\n";
echo "================================\n\n";

// Ask for confirmation
echo "⚠️  WARNING: This will permanently delete ALL project data including:\n";
echo "   - Project proposals\n";
echo "   - Projects\n";
echo "   - Milestones\n";
echo "   - Goals\n";
echo "   - Findings\n";
echo "   - Team members\n";
echo "   - Budgets\n";
echo "   - All associated media files\n\n";

echo "Are you sure you want to continue? (yes/no): ";
$handle = fopen("php://stdin", "r");
$line = fgets($handle);
fclose($handle);

if (trim(strtolower($line)) !== 'yes') {
    echo "❌ Operation cancelled.\n";
    exit(0);
}

echo "\nStarting to clear project-related tables and media...\n";
echo "====================================================\n\n";

try {
    DB::beginTransaction();

    // Clear project-related tables in the correct order (respecting foreign keys)
    
    // 1. Clear team_members (depends on projects)
    echo "📋 Clearing team_members table...\n";
    $count = DB::table('team_members')->count();
    DB::table('team_members')->truncate();
    echo "   ✓ team_members cleared ({$count} records)\n\n";

    // 2. Clear findings (depends on milestones)
    echo "📋 Clearing findings table...\n";
    $count = DB::table('findings')->count();
    DB::table('findings')->truncate();
    echo "   ✓ findings cleared ({$count} records)\n\n";

    // 3. Clear goals (depends on projects)
    echo "📋 Clearing goals table...\n";
    $count = DB::table('goals')->count();
    DB::table('goals')->truncate();
    echo "   ✓ goals cleared ({$count} records)\n\n";

    // 4. Clear milestones (depends on projects)
    echo "📋 Clearing milestones table...\n";
    $count = DB::table('milestones')->count();
    DB::table('milestones')->truncate();
    echo "   ✓ milestones cleared ({$count} records)\n\n";

    // 5. Clear budgets (depends on projects)
    echo "📋 Clearing budgets table...\n";
    $count = DB::table('budgets')->count();
    DB::table('budgets')->truncate();
    echo "   ✓ budgets cleared ({$count} records)\n\n";

    // 6. Clear projects (depends on project_proposals)
    echo "📋 Clearing projects table...\n";
    $count = DB::table('projects')->count();
    DB::table('projects')->truncate();
    echo "   ✓ projects cleared ({$count} records)\n\n";

    // 7. Clear project_proposals (base table)
    echo "📋 Clearing project_proposals table...\n";
    $count = DB::table('project_proposals')->count();
    DB::table('project_proposals')->truncate();
    echo "   ✓ project_proposals cleared ({$count} records)\n\n";

    // Clear associated media files
    echo "📁 Clearing project-related media files...\n";
    echo "==========================================\n";
    
    // Clear project proposal media
    $projectProposalMedia = Media::where('collection_name', 'project_proposal_documents')
        ->orWhere('collection_name', 'project_proposal_images')
        ->get();
    
    echo "   Found {$projectProposalMedia->count()} project proposal media files\n";
    
    foreach ($projectProposalMedia as $media) {
        $media->delete();
    }
    
    echo "   ✓ Project proposal media files cleared\n\n";

    // Clear any other project-related media collections
    $projectMedia = Media::where('collection_name', 'like', '%project%')
        ->orWhere('collection_name', 'like', '%milestone%')
        ->orWhere('collection_name', 'like', '%goal%')
        ->orWhere('collection_name', 'like', '%finding%')
        ->orWhere('collection_name', 'like', '%budget%')
        ->get();
    
    echo "   Found {$projectMedia->count()} other project-related media files\n";
    
    foreach ($projectMedia as $media) {
        $media->delete();
    }
    
    echo "   ✓ All project-related media files cleared\n\n";

    DB::commit();
    
    echo "🎉 SUCCESS: All project-related tables and media have been cleared!\n";
    echo "================================================================\n\n";
    echo "📊 Summary of cleared data:\n";
    echo "   • project_proposals\n";
    echo "   • projects\n";
    echo "   • milestones\n";
    echo "   • goals\n";
    echo "   • findings\n";
    echo "   • team_members\n";
    echo "   • budgets\n\n";
    echo "📁 Cleared media collections:\n";
    echo "   • project_proposal_documents\n";
    echo "   • project_proposal_images\n";
    echo "   • All other project-related media\n\n";
    echo "✅ Your project module is now empty and ready for fresh seeding!\n";

} catch (Exception $e) {
    DB::rollBack();
    echo "\n❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
} 