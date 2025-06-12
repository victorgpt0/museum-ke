<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Project Migration
 * 
 * GENERATE MIGRATION COMMAND:
 * php artisan make:migration create_projects_table
 */

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            // Primary key
            $table->id();
            
            // Project fields
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('duration', 100)->nullable();  // e.g., "3 months", "6 weeks"
            $table->date('start_date')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            $table->index('start_date');
            $table->index('title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};