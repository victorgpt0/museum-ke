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
        Schema::table('goals', function (Blueprint $table) {
            // Make 'performance' column nullable
            $table->integer('performance')->nullable()->change();

            // Remove the old 'performance_indicator' column if it exists
            if (Schema::hasColumn('goals', 'performance_indicator')) {
                $table->dropColumn('performance_indicator');
            }

            // Add the new 'comments' column
            $table->text('comments')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('goals', function (Blueprint $table) {
            // Revert 'performance' to not nullable
            $table->integer('performance')->nullable(false)->change();

            // Re-add 'performance_indicator' as string or text (adjust as per previous type)
            $table->string('performance_indicator')->nullable();

            // Remove the 'comments' column
            $table->dropColumn('comments');
        });
    }
};
