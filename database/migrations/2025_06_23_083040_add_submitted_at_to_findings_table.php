<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSubmittedAtToFindingsTable extends Migration
{
    public function up()
    {
        Schema::table('findings', function (Blueprint $table) {
            $table->dateTime('submitted_at')->nullable()->after('description');
        });
    }

    public function down()
    {
        Schema::table('findings', function (Blueprint $table) {
            $table->dropColumn('submitted_at');
        });
    }
}
