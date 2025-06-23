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
        Schema::create('artifact_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artifact_id')->constrained('artifact','id')->onDelete('cascade');
            $table->foreignId('related_artifact_id')->constrained('artifact')->onDelete('cascade');
            $table->string('relation_type')->nullable();
            $table->timestamps();
            $table->unique(['artifact_id','related_artifact_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artifact_relations');
    }
};
