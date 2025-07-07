<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('artifact', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('metadata');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('status');
        });

        Schema::table('archives', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artifact', function (Blueprint $table) {
            $table->dropColumn('is_published');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('is_published');
        });

        Schema::table('archives', function (Blueprint $table) {
            $table->dropColumn('is_published');
        });
    }
};
