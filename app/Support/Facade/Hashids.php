<?php

namespace App\Support\Facade;

use Illuminate\Support\Facades\Facade;

class Hashids extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'hashids';
    }
}
