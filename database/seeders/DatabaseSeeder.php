<?php

namespace Database\Seeders;

use App\Console\Commands\Permission;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
//         //User seeding
//         User::factory(10)->create();
//
//        User::factory()->create([
//            'name' => 'Test User',
//            'email' => 'test@example.com',
//        ]);

        // Call your seeders
        $this->call([
            CategorySeeder::class,
//            ArtifactSeeder::class,
            PermissionSeeder::class,
            ProjectProposalSeeder::class,
        ]);
    }
}
