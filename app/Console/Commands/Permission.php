<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Permission extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:permissions {model : The model to create permissions for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'create standard permissions for a model';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $model = $this->argument('model');
        $modelLower = strtolower($model);
        $permissions = [
            "{$modelLower}.view",
            "{$modelLower}.create",
            "{$modelLower}.edit",
            "{$modelLower}.delete",
        ];
        $this->info("Creating permissions for {$model}");
        $created = 0;
        $existing = 0;

        foreach ($permissions as $permission){
            if (\Spatie\Permission\Models\Permission::where('name', $permission)->exists()) {
                $this->warn("Permission {$permission} already exists");
                $existing++;
            }else{
                \Spatie\Permission\Models\Permission::create(['name' => $permission]);
                $this->line("Created permission {$permission}");
                $created++;
            }
        }

        $this->newLine();
        $this->info("Created {$created} permissions, {$existing} already existed");
    }
}
