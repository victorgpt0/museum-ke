<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * REUSABLE MIGRATION TEMPLATE
 * 
 * TEMPLATE USAGE INSTRUCTIONS:
 * 1. Change class name from 'CreateMilestonesTable' to 'Create[YourModel]sTable'
 * 2. Update table name in Schema::create() from 'milestones' to your table name
 * 3. Modify column definitions in the up() method
 * 4. Update foreign key references and constraints
 * 5. Change table name in down() method to match
 * 
 * GENERATE MIGRATION COMMAND:
 * php artisan make:migration create_milestones_table
 */

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This method defines the table structure
     */
    public function up(): void
    {
        Schema::create('milestones', function (Blueprint $table) {
            // PRIMARY KEY - Auto-incrementing ID
            $table->id();
            
            // BASIC FIELDS - Update these based on your model
            $table->string('title', 255);                           // VARCHAR(255) - Main title
            $table->text('description')->nullable();                // TEXT - Long description (optional)
            $table->date('due_date')->nullable();                   // DATE - Due date (optional)
            $table->text('performance_description')->nullable();    // TEXT - Performance details (optional)
            
            // FOREIGN KEY FIELDS
            $table->foreignId('project_id')                         // BIGINT UNSIGNED - Foreign key
                  ->constrained('projects')                         // References 'id' on 'projects' table
                  ->onUpdate('cascade')                             // Update cascade
                  ->onDelete('cascade');                            // Delete cascade - remove milestones when project is deleted
            
            // ALTERNATIVE FOREIGN KEY SYNTAX (if you need more control):
            // $table->unsignedBigInteger('project_id');
            // $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            
            // TIMESTAMPS - Automatic created_at and updated_at
            $table->timestamps();
            
            // INDEXES for better query performance
            $table->index('project_id');                            // Index on foreign key
            $table->index('due_date');                              // Index on commonly queried date field
            $table->index(['project_id', 'due_date']);              // Composite index for common queries
            
            // ADDITIONAL COLUMN EXAMPLES FOR REUSE:
            
            // STRING COLUMNS
            // $table->string('status', 50)->default('pending');           // VARCHAR with default
            // $table->string('slug')->unique();                           // Unique string field
            
            // NUMERIC COLUMNS  
            // $table->integer('priority')->default(1);                    // INT with default
            // $table->decimal('amount', 10, 2);                           // DECIMAL(10,2) for money
            // $table->boolean('is_active')->default(true);                // BOOLEAN with default
            
            // DATE/TIME COLUMNS
            // $table->datetime('completed_at')->nullable();               // DATETIME (optional)
            // $table->timestamp('published_at')->nullable();              // TIMESTAMP (optional)
            
            // JSON COLUMN (for storing flexible data)
            // $table->json('metadata')->nullable();                       // JSON field
            
            // ENUM COLUMN
            // $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     * 
     * This method should undo what the up() method does
     */
    public function down(): void
    {
        // Drop the table - change 'milestones' to your table name
        Schema::dropIfExists('milestones');
    }
};