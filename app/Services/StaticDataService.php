<?php

namespace App\Services;

use Spatie\Permission\Models\Role;

class StaticDataService
{
    public static function getRoles()
    {
        return Role::select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(function ($role) {
                return [
                    'value' => $role->id,
                    'label' => $role->name
                ];
            });
    }

}
