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
            // Artifacts
            'artifacts.view', 'artifacts.create', 'artifacts.edit', 'artifacts.delete',
            // Dashboard
            'dashboard.view',
            // Projects
            'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
            // Maps
            'maps.view',
            // Acquisitions
            'acquisitions.view', 'acquisitions.create', 'acquisitions.edit', 'acquisitions.delete',
            // Users
            'users.view', 'users.create', 'users.edit', 'users.delete',
            // Roles
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
            // Logs
            'logs.view',
            // Archives
            'archives.view', 'archives.create', 'archives.edit', 'archives.delete',
            // Project Proposals
            'proposals.view', 'proposals.create', 'proposals.edit', 'proposals.delete',
            // Project Reports
            'reports.view', 'reports.create', 'reports.edit', 'reports.delete',
            // AI Assistant
            'ai.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Roles and their permissions
        $rolePermissions = [
            'SuperAdmin' => $permissions,
            'HOD' => [
                'dashboard.view',
                'projects.view', 'projects.edit',
                'proposals.view', 'proposals.edit',
                'reports.view', 'reports.edit',
                'users.view',
                'logs.view',
                'archives.view',
                'maps.view',
                'artifacts.view',
            ],
            'Inventory Manager' => [
                'dashboard.view',
                'artifacts.view', 'artifacts.create', 'artifacts.edit',
                'acquisitions.view', 'acquisitions.create', 'acquisitions.edit',
                'archives.view', 'archives.create', 'archives.edit',
                'maps.view',
                'logs.view',
            ],
            'Researcher' => [
                'dashboard.view',
                'artifacts.view',
                'archives.view',
                'maps.view',
                'proposals.create', 'proposals.view',
                'reports.create', 'reports.view',
                'ai.view',
            ],
            'Curator' => [
                'dashboard.view',
                'artifacts.view','artifacts.create','artifacts.edit','artifacts.delete',
                'maps.view',
                'ai.view',
                'reports.view',
                'archives.view', 'archives.create', 'archives.edit', 'archives.delete',
            ]
        ];

        foreach ($rolePermissions as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($perms);
        }

        // Create users for each role
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@museum.ke',
                'role' => 'SuperAdmin',
            ],
            [
                'name' => 'Head of Department',
                'email' => 'hod@museum.ke',
                'role' => 'HOD',
            ],
            [
                'name' => 'Inventory Manager',
                'email' => 'inventory@museum.ke',
                'role' => 'Inventory Manager',
            ],
            [
                'name' => 'Researcher',
                'email' => 'researcher@museum.ke',
                'role' => 'Researcher',
            ],
            [
                'name' => 'Curator',
                'email' => 'curator@museum.ke',
                'role' => 'Curator',
            ]
        ];

        foreach ($users as $userData) {
            $user = User::where('email', $userData['email'])->first();
            if (!$user) {
                $user = User::factory()->create([
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                ]);
            }
            $user->assignRole($userData['role']);
        }
    }
}
