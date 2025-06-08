<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            "users.create",
            "users.view",
            "users.edit",
            "users.delete",
            "roles.create",
            "roles.view",
            "roles.edit",
            "roles.delete",
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        //Initialize super-admin
        $role = Role::create(['name' => 'SuperAdmin']);

        $super_admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@museum.ke',
        ]);

        $super_admin->assignRole($role);
    }
}
