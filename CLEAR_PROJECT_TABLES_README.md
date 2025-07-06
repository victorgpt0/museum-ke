# Clear Project Tables Script

This script clears all project-related tables and their associated media files from your Laravel application.

## What it clears:

### Database Tables:
- `project_proposals` - Project proposals
- `projects` - Research projects  
- `milestones` - Project milestones
- `goals` - Project goals
- `findings` - Research findings
- `team_members` - Project team members
- `budgets` - Project budgets

### Media Files:
- Project proposal documents and images
- All other project-related media files

## How to use:

### Prerequisites:
1. Make sure you're in your Laravel project root directory
2. Run `composer install` if you haven't already
3. Ensure your database connection is configured

### Running the script:

```bash
php clear_project_tables.php
```

The script will:
1. Ask for confirmation before proceeding
2. Show you exactly what will be deleted
3. Clear all tables in the correct order (respecting foreign keys)
4. Delete all associated media files
5. Show a summary of what was cleared

### Safety features:
- ✅ Confirmation prompt before deletion
- ✅ Database transaction for rollback safety
- ✅ Detailed progress reporting
- ✅ Error handling with rollback

## For your friend:

When your friend pulls the code, they just need to:

1. Navigate to the project root directory
2. Run: `php clear_project_tables.php`
3. Type `yes` when prompted
4. The script will handle everything else!

## Alternative: Artisan Command

You can also use the Artisan command:
```bash
php artisan clear:project-tables --force
```

But the standalone script is more user-friendly for sharing with friends. 