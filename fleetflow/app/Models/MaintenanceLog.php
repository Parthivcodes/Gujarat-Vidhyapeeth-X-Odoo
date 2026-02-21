<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\MaintenanceStatus;

class MaintenanceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id', 'type', 'description', 'cost',
        'odometer_at_service', 'scheduled_date', 'completed_date',
        'status', 'service_provider', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'cost' => 'decimal:2',
            'odometer_at_service' => 'decimal:2',
            'scheduled_date' => 'date',
            'completed_date' => 'date',
            'status' => MaintenanceStatus::class ,
        ];
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', MaintenanceStatus::SCHEDULED);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', MaintenanceStatus::SCHEDULED)
            ->where('scheduled_date', '>=', now())
            ->orderBy('scheduled_date');
    }
}
