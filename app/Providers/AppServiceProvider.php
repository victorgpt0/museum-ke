<?php

namespace App\Providers;

use Hashids\Hashids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('hashids', function () {
            return new Hashids(config('hashids.salt'), config('hashids.min_length'));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        DB::prohibitDestructiveCommands($this->app->isProduction());
        Model::shouldBeStrict();
        Model::unguard();
//        URL::forceScheme('https');
        Vite::usePrefetchStrategy('aggressive');

    }
}
