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
        Schema::create('artifact_archives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artifact_id')->constrained('artifact')->onDelete('cascade');
            $table->foreignId('archive_id')->constrained('archives')->onDelete('cascade');
            
            // Relationship metadata
            $table->enum('relationship_type', [
                'conservation_report',
                'excavation_notes', 
                'research_paper',
                'exhibition_catalog',
                'provenance_document',
                'condition_assessment',
                'acquisition_document',
                'photographic_record',
                'technical_analysis',
                'other'
            ])->default('other');
            
            $table->text('notes')->nullable(); // Additional context about the relationship
            $table->date('document_date')->nullable(); // When the document was created
            $table->string('document_author')->nullable(); // Who created the document
            $table->boolean('is_primary')->default(false); // Is this the main document for this artifact?
            
            $table->timestamps();
            
            // Prevent duplicate relationships
            $table->unique(['artifact_id', 'archive_id']);
            
            // Indexes for performance
            $table->index(['artifact_id', 'relationship_type']);
            $table->index(['archive_id', 'relationship_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artifact_archives');
    }
}; 