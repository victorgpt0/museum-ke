<?php

namespace App\Models;

use App\Support\Facade\Hashids;
use Illuminate\Database\Eloquent\ModelNotFoundException;

trait HasHashId
{
    public function getHashIdAttribute(): string
    {
        return Hashids::encode($this->id);
    }

    public static function findOrFailByHashId(string $hashId)
    {
        $id = Hashids::decode($hashId);

        if (empty($id)) {
            throw new ModelNotFoundException();
        }

        return static::findOrFail($id[0]);
    }
}
