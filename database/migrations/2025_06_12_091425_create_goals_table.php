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
    Schema::create('goals', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->integer('performance');
        $table->text('description')->nullable();

        // Foreign key to milestones table
        $table->unsignedBigInteger('milestone_id');
        $table->foreign('milestone_id')->references('id')->on('milestones')->onDelete('cascade');

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
