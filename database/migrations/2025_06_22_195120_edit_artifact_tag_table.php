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
        Schema::table('artifact_tag', function (Blueprint $table) {
            $table->renameColumn('item_id', 'artifact_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artifact_tag', function (Blueprint $table) {
            $table->renameColumn('artifact_id', 'item_id');
        });
    }
};
