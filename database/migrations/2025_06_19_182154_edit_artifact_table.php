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
            $table->dropForeign('artifact_relation_foreign');
            $table->dropColumn('relation');
            $table->date('acquisition_date')->nullable();
            $table->foreignId('donor_id')->nullable()->constrained('donors');
            $table->jsonb('metadata')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artifact', function (Blueprint $table) {
           $table->foreignId('relation')->nullable()->constrained('artifact');
           $table->dropColumn('acquisition_date');
           $table->dropColumn('donor_id');
           $table->dropColumn('metadata');
        });
    }
};
