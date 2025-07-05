<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MakePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:permission {model : The model to create permissions for} {permissions* : The permissions to create}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create non-standard permissions for a model';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $model = $this->argument('model');
        $permissions = $this->argument('permissions');
        $this->info("Creating permissions for {$model}");
        $created = 0;
        $skipped = 0;
        foreach ($permissions as $permission){
            $permissionName = strtolower($model).'.'.$permission;
            $exists = DB::table('permissions')->where('name', $permissionName)->exists();

            if (!$exists) {
                \Spatie\Permission\Models\Permission::create(['name' => $permissionName]);
                $this->line("✓ Created permission {$permissionName}");;
                $created++;
            }else{
                $this->line("- Skipped existing permission: {$permissionName}");
                $skipped++;
            }
        }
    }
}
