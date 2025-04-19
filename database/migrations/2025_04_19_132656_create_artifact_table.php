<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('artifact', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('condition')->default('good');
            $table->string('location')->nullable();
            $table->unsignedBigInteger('relation')->nullable();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('category_id');
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('category_id')->references('id')->on('category');
            $table->foreign('relation')->references('id')->on('artifact');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('artifact');
    }
};