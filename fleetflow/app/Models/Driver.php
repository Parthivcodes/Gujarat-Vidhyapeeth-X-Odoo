<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\DriverStatus;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'license_number', 'license_expiry',
        'phone', 'status', 'total_trips', 'safety_score', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'license_expiry' => 'date',
            'status' => DriverStatus::class ,
            'safety_score' => 'decimal:2',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function fuelLogs()
    {
        return $this->hasMany(FuelLog::class);
    }

    public function performances()
    {
        return $this->hasMany(DriverPerformance::class);
    }

    public function complianceRecords()
    {
        return $this->hasMany(ComplianceRecord::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', DriverStatus::AVAILABLE);
    }

    public function scopeWithValidLicense($query)
    {
        return $query->where('license_expiry', '>', now());
    }

    // Helpers
    public function isAvailable(): bool
    {
        return $this->status === DriverStatus::AVAILABLE;
    }

    public function hasValidLicense(): bool
    {
        return $this->license_expiry->isFuture();
    }
}
