<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('goals', function (Blueprint $table) {
            $table->tinyInteger('performance_indicator')
                  ->unsigned()
                  ->nullable()
                  ->after('performance')
                  ->comment('Performance rating (1-10)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('goals', function (Blueprint $table) {
            $table->dropColumn('performance_indicator');
        });
    }
};