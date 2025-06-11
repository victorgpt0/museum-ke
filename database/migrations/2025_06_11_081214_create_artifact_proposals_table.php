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
         Schema::create('artifact_proposals', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description');
        $table->string('source');
        $table->enum('proposal_status', ['pending', 'approved', 'rejected'])->default('pending');
        $table->foreignId('donor_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artifact_proposals');
    }
};
