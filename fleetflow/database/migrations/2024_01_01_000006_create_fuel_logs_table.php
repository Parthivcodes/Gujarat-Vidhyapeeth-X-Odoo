<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('fuel_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->constrained()->onDelete('cascade');
            $table->foreignId('trip_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('liters', 10, 2);
            $table->decimal('cost_per_liter', 8, 2);
            $table->decimal('total_cost', 12, 2);
            $table->decimal('odometer', 12, 2);
            $table->dateTime('fueled_at');
            $table->string('station')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('fueled_at');
            $table->index(['vehicle_id', 'fueled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fuel_logs');
    }
};
