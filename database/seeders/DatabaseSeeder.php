<?php

namespace Database\Seeders;

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
<<<<<<< HEAD
        // User seeding
        

        // Call your ArtifactSeeder
        $this->call([
            CategorySeeder::class,
            ArtifactSeeder::class,
        ]);
    }
}
=======
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
>>>>>>> 5ae5265f337c76b61323d678b84bb6610542098c
