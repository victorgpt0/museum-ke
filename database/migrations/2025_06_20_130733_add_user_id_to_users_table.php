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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });
        Schema::table('archives', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });
        Schema::table('artifact_proposals', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });
        Schema::table('donors', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });
        Schema::table('findings', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });
        Schema::table('goals', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });
        Schema::table('milestones', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });
        Schema::table('roles', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::table('archives', function (Blueprint $table) {
            $table->dropForeign('archives_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::table('artifact_proposals', function (Blueprint $table) {
            $table->dropForeign('artifact_proposals_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::table('donors', function (Blueprint $table) {
            $table->dropForeign('donors_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::table('findings', function (Blueprint $table) {
            $table->dropForeign('findings_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::table('goals', function (Blueprint $table) {
            $table->dropForeign('goals_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::table('milestones', function (Blueprint $table) {
            $table->dropForeign('milestones_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign('projects_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::table('roles', function (Blueprint $table) {
            $table->dropForeign('roles_user_id_foreign');
            $table->dropColumn('user_id');
        });
    }
};
