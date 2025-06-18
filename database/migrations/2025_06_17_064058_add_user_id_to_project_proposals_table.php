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
    Schema::table('project_proposals', function (Blueprint $table) {
        // Step 1: Add the column as nullable first
        $table->unsignedBigInteger('user_id')->nullable()->after('id');
    });

    // Step 2: Fill existing records with default user_id = 1
    \Illuminate\Support\Facades\DB::table('project_proposals')->update(['user_id' => 1]);

    // Step 3: Make the column NOT NULL and add foreign key
    Schema::table('project_proposals', function (Blueprint $table) {
        $table->unsignedBigInteger('user_id')->nullable(false)->change();
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_proposals', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
