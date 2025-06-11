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
       
    Schema::create('donors', function (Blueprint $table) {
        $table->id();
        $table->string('fullname');
        $table->string('contact');
        $table->string('email')->unique();
        $table->string('next_of_kin_fullname');
        $table->string('next_of_kin_email');
        $table->string('next_of_kin_contact');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donors');
    }
};
